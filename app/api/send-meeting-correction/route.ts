import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createServiceClient } from '@/lib/supabase/service';
import { SCHEDULE_DATA, getFridayDates, formatDate } from '@/app/components/marfa/scheduleData';

export const dynamic = 'force-dynamic';

// One-shot route — remove after sending.
const TEMP_TOKEN = 'corr-9f3a1c7e-2b4d-4e8a-b6c5-1d0f2a3b4c5d';

function buildCorrectionHTML(email: string, meeting: (typeof SCHEDULE_DATA)[number], dateStr: string): string {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="UTF-8"></head>
<body style="font-family: 'Tajawal', 'Cairo', sans-serif; direction: rtl; background: #faf8f2; padding: 30px; margin: 0;">
<div style="max-width: 600px; margin: auto; background: #ffffff; border: 1px solid #c9a84c33; border-radius: 24px; overflow: hidden; box-shadow: 0 8px 30px rgba(10,15,30,0.06);">

  <div style="background: linear-gradient(135deg, #0a0f1e, #0d1628); padding: 32px 24px; text-align: center;">
    <h1 style="color: #c9a84c; font-size: 24px; margin: 0 0 8px 0;">⚓ مرفأ — لقاءات دراسات الحالة</h1>
    <p style="color: #a0aec0; font-size: 13px; margin: 0;">حيث تَرسو الطموحات</p>
  </div>

  <div style="padding: 32px 24px;">

    <div style="border: 2px solid #e11d48; border-radius: 16px; padding: 20px; background: #fff1f2; margin-bottom: 24px;">
      <h2 style="color: #be123c; font-size: 17px; margin: 0 0 10px 0; text-align: center;">⚠️ تصحيح وتوضيح</h2>
      <p style="color: #4a5b78; font-size: 14px; line-height: 1.9; margin: 0; text-align: center;">
        وصلتك رسالة سابقة حدّدت موضوع لقاء الغد بشكل غير دقيق. نعتذر عن هذا الالتباس، ونؤكد لك التفاصيل الصحيحة أدناه.
      </p>
    </div>

    <div style="border: 2px solid #c9a84c; border-radius: 16px; padding: 24px; background: #faf8f2;">
      <h2 style="color: #0a0f1e; font-size: 18px; margin: 0 0 16px 0; text-align: center;">📅 دعوة لحضور ${meeting.encounter}</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 10px 12px; font-weight: bold; color: #64748b; width: 110px;">📅 التاريخ</td><td style="padding: 10px 12px; color: #0a0f1e; font-weight: bold;">${dateStr}</td></tr>
        <tr><td style="padding: 10px 12px; font-weight: bold; color: #64748b;">🕐 الوقت</td><td style="padding: 10px 12px; color: #0a0f1e; font-weight: bold;">بعد صلاة الجمعة</td></tr>
        <tr><td style="padding: 10px 12px; font-weight: bold; color: #64748b;">📍 المكان</td><td style="padding: 10px 12px; color: #0a0f1e; font-weight: bold;"><a href="https://maps.app.goo.gl/hH2bhED852UMbL6Y9" style="color: #0a0f1e; text-decoration: underline;">فندق هوليداي فيلا حائل</a></td></tr>
        <tr><td style="padding: 10px 12px; font-weight: bold; color: #64748b;">📚 الموضوع</td><td style="padding: 10px 12px; color: #c9a84c; font-weight: bold;">${meeting.topic}</td></tr>
        <tr><td style="padding: 10px 12px; font-weight: bold; color: #64748b;">🏢 دراسة الحالة</td><td style="padding: 10px 12px; color: #0a0f1e;">${meeting.case}</td></tr>
        <tr><td style="padding: 10px 12px; font-weight: bold; color: #64748b; vertical-align: top;">🎯 التحدي</td><td style="padding: 10px 12px; color: #64748b; line-height: 1.7;">${meeting.challenge}</td></tr>
      </table>
    </div>

    <div style="margin-top: 24px; text-align: center;">
      <a href="https://www.marfa.sa/meetings" style="display: inline-block; background: #c9a84c; color: #0a0f1e; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 15px; margin-bottom: 10px;">📄 تصفح ملف PDF للقاء</a>
      <br/>
      <a href="https://www.marfa.sa/meetings/majlis/10" style="display: inline-block; border: 2px solid #c9a84c; color: #0a0f1e; padding: 12px 28px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 14px;">🏛️ انضم إلى المجلس الاستشاري</a>
    </div>

    <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #c9a84c44; text-align: center;">
      <p style="color: #64748b; font-size: 12px; margin: 0 0 4px 0;">📍 فندق هوليداي فيلا حائل — بعد صلاة الجمعة من كل أسبوع</p>
      <p style="color: #64748b; font-size: 11px; margin: 0;">www.marfa.sa &nbsp;|&nbsp; منصة مرفأ الاستثمارية &nbsp;|&nbsp; حائل 🇸🇦</p>
    </div>

  </div>
</div>
</body></html>`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('token') !== TEMP_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServiceClient();

  // اللقاء 10 — الاندماج والاستحواذ (عِلم/ثقة), tomorrow Friday 28 Aug 2026
  const meeting = SCHEDULE_DATA[9];
  const dateStr = formatDate(getFridayDates()[9]);

  const { data: subscribers } = await supabase
    .from('meeting_subscribers')
    .select('email')
    .order('subscribed_at', { ascending: true });

  if (!subscribers || subscribers.length === 0) {
    return NextResponse.json({ message: 'No subscribers found' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const results: { email: string; status: string }[] = [];

  for (const sub of subscribers) {
    try {
      const { error } = await resend.emails.send({
        from: 'Marfa Meetings <noreply@marfa.sa>',
        to: sub.email,
        subject: `تصحيح: لقاء مرفأ غداً الجمعة ${dateStr} — ${meeting.encounter} (${meeting.topic})`,
        html: buildCorrectionHTML(sub.email, meeting, dateStr),
      });
      results.push({ email: sub.email, status: error ? `فشل: ${error.message}` : 'تم الإرسال' });
    } catch (err: unknown) {
      results.push({ email: sub.email, status: `فشل: ${err instanceof Error ? err.message : String(err)}` });
    }
    // Resend rate limit: 2/sec — 600ms between sends
    await new Promise(r => setTimeout(r, 600));
  }

  const sent = results.filter(r => r.status === 'تم الإرسال').length;

  await resend.emails.send({
    from: 'Marfa Meetings <noreply@marfa.sa>',
    to: 'op.younis@gmail.com',
    subject: `📋 تقرير التصحيح — تم إرسال ${sent}/${subscribers.length} تصحيح للقاء ${meeting.encounter}`,
    html: `<div style="font-family: sans-serif; padding: 20px;"><h2>تقرير إرسال التصحيح</h2><p>اللقاء: ${meeting.encounter} — ${dateStr}</p><pre>${JSON.stringify(results, null, 2)}</pre></div>`,
  }).catch(() => {});

  return NextResponse.json({ success: true, sent, total: subscribers.length, results });
}
