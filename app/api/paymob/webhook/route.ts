// POST /api/paymob/webhook
// Receives Paymob server-to-server notifications. HMAC-verified.
// Updates profiles.subscription_tier, creates subscription records.

import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import crypto from 'crypto';
import { getTier } from '@/lib/contributionTiers';
import { Resend } from 'resend';

const MEETING_PRODUCT_ID = 'f0848f83-ad00-4528-9936-b2a19f5e3ba2';

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

async function verifyTransactionWithPaymob(transactionId: unknown, amountCents: unknown, secretKey: string | undefined): Promise<boolean> {
  if (!transactionId || !secretKey) return false;
  const baseUrl = secretKey.startsWith('sau_') ? 'https://ksa.paymob.com' : 'https://accept.paymob.com';
  try {
    const res = await fetch(`${baseUrl}/api/acceptance/transactions/${transactionId}`, {
      headers: { 'Authorization': `Token ${secretKey}` },
    });
    if (!res.ok) return false;
    const tx = (await res.json()) as { success?: boolean; pending?: boolean; amount_cents?: number };
    const amountMatches = amountCents === undefined || amountCents === null || Number(tx.amount_cents) === Number(amountCents);
    return tx.success === true && !tx.pending && amountMatches;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const hmacSecret = process.env.PAYMOB_HMAC;
  const paymobSecretKey = process.env.PAYMOB_SECRET_KEY;

  let payload: Record<string, unknown>;
  try { payload = await request.json() as Record<string, unknown>; } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const transaction = payload?.obj as Record<string, unknown> | undefined;
  if (!transaction) {
    return NextResponse.json({ error: 'Missing transaction object' }, { status: 400 });
  }

  // Verify authenticity: prefer HMAC; fall back to server-to-server verification when HMAC is unset
  if (hmacSecret) {
    if (!verifyHmac(transaction, hmacSecret)) {
      console.warn('[Paymob Webhook] HMAC FAILED — rejecting');
      return NextResponse.json({ error: 'Invalid HMAC' }, { status: 401 });
    }
  } else {
    const verified = await verifyTransactionWithPaymob(transaction.id, transaction.amount_cents, paymobSecretKey);
    if (!verified) {
      console.warn('[Paymob Webhook] Server-side verification FAILED — rejecting');
      return NextResponse.json({ error: 'Unverified transaction' }, { status: 401 });
    }
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

    const paidAmount = Number(transaction.amount_cents) / 100;

    // Meeting product: write contribution tier + amount
    let tier: ReturnType<typeof getTier> = null;
    if (product_id === MEETING_PRODUCT_ID) {
      tier = getTier(paidAmount);
      await supabaseAdmin.from('profiles')
        .update({
          contribution_tier: tier?.key ?? null,
          contribution_amount: paidAmount,
          updated_at: now.toISOString(),
        })
        .eq('id', user_id);
      await supabaseAdmin.from('subscriptions')
        .update({ amount: paidAmount })
        .eq('user_id', user_id)
        .eq('status', 'active');
    }

    // Notify admin for ANY product
    const { data: userProfile } = await supabaseAdmin
      .from('profiles')
      .select('email, full_name')
      .eq('id', user_id)
      .single();
    const userEmail = userProfile?.email || 'unknown';
    const userName = userProfile?.full_name || 'مستخدم';

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'مرفأ <noreply@marfa.sa>',
        to: ['ceo@marfa.sa', 'op.younis@gmail.com'],
        subject: `💰 اشتراك جديد — ${paidAmount} ريال | ${userName}`,
        html: `<div dir="rtl" style="font-family:'Tajawal',sans-serif;text-align:right">
          <h2 style="color:#c9a84c">اشتراك جديد في مرفأ</h2>
          <table>
            <tr><td><b>الاسم:</b></td><td>${userName}</td></tr>
            <tr><td><b>البريد:</b></td><td>${userEmail}</td></tr>
            <tr><td><b>المبلغ:</b></td><td style="color:#c9a84c;font-size:1.5rem;font-weight:bold">${paidAmount} ريال</td></tr>
            ${tier ? `<tr><td><b>الفئة:</b></td><td>${tier.ar} (${tier.en})</td></tr>` : ''}
            <tr><td><b>رقم العملية:</b></td><td>${transaction.id}</td></tr>
          </table>
        </div>`,
      }).catch(() => {}); // fire-and-forget
    }

    // Notify the customer about their new tier
    const tierLabel = subscriptionTier === 'enterprise' ? 'إنتربرايز' : subscriptionTier === 'pro' ? 'برو' : 'مجاني';
    if (process.env.RESEND_API_KEY && userEmail && userEmail !== 'unknown') {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'مرفأ <noreply@marfa.sa>',
        to: userEmail,
        subject: '🎉 تم تفعيل اشتراكك في مرفأ',
        html: `<div dir="rtl" style="font-family:'Tajawal',sans-serif;background:#faf8f2;padding:24px;max-width:560px;margin:0 auto;border:1px solid #c9a84c33;border-radius:16px;text-align:right">
          <h2 style="color:#c9a84c;margin:0 0 16px">🎉 تم تفعيل اشتراكك</h2>
          <p style="color:#0a0f1e;font-size:15px;line-height:1.8">مرحباً ${userName}،</p>
          <p style="color:#4a5b78;font-size:14px;line-height:1.8">يسعدنا إعلامك بأنه تم تفعيل اشتراكك بنجاح في منصة مرفأ.</p>
          <p style="color:#4a5b78;font-size:14px;line-height:1.8">الفئة الجديدة: <b style="color:#c9a84c">${tierLabel}</b></p>
          <p style="color:#4a5b78;font-size:14px;line-height:1.8">نشكرك على ثقتك، ونتطلع إلى رؤيتك في لقاءاتنا القادمة.</p>
          <hr style="border:none;border-top:1px solid #c9a84c33;margin:20px 0">
          <p style="color:#8a94a8;font-size:12px;margin:0">فريق مرفأ — حيث تَرسو الطموحات</p>
        </div>`,
      }).catch(() => {}); // fire-and-forget
    }

    console.log(`[Paymob Webhook] ✅ Fulfilled: user ${user_id} → ${subscriptionTier}`);
    return NextResponse.json({ received: true, fulfilled: true });
  } catch (error: unknown) {
    console.error('[Paymob Webhook] Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
