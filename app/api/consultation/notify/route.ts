import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { escapeHtml } from '@/lib/security';

const NOTIFY_EMAIL = '10.younis@gmail.com';

export async function POST(request: NextRequest) {
  try {
    let body: {
      name?: unknown;
      email?: unknown;
      phone?: unknown;
      isFirstTime?: unknown;
      price?: unknown;
      day?: unknown;
      slot?: unknown;
      minutes?: unknown;
      notes?: unknown;
    };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const name = typeof body.name === 'string' ? body.name.trim().slice(0, 100) : '';
    const email = typeof body.email === 'string' ? body.email.trim().slice(0, 200) : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim().slice(0, 30) : '';
    const isFirstTime = Boolean(body.isFirstTime);
    const price = typeof body.price === 'number' ? body.price : 0;
    const day = typeof body.day === 'string' ? body.day.trim().slice(0, 100) : '';
    const slot = typeof body.slot === 'string' ? body.slot.trim().slice(0, 50) : '';
    const minutes = typeof body.minutes === 'number' ? body.minutes : 75;
    const notes = typeof body.notes === 'string' ? body.notes.trim().slice(0, 500) : '';

    if (!name || !email || !phone || !day || !slot) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const typeLabel = isFirstTime ? 'أول مرة' : 'متابعة';
    const now = new Date().toLocaleString('ar-SA', { timeZone: 'Asia/Riyadh' });

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'Marfa <noreply@marfa.sa>',
      to: NOTIFY_EMAIL,
      subject: `حجز استشارة جديد — ${name}`,
      html: `<div dir="rtl" style="font-family:Tajawal,Cairo,sans-serif;background:#faf8f2;padding:24px;max-width:600px;margin:0 auto;border-radius:12px">
        <h2 style="color:#c9a84c;margin-bottom:16px">حجز استشارة جديد</h2>

        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#4a5b78"><strong>الاسم:</strong></td><td style="color:#0a0f1e">${escapeHtml(name)}</td></tr>
          <tr><td style="padding:8px 0;color:#4a5b78"><strong>الإيميل:</strong></td><td style="color:#0a0f1e;direction:ltr;text-align:right">${escapeHtml(email)}</td></tr>
          <tr><td style="padding:8px 0;color:#4a5b78"><strong>الجوال:</strong></td><td style="color:#0a0f1e;direction:ltr;text-align:right">${escapeHtml(phone)}</td></tr>
          <tr><td style="padding:8px 0;color:#4a5b78"><strong>النوع:</strong></td><td style="color:#0a0f1e">${escapeHtml(typeLabel)}</td></tr>
          <tr><td style="padding:8px 0;color:#4a5b78"><strong>السعر:</strong></td><td style="color:#0a0f1e">${price}$</td></tr>
          <tr><td style="padding:8px 0;color:#4a5b78"><strong>المدة:</strong></td><td style="color:#0a0f1e">${minutes} دقيقة</td></tr>
          <tr><td style="padding:8px 0;color:#4a5b78"><strong>الموعد:</strong></td><td style="color:#0a0f1e">${escapeHtml(day)} | ${escapeHtml(slot)}</td></tr>
          ${notes ? `<tr><td style="padding:8px 0;color:#4a5b78"><strong>ملاحظات:</strong></td><td style="color:#0a0f1e">${escapeHtml(notes)}</td></tr>` : ''}
        </table>

        <hr style="border-color:#c9a84c20;margin:20px 0">

        <p style="color:#8a94a8;font-size:12px">تم الحجز عبر marfa.sa/consultation — ${now}</p>
      </div>`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[consultation-notify]', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
