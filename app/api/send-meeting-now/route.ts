import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createServiceClient } from '@/lib/supabase/service';
import { getLatestArticlesForEmail } from '@/lib/supabase/financial-news';
import { sendBatch } from '@/lib/resend-batch';
import { getUpcomingFriday, buildEmailHTML } from '../cron/weekly-meeting-notification/route';

export const maxDuration = 60;

// One-shot temp token — remove this route after the send.
const TEMP_TOKEN = 'e178c1f3-0797-46b0-8f91-e515bb2236ae';

export async function GET(request: NextRequest) {
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${TEMP_TOKEN}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createServiceClient();
    const meeting = getUpcomingFriday();

    let articles: Awaited<ReturnType<typeof getLatestArticlesForEmail>> = [];
    try { articles = await getLatestArticlesForEmail(10); } catch { articles = []; }

    const { data: subscribers } = await supabase
      .from('meeting_subscribers')
      .select('email')
      .order('subscribed_at', { ascending: true });

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ message: 'No subscribers found' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const emails = subscribers.map((sub) => ({
      from: 'Marfa Meetings <noreply@marfa.sa>',
      to: sub.email,
      subject: `🔔 تذكير: لقاء مرفأ ${meeting.meetingNumber} — ${meeting.dateStr} | ${meeting.case}${articles.length > 0 ? ` + ${articles.length} أخبار مالية 📰` : ''}`,
      html: buildEmailHTML(sub.email, sub.email.split('@')[0], false, meeting, articles),
    }));

    const { failures } = await sendBatch(resend, emails);
    const failedByIndex = new Map(failures.map(f => [f.index, f.message]));
    const results = subscribers.map((sub, i) => ({
      email: sub.email,
      status: failedByIndex.has(i) ? `فشل: ${failedByIndex.get(i)}` : 'تم الإرسال',
    }));

    const sent = results.filter(r => r.status === 'تم الإرسال').length;
    await resend.emails.send({
      from: 'Marfa Meetings <noreply@marfa.sa>',
      to: 'op.younis@gmail.com',
      subject: `📋 التقرير الأسبوعي — تم إرسال ${sent}/${subscribers.length} إشعار للقاء ${meeting.meetingNumber}`,
      html: `<div style="font-family: sans-serif; padding: 20px;"><h2>تقرير الإرسال الأسبوعي</h2><p>اللقاء: ${meeting.meetingNumber} — ${meeting.dateStr}</p><pre>${JSON.stringify(results, null, 2)}</pre></div>`,
    }).catch(() => {});

    return NextResponse.json({ success: true, sent, total: subscribers.length, results });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
