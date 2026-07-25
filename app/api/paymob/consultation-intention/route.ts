// POST /api/paymob/consultation-intention
// Public endpoint — creates a Paymob payment intention for consultation booking
// No auth required (consultation page is public)

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, name, email, phone, day, slot, minutes, notes, isFirstTime } = body;

    if (!amount || !name || !email || !day || !slot) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const amountInHalalas = Math.round(Number(amount) * 100);
    const integrationId = parseInt(process.env.PAYMOB_INTEGRATION_ID || '0', 10);

    if (!integrationId) {
      return NextResponse.json({ error: 'Payment not configured' }, { status: 500 });
    }

    const consultationDetails = {
      name,
      email,
      phone,
      day,
      slot,
      minutes: minutes || 75,
      notes: notes || '',
      isFirstTime: Boolean(isFirstTime),
    };

    const intentionPayload = {
      amount: amountInHalalas,
      currency: 'SAR',
      payment_methods: [integrationId],
      items: [{
        name: 'استشارة — مرفأ',
        amount: amountInHalalas,
        description: `استشارة مع Eng. Ahmad Younis — ${day} | ${slot}`,
        quantity: 1,
      }],
      billing_data: {
        first_name: name.split(' ')[0] || 'Customer',
        last_name: name.split(' ').slice(1).join(' ') || '',
        phone_number: phone,
        email: email,
      },
      extras: {
        source: 'consultation',
        consultation: JSON.stringify(consultationDetails),
      },
      redirection_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/consultation-success`,
    };

    const paymobSecretKey = process.env.PAYMOB_SECRET_KEY;
    if (!paymobSecretKey) {
      return NextResponse.json({ error: 'Payment not configured' }, { status: 500 });
    }

    const paymobBaseUrl = 'https://ksa.paymob.com';

    const res = await fetch(`${paymobBaseUrl}/v1/intention/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${paymobSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(intentionPayload),
    });

    const paymobData = await res.json();

    if (!res.ok) {
      console.error('[Paymob Consultation] Intention error:', paymobData);
      return NextResponse.json({ error: 'Failed to create payment' }, { status: res.status });
    }

    return NextResponse.json({
      client_secret: paymobData.client_secret,
      intention_id: paymobData.id,
    });
  } catch (error: unknown) {
    console.error('[Paymob Consultation]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
