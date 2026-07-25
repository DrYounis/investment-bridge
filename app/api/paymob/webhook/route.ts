// POST /api/paymob/webhook
// Receives Paymob server-to-server notifications. HMAC-verified.
// Updates profiles.subscription_tier, creates subscription records.

import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import crypto from 'crypto';

function verifyHmac(payload: Record<string, unknown>, hmacSecret: string): boolean {
  try {
    const order = payload.order as Record<string, unknown> | undefined;
    const sourceData = payload.source_data as Record<string, unknown> | undefined;
    const hmacFields = [
      payload.amount_cents, payload.created_at, payload.currency,
      payload.error_occured, payload.has_parent_transaction, payload.id,
      payload.integration_id, payload.is_3d_secure, payload.is_auth,
      payload.is_capture, payload.is_refunded, payload.is_standalone_payment,
      payload.is_voided, order?.id, payload.owner, payload.pending,
      sourceData?.pan, sourceData?.sub_type,
      sourceData?.type, payload.success,
    ];
    const concatenated = hmacFields.map(v => (v !== undefined && v !== null ? String(v) : '')).join('');
    const computed = crypto.createHmac('sha512', hmacSecret).update(concatenated).digest('hex');
    const received = payload.hmac as string | undefined;
    if (!received) return false;
    return crypto.timingSafeEqual(Buffer.from(computed, 'hex'), Buffer.from(received, 'hex'));
  } catch {
    return false;
  }
}

function mapTierLevel(tierLevel: string): 'free' | 'pro' | 'enterprise' {
  if (tierLevel === 'enterprise') return 'enterprise';
  if (tierLevel === 'pro') return 'pro';
  return 'free';
}

export async function POST(request: Request) {
  const hmacSecret = process.env.PAYMOB_HMAC;
  if (!hmacSecret) {
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  let payload: Record<string, unknown>;
  try { payload = await request.json() as Record<string, unknown>; } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const transaction = payload?.obj as Record<string, unknown> | undefined;
  if (!transaction) {
    return NextResponse.json({ error: 'Missing transaction object' }, { status: 400 });
  }

  if (!verifyHmac(transaction, hmacSecret)) {
    console.warn('[Paymob Webhook] HMAC FAILED — rejecting');
    return NextResponse.json({ error: 'Invalid HMAC' }, { status: 401 });
  }

  if (!transaction.success || transaction.pending) {
    return NextResponse.json({ received: true, fulfilled: false });
  }

  const extras = transaction.extra as Record<string, unknown> | undefined || {};
  const user_id = extras.user_id as string | undefined;
  const product_id = extras.product_id as string | undefined;

  if (!user_id) {
    console.error('[Paymob Webhook] Cannot identify user');
    return NextResponse.json({ error: 'Cannot identify user' }, { status: 422 });
  }

  try {
    const supabaseAdmin = createServiceClient();

    let subscriptionTier: 'free' | 'pro' | 'enterprise' = 'pro';
    let intervalMonths = 1;

    if (product_id) {
      const { data: product } = await supabaseAdmin
        .from('products')
        .select('tier_level, interval')
        .eq('id', product_id)
        .single();

      if (product) {
        subscriptionTier = mapTierLevel(product.tier_level);
        intervalMonths = product.interval === 'year' ? 12 : 1;
      }
    }

    const now = new Date();
    const endDate = new Date(now);
    endDate.setMonth(endDate.getMonth() + intervalMonths);

    await supabaseAdmin.from('transactions').insert({
      user_id,
      amount: Number(transaction.amount_cents) / 100,
      currency: transaction.currency || 'SAR',
      status: 'completed',
      provider: 'paymob',
      provider_transaction_id: String(transaction.id),
      product_id: product_id || null,
    });

    await supabaseAdmin.from('subscriptions')
      .update({ status: 'expired' })
      .eq('user_id', user_id)
      .eq('status', 'active');

    await supabaseAdmin.from('subscriptions').insert({
      user_id,
      product_id: product_id || null,
      status: 'active',
      start_date: now.toISOString(),
      end_date: endDate.toISOString(),
    });

    await supabaseAdmin.from('profiles')
      .update({ subscription_tier: subscriptionTier, updated_at: now.toISOString() })
      .eq('id', user_id);

    console.log(`[Paymob Webhook] ✅ Fulfilled: user ${user_id} → ${subscriptionTier}`);
    return NextResponse.json({ received: true, fulfilled: true });
  } catch (error: unknown) {
    console.error('[Paymob Webhook] Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
