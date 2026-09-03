import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createServiceClient } from '@/lib/supabase/service';
import { SCHEDULE_DATA, getMeetingNumberForFriday } from '@/app/components/marfa/scheduleData';

export const dynamic = 'force-dynamic';

const TEMP_TOKEN = 'tmp-marfa-meeting-7f3a9c2e8b14';

function getUpcomingFriday() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysUntilFriday = (5 - dayOfWeek + 7) % 7;
  const friday = new Date(now);
  friday.setDate(friday.getDate() + daysUntilFriday);

  const months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  const dateStr = `الجمعة ${friday.getDate()} ${months[friday.getMonth()]} ${friday.getFullYear()}`;

  const meetingNumber = getMeetingNumberForFriday(friday) ?? 0;
  const idx = meetingNumber - 1;
  const entry = idx >= 0 && idx < SCHEDULE_DATA.length ? SCHEDULE_DATA[idx] : SCHEDULE_DATA[0];

  return { dateStr, meetingNumber: meetingNumber || 1, case: entry.case, topic: entry.topic, challenge: entry.challenge };
}

function buildEmailHTML(name: string, meeting: ReturnType<typeof getUpcomingFriday>) {
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
    <div style="border: 2px solid #c9a84c; border-radius: 16px; padding: 24px; background: #faf8f2;">
      <h2 style="color: #0a0f1e; font-size: 18px; margin: 0 0 16px 0; text-align: center;">📅 دعوة لحضور اللقاء ${meeting.meetingNumber}</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 10px 12px; font-weight: bold; color: #64748b; width: 100px;">📅 التاريخ</td><td style="padding: 10px 12px; color: #0a0f1e; font-weight: bold;">${meeting.dateStr}</td></tr>
        <tr><td style="padding: 10px 12px; font-weight: bold; color: #64748b;">🕐 الوقت</td><td style="padding: 10px 12px; color: #0a0f1e; font-weight: bold;">بعد صلاة الجمعة</td></tr>
        <tr><td style="padding: 10px 12px; font-weight: bold; color: #64748b;">📍 المكان</td><td style="padding: 10px 12px; color: #0a0f1e; font-weight: bold;"><a href="https://maps.app.goo.gl/hH2bhED852UMbL6Y9" style="color: #0a0f1e; text-decoration: underline;">فندق هوليداي فيلا حائل</a></td></tr>
        <tr><td style="padding: 10px 12px; font-weight: bold; color: #64748b;">📚 الموضوع</td><td style="padding: 10px 12px; color: #c9a84c; font-weight: bold;">${meeting.topic}</td></tr>
        <tr><td style="padding: 10px 12px; font-weight: bold; color: #64748b;">🏢 دراسة الحالة</td><td style="padding: 10px 12px; color: #0a0f1e;">${meeting.case}</td></tr>
        <tr><td style="padding: 10px 12px; font-weight: bold; color: #64748b; vertical-align: top;">🎯 التحدي</td><td style="padding: 10px 12px; color: #64748b; line-height: 1.7;">${meeting.challenge}</td></tr>
      </table>
    </div>
    <div style="margin-top: 24px; text-align: center;">
      <a href="https://www.marfa.sa/meetings" style="display: inline-block; background: #c9a84c; color: #0a0f1e; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 15px;">📄 تصفح ملف PDF للقاء</a>
    </div>
    <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #c9a84c44; text-align: center;">
      <p style="color: #64748b; font-size: 12px; margin: 0 0 4px 0;">📍 <a href="https://maps.app.goo.gl/hH2bhED852UMbL6Y9" style="color: #64748b; text-decoration: underline;">فندق هوليداي فيلا حائل</a> — بعد صلاة الجمعة من كل أسبوع</p>
      <p style="color: #64748b; font-size: 11px; margin: 0;">www.marfa.sa &nbsp;|&nbsp; منصة مرفأ الاستثمارية &nbsp;|&nbsp; حائل 🇸🇦</p>
    </div>
  </div>
</div>
</body></html>`;
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  if (token !== TEMP_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createServiceClient();
    const { data: subscribers } = await supabase
      .from('meeting_subscribers')
      .select('email')
      .order('subscribed_at', { ascending: true });

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ message: 'No subscribers found' });
    }

    const meeting = getUpcomingFriday();
    const resend = new Resend(process.env.RESEND_API_KEY);
    const results: { email: string; status: string }[] = [];

    for (const sub of subscribers) {
      const name = sub.email.split('@')[0];
      try {
        const { error } = await resend.emails.send({
          from: 'Marfa Meetings <noreply@marfa.sa>',
          to: sub.email,
          subject: `🔔 تذكير: لقاء مرفأ ${meeting.meetingNumber} — ${meeting.dateStr} | ${meeting.case}`,
          html: buildEmailHTML(name, meeting),
        });
        results.push({ email: sub.email, status: error ? `فشل: ${error.message}` : 'تم الإرسال' });
      } catch (err: unknown) {
        results.push({ email: sub.email, status: `فشل: ${err instanceof Error ? err.message : String(err)}` });
      }
      await new Promise(r => setTimeout(r, 600));
    }

    const sent = results.filter(r => r.status === 'تم الإرسال').length;
    await resend.emails.send({
      from: 'Marfa Meetings <noreply@marfa.sa>',
      to: 'op.younis@gmail.com',
      subject: `📋 التقرير اليدوي — تم إرسال ${sent}/${subscribers.length} إشعار للقاء ${meeting.meetingNumber}`,
      html: `<div style="font-family: sans-serif; padding: 20px;"><h2>تقرير الإرسال اليدوي</h2><p>اللقاء: ${meeting.meetingNumber} — ${meeting.dateStr}</p><pre>${JSON.stringify(results, null, 2)}</pre></div>`,
    }).catch(() => {});

    return NextResponse.json({ success: true, sent, total: subscribers.length, results });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
