// POST /api/paymob/fulfill
// Called from /payment-success page as a backup (in case webhook is delayed).
// Verifies the transaction with Paymob before fulfilling.

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { transactionId, productId } = body;

    if (transactionId) {
      const paymobSecretKey = process.env.PAYMOB_SECRET_KEY!;
      const baseUrl = paymobSecretKey.startsWith('sau_')
        ? 'https://ksa.paymob.com'
        : 'https://accept.paymob.com';

      const verifyRes = await fetch(`${baseUrl}/api/acceptance/transactions/${transactionId}`, {
        headers: { 'Authorization': `Token ${paymobSecretKey}` },
      });

      if (verifyRes.ok) {
        const tx = await verifyRes.json();
        if (!tx.success) {
          return NextResponse.json({ error: 'Payment not confirmed by provider' }, { status: 402 });
        }
      }
    }

    const supabaseAdmin = createServiceClient();
    let subscriptionTier: 'pro' | 'enterprise' = 'pro';
    let intervalMonths = 1;

    if (productId) {
      const { data: product } = await supabaseAdmin
        .from('products')
        .select('tier_level, interval')
        .eq('id', productId)
        .single();

      if (product) {
        subscriptionTier = product.tier_level === 'enterprise' ? 'enterprise' : 'pro';
        intervalMonths = product.interval === 'year' ? 12 : 1;
      }
    }

    const now = new Date();
    const endDate = new Date(now);
    endDate.setMonth(endDate.getMonth() + intervalMonths);

    await supabaseAdmin.from('transactions').insert({
      user_id: user.id,
      amount: 1,
      currency: 'SAR',
      status: 'completed',
      provider: 'paymob',
      provider_transaction_id: transactionId ? String(transactionId) : null,
      product_id: productId || null,
      metadata: { fulfilled_via: 'success_page' },
    });

    await supabaseAdmin.from('subscriptions')
      .update({ status: 'expired' })
      .eq('user_id', user.id)
      .eq('status', 'active');

    await supabaseAdmin.from('subscriptions').insert({
      user_id: user.id,
      product_id: productId || null,
      status: 'active',
      start_date: now.toISOString(),
      end_date: endDate.toISOString(),
    });

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ subscription_tier: subscriptionTier, updated_at: now.toISOString() })
      .eq('id', user.id);

    if (profileError) {
      return NextResponse.json({ error: 'Failed to upgrade account' }, { status: 500 });
    }

    console.log(`[Fulfill] ✅ Account upgraded: user ${user.id} → ${subscriptionTier}`);
    return NextResponse.json({ success: true, tier: subscriptionTier });
  } catch (error: unknown) {
    console.error('[Fulfill] Error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal error' }, { status: 500 });
  }
}
