// POST /api/paymob/intention
// Creates a Paymob payment intention and returns client_secret for Unified Checkout

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { CONTRIBUTION_FLOOR } from '@/lib/contributionTiers';

const MEETING_PRODUCT_ID = 'f0848f83-ad00-4528-9936-b2a19f5e3ba2';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, price, name, applePay } = body;

    if (!price || !productId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Server-side price floor for meeting product
    if (productId === MEETING_PRODUCT_ID && price < CONTRIBUTION_FLOOR) {
      return NextResponse.json({ error: `الحد الأدنى للاشتراك ${CONTRIBUTION_FLOOR} ريال` }, { status: 400 });
    }

    const amountInHalalas = Math.round(price * 100);

    const integrationId = applePay
      ? parseInt(process.env.PAYMOB_APPLE_PAY_INTEGRATION_ID || '0', 10)
      : parseInt(process.env.PAYMOB_INTEGRATION_ID || '0', 10);

    if (!integrationId) {
      return NextResponse.json({ error: 'Payment method not configured' }, { status: 500 });
    }

    const intentionPayload = {
      amount: amountInHalalas,
      currency: 'SAR',
      payment_methods: [integrationId],
      items: [{
        name: name || 'Subscription',
        amount: amountInHalalas,
        description: `Subscription for product: ${productId}`,
        quantity: 1,
      }],
      billing_data: {
        first_name: user.user_metadata?.full_name?.split(' ')[0] || 'Customer',
        last_name: user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || 'User',
        phone_number: user.phone || '+966500000000',
        email: user.email || 'customer@example.com',
      },
      extras: {
        user_id: user.id,
        product_id: productId,
      },
      redirection_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/payment-success`,
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/paymob/webhook`,
    };

    const paymobSecretKey = process.env.PAYMOB_SECRET_KEY;
    if (!paymobSecretKey) {
      return NextResponse.json({ error: 'Server misconfiguration: missing PAYMOB_SECRET_KEY' }, { status: 500 });
    }

    const paymobBaseUrl = paymobSecretKey.startsWith('sau_')
      ? 'https://ksa.paymob.com'
      : 'https://accept.paymob.com';

    const response = await fetch(`${paymobBaseUrl}/v1/intention/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${paymobSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(intentionPayload),
    });

    const paymobData = await response.json();

    if (!response.ok) {
      console.error('[Paymob] Intention API Error:', paymobData);
      return NextResponse.json({ error: 'Failed to create payment intention', details: paymobData }, { status: response.status });
    }

    return NextResponse.json({
      client_secret: paymobData.client_secret,
      intention_id: paymobData.id,
    });
  } catch (error: unknown) {
    console.error('Payment Error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
  }
}
