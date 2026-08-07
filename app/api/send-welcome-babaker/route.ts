import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

const TEMP_TOKEN = 'welcome-babaker-9f4a2c1e-7b3d-4a8f-9e5c-6d2f1a0b3e8c';

// Meeting #8 — Friday, Aug 7, 2026
const meeting = {
  meetingNumber: 8,
  dateStr: 'الجمعة 7 أغسطس 2026',
  case: 'حالة "Netflix" (من تأجير DVD إلى الستريمنج)',
  topic: 'الابتكار',
  challenge: 'كيف تُقدم على تدمير نموذج عملك الناجح حالياً لتبني نموذجاً جديداً؟',
};

function buildEmail() {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="UTF-8"></head>
<body style="font-family:'Tajawal','Cairo',sans-serif;direction:rtl;background:#faf8f2;padding:30px;margin:0">
<div style="max-width:600px;margin:auto;background:#fff;border:1px solid #c9a84c33;border-radius:24px;overflow:hidden;box-shadow:0 8px 30px rgba(10,15,30,0.06)">

<div style="background:linear-gradient(135deg,#0a0f1e,#0d1628);padding:32px 24px;text-align:center">
  <h1 style="color:#c9a84c;font-size:24px;margin:0 0 8px 0">⚓ أهلاً بك في مرفأ</h1>
  <p style="color:#a0aec0;font-size:13px;margin:0">حيث تَرسو الطموحات</p>
</div>

<div style="padding:32px 24px">

  <div style="background:linear-gradient(135deg,#0a0f1e,#1a2540);padding:30px;border-radius:16px;margin-bottom:24px;text-align:center">
    <h2 style="color:#c9a84c;margin:0 0 12px 0;font-size:22px">🕌 أهلاً بك في مجتمع مرفأ الاستثماري</h2>
    <p style="color:#a0aec0;line-height:1.8;font-size:15px;margin:0">
      د. محمد أحمد بابكر، يسرّنا انضمامك إلى نخبة من رواد الأعمال والمستثمرين في منصة مرفأ.
      <br/>لقاءاتنا الأسبوعية تجمع بين دراسة الحالة والتحليل العملي — نتعلم معاً ونبني جسور الاستثمار.
    </p>
  </div>

  <div style="border:2px solid #c9a84c;border-radius:16px;padding:24px;background:#faf8f2">
    <h2 style="color:#0a0f1e;font-size:18px;margin:0 0 16px 0;text-align:center">📅 دعوة لحضور لقاء اليوم — ${meeting.meetingNumber}</h2>
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:10px 12px;font-weight:bold;color:#64748b;width:100px">📅 التاريخ</td><td style="padding:10px 12px;color:#0a0f1e;font-weight:bold">${meeting.dateStr}</td></tr>
      <tr><td style="padding:10px 12px;font-weight:bold;color:#64748b">🕐 الوقت</td><td style="padding:10px 12px;color:#0a0f1e;font-weight:bold">بعد صلاة الجمعة</td></tr>
      <tr><td style="padding:10px 12px;font-weight:bold;color:#64748b">📍 المكان</td><td style="padding:10px 12px;color:#0a0f1e;font-weight:bold"><a href="https://maps.app.goo.gl/hH2bhED852UMbL6Y9" style="color:#0a0f1e;text-decoration:underline">فندق هوليداي فيلا حائل</a></td></tr>
      <tr><td style="padding:10px 12px;font-weight:bold;color:#64748b">📚 الموضوع</td><td style="padding:10px 12px;color:#c9a84c;font-weight:bold">${meeting.topic}</td></tr>
      <tr><td style="padding:10px 12px;font-weight:bold;color:#64748b">🏢 دراسة الحالة</td><td style="padding:10px 12px;color:#0a0f1e">${meeting.case}</td></tr>
      <tr><td style="padding:10px 12px;font-weight:bold;color:#64748b;vertical-align:top">🎯 التحدي</td><td style="padding:10px 12px;color:#64748b;line-height:1.7">${meeting.challenge}</td></tr>
    </table>
  </div>

  <div style="margin-top:24px;text-align:center">
    <a href="https://www.marfa.sa/meetings" style="display:inline-block;background:#c9a84c;color:#0a0f1e;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:bold;font-size:15px">📄 تصفح ملفات اللقاءات</a>
  </div>

  <div style="margin-top:24px;text-align:center">
    <a href="https://www.marfa.sa/dashboard/hub" style="display:inline-block;background:linear-gradient(135deg,#c9a84c,#d4a843);color:#0a0f1e;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:bold;font-size:15px">🚢 ادخل إلى مرساك</a>
  </div>

  <div style="margin-top:28px;padding-top:20px;border-top:1px solid #c9a84c44;text-align:center">
    <p style="color:#64748b;font-size:11px;margin:0">www.marfa.sa &nbsp;|&nbsp; منصة مرفأ الاستثمارية &nbsp;|&nbsp; حائل 🇸🇦</p>
  </div>

</div></div></body></html>`;
}

export async function GET() {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: 'مرفأ <noreply@marfa.sa>',
    to: 'muhammedahmedbabekir@gmail.com',
    subject: `🚀 مرحباً بك في مرفأ + 🔔 لقاء اليوم ${meeting.meetingNumber} — ${meeting.dateStr}`,
    html: buildEmail(),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
