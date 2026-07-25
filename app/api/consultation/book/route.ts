import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createServiceClient } from '@/lib/supabase/service';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, notes, isFirstTime, price, durationMinutes } = await req.json();

    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'جميع الحقول المطلوبة فارغة' }, { status: 400 });
    }

    // Save booking to Supabase
    const svc = createServiceClient();
    const { error: insertErr } = await svc.from('consultation_bookings').insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      notes: notes?.trim() || '',
      is_first_time: isFirstTime,
      price,
      duration_minutes: durationMinutes,
      status: 'pending',
    });

    if (insertErr) {
      console.error('[consultation] insert failed:', insertErr.message);
    }

    // Email admin
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'مرفأ <noreply@marfa.sa>',
        to: 'ceo@marfa.sa',
        subject: `📅 حجز استشارة جديد — ${name} | ${isFirstTime ? 'أول مرة' : 'متابعة'} | ${price}$`,
        html: `<div dir="rtl" style="font-family:sans-serif;padding:20px">
          <h2>حجز استشارة جديد</h2>
          <p><strong>الاسم:</strong> ${name}</p>
          <p><strong>الإيميل:</strong> ${email}</p>
          <p><strong>الجوال:</strong> ${phone}</p>
          <p><strong>النوع:</strong> ${isFirstTime ? '🎉 أول مرة — 20$' : '🔁 متابعة — 100$'}</p>
          <p><strong>المدة:</strong> ${durationMinutes} دقيقة</p>
          <p><strong>الملاحظات:</strong> ${notes || '—'}</p>
        </div>`,
      });

      // Confirmation to client
      await resend.emails.send({
        from: 'مرفأ <noreply@marfa.sa>',
        to: email,
        subject: '✅ تم استلام طلب الاستشارة — مرفأ',
        html: `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"></head>
<body style="font-family:'Tajawal','Cairo',sans-serif;direction:rtl;background:#faf8f2;padding:30px;margin:0">
<div style="max-width:480px;margin:auto;background:#fff;border:1px solid #c9a84c33;border-radius:24px;overflow:hidden;box-shadow:0 8px 30px rgba(10,15,30,0.06)">
<div style="background:linear-gradient(135deg,#0a0f1e,#0d1628);padding:28px 24px;text-align:center">
  <h1 style="color:#c9a84c;font-size:20px;margin:0">✅ تم استلام طلبك</h1>
</div>
<div style="padding:24px;text-align:center">
  <p style="color:#4a5b78;font-size:14px;line-height:1.8;margin:0 0 16px 0">مرحباً ${name}،</p>
  <p style="color:#4a5b78;font-size:14px;line-height:1.8;margin:0 0 16px 0">تم استلام طلب استشارتك (${durationMinutes} دقيقة — ${price}$). سنتواصل معك خلال ٢٤ ساعة لتأكيد الموعد.</p>
  <div style="background:#faf8f2;border-radius:12px;padding:12px;margin-bottom:16px">
    <p style="color:#4a5b78;font-size:12px;margin:0">للتحويل البنكي بعد التأكيد:</p>
    <p style="color:#0a0f1e;font-size:12px;margin:4px 0 0 0" dir="ltr">IBAN: SA4745000000163199380001</p>
    <p style="color:#64748b;font-size:11px;margin:2px 0 0 0">Saudi Awwal Bank — Mohamad Younis</p>
  </div>
</div></div></body></html>`,
      });
    } catch (emailErr) {
      console.error('[consultation] email failed:', emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('[consultation]', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'حدث خطأ' }, { status: 500 });
  }
}
