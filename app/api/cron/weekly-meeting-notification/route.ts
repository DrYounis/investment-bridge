import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createServiceClient } from '@/lib/supabase/service';
import { getLatestArticlesForEmail } from '@/lib/supabase/financial-news';
import { SCHEDULE_DATA, getMeetingNumberForFriday } from '@/app/components/marfa/scheduleData';
import { sendBatch } from '@/lib/resend-batch';

export const maxDuration = 60;

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

function getUpcomingFriday(): { dateStr: string; meetingNumber: number; case: string; topic: string; challenge: string } {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun, 5=Friday
  let daysUntilFriday = (5 - dayOfWeek + 7) % 7;
  if (daysUntilFriday === 0) daysUntilFriday = 0; // if today is Friday, send for today

  const friday = new Date(now);
  friday.setDate(friday.getDate() + daysUntilFriday);

  const months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  const dateStr = `الجمعة ${friday.getDate()} ${months[friday.getMonth()]} ${friday.getFullYear()}`;

  // Calculate which meeting number this Friday corresponds to (single source of truth)
  const meetingNumber = getMeetingNumberForFriday(friday) ?? 0;

  // Map meeting number to case study from the single source of truth
  const idx = meetingNumber - 1;
  if (idx >= SCHEDULE_DATA.length) {
    console.warn(`[weekly-meeting-notification] meetingNumber ${meetingNumber} is out of bounds (SCHEDULE_DATA has ${SCHEDULE_DATA.length} entries), falling back to meeting 1`);
  }
  const entry = idx >= 0 && idx < SCHEDULE_DATA.length ? SCHEDULE_DATA[idx] : SCHEDULE_DATA[0];

  return { dateStr, meetingNumber, case: entry.case, topic: entry.topic, challenge: entry.challenge };
}

function buildEmailHTML(email: string, name: string, isWelcome: boolean, meeting: ReturnType<typeof getUpcomingFriday>, articles: { slug: string; title: string; summary: string; article_date: string }[] = []) {
  const welcomeBlock = isWelcome
    ? `<div style="background: linear-gradient(135deg, #0a0f1e, #1a2540); padding: 30px; border-radius: 16px; margin-bottom: 24px; text-align: center;">
      <h2 style="color: #c9a84c; margin: 0 0 12px 0; font-size: 22px;">🕌 أهلاً بك في مجتمع مرفأ الاستثماري</h2>
      <p style="color: #a0aec0; line-height: 1.8; font-size: 15px; margin: 0;">
        ${name}، يسرّنا انضمامك إلى نخبة من رواد الأعمال والمستثمرين في منصة مرفأ.
        <br/>لقاءاتنا الأسبوعية تجمع بين دراسة الحالة والتحليل العملي — نتعلم معاً ونبني جسور الاستثمار.
      </p>
    </div>`
    : '';

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
    ${welcomeBlock}
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
    ${articles.length > 0 ? `
    <div style="margin-top: 28px;">
      <h2 style="color: #0a0f1e; font-size: 17px; margin: 0 0 4px 0; text-align: center;">📰 أهم ١٠ أخبار مالية هذا الأسبوع</h2>
      <p style="color: #64748b; font-size: 12px; margin: 0 0 16px 0; text-align: center;">تحليلات السوق السعودي من مرفأ</p>
      ${articles.map((a, i) => `
      <a href="https://www.marfa.sa/financial-news/${encodeURIComponent(a.slug)}"
         style="display: block; text-decoration: none; background: #faf8f2; border: 1px solid #c9a84c33; border-radius: 12px; padding: 14px 16px; margin-bottom: 10px;">
        <table style="width: 100%; border-collapse: collapse;"><tr>
          <td style="width: 32px; vertical-align: top;">
            <span style="display: inline-block; width: 26px; height: 26px; line-height: 26px; text-align: center; background: #c9a84c; color: #0a0f1e; border-radius: 50%; font-weight: bold; font-size: 13px;">${i + 1}</span>
          </td>
          <td style="padding-right: 10px;">
            <p style="color: #0a0f1e; font-weight: bold; font-size: 14px; margin: 0 0 4px 0; line-height: 1.6;">${a.title}</p>
            <p style="color: #64748b; font-size: 12px; margin: 0; line-height: 1.6;">${a.summary}...</p>
            ${a.article_date ? `<p style="color: #c9a84c; font-size: 11px; margin: 6px 0 0 0;">${a.article_date}</p>` : ''}
          </td>
        </tr></table>
      </a>`).join('')}
      <div style="text-align: center; margin-top: 14px;">
        <a href="https://www.marfa.sa/financial-news" style="display: inline-block; border: 2px solid #c9a84c; color: #0a0f1e; padding: 10px 26px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 13px;">جميع الأخبار المالية ←</a>
      </div>
    </div>` : ''}
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

function isCronAuthorized(request: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return false;
  const authHeader = request.headers.get('authorization');
  if (authHeader === `Bearer ${cronSecret}`) return true;
  return false;
}

export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Guard: only run on Sunday (Vercel can trigger on deploy)
  if (new Date().getUTCDay() !== 0) {
    return NextResponse.json({ skipped: true, reason: 'Not Sunday' });
  }

  try {
    const supabase = createServiceClient();
    const meeting = getUpcomingFriday();

    // Fetch latest news with graceful degradation
    let articles: Awaited<ReturnType<typeof getLatestArticlesForEmail>> = [];
    try { articles = await getLatestArticlesForEmail(10); } catch { articles = []; }

    const { searchParams } = new URL(request.url);
    const singleEmail = searchParams.get('email');
    const isWelcome = searchParams.get('welcome') === '1';

    // Fetch all subscribers
    const { data: subscribers } = await supabase
      .from('meeting_subscribers')
      .select('email')
      .order('subscribed_at', { ascending: true });

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ message: 'No subscribers found' });
    }

    // If single email param provided, filter to just that one
    const recipients = singleEmail
      ? subscribers.filter(s => s.email === singleEmail)
      : subscribers;

    if (recipients.length === 0) {
      return NextResponse.json({ message: `Email not found: ${singleEmail}` });
    }

    const resend = getResend();

    const emails = recipients.map((sub) => ({
      from: 'Marfa Meetings <noreply@marfa.sa>',
      to: sub.email,
      subject: `🔔 تذكير: لقاء مرفأ ${meeting.meetingNumber} — ${meeting.dateStr} | ${meeting.case}${articles.length > 0 ? ` + ${articles.length} أخبار مالية 📰` : ''}`,
      html: buildEmailHTML(sub.email, sub.email.split('@')[0], isWelcome, meeting, articles),
    }));

    const { failures } = await sendBatch(resend, emails);
    const failedByIndex = new Map(failures.map(f => [f.index, f.message]));
    const results: { email: string; status: string }[] = recipients.map((sub, i) => ({
      email: sub.email,
      status: failedByIndex.has(i) ? `فشل: ${failedByIndex.get(i)}` : 'تم الإرسال',
    }));

    // Notify super admin
    const sent = results.filter(r => r.status === 'تم الإرسال').length;
    await resend.emails.send({
      from: 'Marfa Meetings <noreply@marfa.sa>',
      to: 'op.younis@gmail.com',
      subject: `📋 التقرير الأسبوعي — تم إرسال ${sent}/${recipients.length} إشعار للقاء ${meeting.meetingNumber}`,
      html: `<div style="font-family: sans-serif; padding: 20px;"><h2>تقرير الإرسال الأسبوعي</h2><p>اللقاء: ${meeting.meetingNumber} — ${meeting.dateStr}</p><pre>${JSON.stringify(results, null, 2)}</pre></div>`,
    }).catch(() => {});

    return NextResponse.json({ success: true, sent, total: recipients.length, results });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
