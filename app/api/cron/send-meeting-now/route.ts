import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createServiceClient } from '@/lib/supabase/service';
import { getLatestArticlesForEmail } from '@/lib/supabase/financial-news';
import { getUpcomingFriday, buildEmailHTML } from '@/app/api/cron/weekly-meeting-notification/route';
import { sendBatch } from '@/lib/resend-batch';

export const maxDuration = 60;

// One-shot temp token — this route is removed immediately after use.
const TEMP_TOKEN = 'f7a1c3e9-2b8d-4f6a-9c0e-5d7b2a4f1e83';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('token') !== TEMP_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createServiceClient();
    const meeting = getUpcomingFriday();

    let articles: Awaited<ReturnType<typeof getLatestArticlesForEmail>> = [];
    try {
      articles = await getLatestArticlesForEmail(10);
    } catch {
      articles = [];
    }

    const singleEmail = searchParams.get('email');

    const { data: subscribers } = await supabase
      .from('meeting_subscribers')
      .select('email')
      .order('subscribed_at', { ascending: true });

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ message: 'No subscribers found' });
    }

    const recipients = singleEmail
      ? subscribers.filter((s) => s.email.toLowerCase() === singleEmail.toLowerCase())
      : subscribers;

    if (recipients.length === 0) {
      return NextResponse.json({ message: `Email not found: ${singleEmail}` });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const emails = recipients.map((sub) => ({
      from: 'Marfa Meetings <noreply@marfa.sa>',
      to: sub.email,
      subject: `🔔 تذكير: لقاء مرفأ ${meeting.meetingNumber} — ${meeting.dateStr} | ${meeting.case}${articles.length > 0 ? ` + ${articles.length} أخبار مالية 📰` : ''}`,
      html: buildEmailHTML(sub.email, sub.email.split('@')[0], false, meeting, articles),
    }));

    const { failures } = await sendBatch(resend, emails);
    const failedByIndex = new Map(failures.map((f) => [f.index, f.message]));
    const results: { email: string; status: string }[] = recipients.map((sub, i) => ({
      email: sub.email,
      status: failedByIndex.has(i) ? `فشل: ${failedByIndex.get(i)}` : 'تم الإرسال',
    }));

    const sent = results.filter((r) => r.status === 'تم الإرسال').length;

    return NextResponse.json({
      success: true,
      meeting: meeting.meetingNumber,
      dateStr: meeting.dateStr,
      case: meeting.case,
      sent,
      total: recipients.length,
      results,
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
