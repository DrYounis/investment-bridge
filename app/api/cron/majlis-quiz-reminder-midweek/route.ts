import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createServiceClient } from '@/lib/supabase/service';
import { SCHEDULE_DATA, getFridayDates, getMeetingDate, getMeetingNumberForFriday, formatDate, TOTAL_MEETINGS } from '@/app/components/marfa/scheduleData';
import { sendBatch } from '@/lib/resend-batch';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function getLastFriday(): { dateStr: string; meetingNumber: number; case: string; topic: string } {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysSinceFriday = (dayOfWeek - 5 + 7) % 7;
  const friday = new Date(now);
  friday.setDate(friday.getDate() - daysSinceFriday);

  const dateStr = formatDate(friday);
  const meetingNumber = getMeetingNumberForFriday(friday) ?? 0;
  const idx = meetingNumber - 1;
  const entry = idx >= 0 && idx < SCHEDULE_DATA.length ? SCHEDULE_DATA[idx] : SCHEDULE_DATA[0];

  return { dateStr, meetingNumber, case: entry.case, topic: entry.topic };
}

function buildMidweekHTML(
  meeting: ReturnType<typeof getLastFriday>,
  questionText: string,
  deadlineDate: string,
  answeredCount: number,
  totalCount: number,
) {
  const remaining = totalCount - answeredCount;

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="UTF-8"></head>
<body style="font-family: 'Tajawal', 'Cairo', sans-serif; direction: rtl; background: #faf8f2; padding: 30px; margin: 0;">
<div style="max-width: 600px; margin: auto; background: #ffffff; border: 1px solid #c9a84c33; border-radius: 24px; overflow: hidden; box-shadow: 0 8px 30px rgba(10,15,30,0.06);">
  <div style="background: linear-gradient(135deg, #0a0f1e, #0d1628); padding: 32px 24px; text-align: center;">
    <h1 style="color: #c9a84c; font-size: 22px; margin: 0 0 6px 0;">⏰ تذكير — المجلس الاستشاري بانتظارك</h1>
    <p style="color: #a0aec0; font-size: 13px; margin: 0;">لا تدع الفرصة تفوتك</p>
  </div>
  <div style="padding: 32px 24px;">

    <!-- Urgency -->
    <div style="border: 2px solid #ef4444; border-radius: 16px; padding: 20px; background: #fef2f2; margin-bottom: 20px; text-align: center;">
      <p style="color: #ef4444; font-size: 16px; font-weight: bold; margin: 0 0 6px 0;">⌛ بقي 3 أيام فقط</p>
      <p style="color: #4a5b78; font-size: 14px; margin: 0;">${answeredCount} من ${totalCount} أجابوا — ومازالت فرصتك قائمة</p>
    </div>

    <!-- Question -->
    <div style="border: 1px solid #c9a84c33; border-radius: 16px; padding: 20px; background: #ffffff; margin-bottom: 20px;">
      <h3 style="color: #0a0f1e; font-size: 15px; margin: 0 0 10px 0; text-align: center;">📋 سؤال اللقاء ${meeting.meetingNumber} — ${meeting.topic}</h3>
      <p style="color: #4a5b78; line-height: 1.9; font-size: 14px; margin: 0; text-align: center;">${questionText}</p>
    </div>

    <!-- CTA -->
    <div style="text-align: center; margin-bottom: 20px;">
      <a href="https://www.marfa.sa/meetings/majlis/${meeting.meetingNumber}" style="display: inline-block; background: #c9a84c; color: #0a0f1e; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 15px;">أجب الآن ←</a>
      <p style="color: #8a94a8; font-size: 11px; margin: 6px 0 0 0;">آخر موعد: قبل ${deadlineDate}</p>
    </div>

    <!-- Social proof -->
    ${answeredCount > 0 ? `
    <div style="border: 1px solid #c9a84c33; border-radius: 12px; padding: 14px; background: #faf8f2; text-align: center; margin-bottom: 20px;">
      <p style="color: #4a5b78; font-size: 13px; margin: 0;">${answeredCount} من زملائك أجابوا بالفعل — إجابتك تُحدث فرقاً في تقييمك الشهري.</p>
    </div>` : ''}

    <!-- Footer -->
    <div style="padding-top: 16px; border-top: 1px solid #c9a84c44; text-align: center;">
      <p style="color: #64748b; font-size: 10px; margin: 0;">🏛️ المجلس الاستشاري — مرفأ | www.marfa.sa</p>
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

  // Guard: Wednesday only
  if (new Date().getUTCDay() !== 3) {
    return NextResponse.json({ skipped: true, reason: 'Not Wednesday' });
  }

  try {
    const supabase = createServiceClient();
    const meeting = getLastFriday();
    const finishedN = meeting.meetingNumber;

    if (finishedN < 1 || finishedN > TOTAL_MEETINGS) {
      return NextResponse.json({ skipped: true, reason: 'no active meeting' });
    }

    const nextN = finishedN + 1;
    let deadlineDate: string;
    if (nextN <= TOTAL_MEETINGS) {
      const fridayDates = getFridayDates();
      deadlineDate = formatDate(fridayDates[nextN - 1]);
    } else {
      const finishedDate = getMeetingDate(finishedN - 1);
      finishedDate.setDate(finishedDate.getDate() + 7);
      deadlineDate = formatDate(finishedDate);
    }

    // Fetch question
    const { data: questionRow } = await supabase
      .from('majlis_quiz_questions')
      .select('question')
      .eq('meeting_number', finishedN)
      .maybeSingle();

    if (!questionRow) {
      return NextResponse.json({ skipped: true, reason: 'no question' });
    }

    // Fetch subscribers + answers
    const { data: subscribers } = await supabase
      .from('meeting_subscribers')
      .select('email')
      .order('subscribed_at', { ascending: true });

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ message: 'No subscribers' });
    }

    const subscriberEmails = subscribers.map(s => s.email.trim().toLowerCase());

    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, email')
      .in('email', subscriberEmails);

    const emailToProfileId = new Map<string, string>();
    if (profiles) {
      for (const p of profiles) {
        emailToProfileId.set((p.email || '').trim().toLowerCase(), p.id);
      }
    }

    const { data: answers } = await supabase
      .from('majlis_quiz_answers')
      .select('user_id')
      .eq('meeting_number', finishedN);

    const answeredUserIds = new Set((answers || []).map(a => a.user_id));

    const targeted: string[] = [];
    for (const sub of subscribers) {
      const normalizedEmail = sub.email.trim().toLowerCase();
      const profileId = emailToProfileId.get(normalizedEmail);
      if (!profileId || !answeredUserIds.has(profileId)) {
        targeted.push(sub.email);
      }
    }

    if (targeted.length === 0) {
      return NextResponse.json({ message: 'All already answered' });
    }

    const answeredCount = subscribers.length - targeted.length;
    const resend = new Resend(process.env.RESEND_API_KEY);
    const subject = `⏰ تذكير — سؤال المجلس بانتظارك | آخر موعد ${deadlineDate}`;

    const emails = targeted.map((email) => ({
      from: 'Marfa Advisory <noreply@marfa.sa>',
      to: email,
      subject,
      html: buildMidweekHTML(meeting, questionRow.question, deadlineDate, answeredCount, subscribers.length),
    }));

    const { sent, failed } = await sendBatch(resend, emails);

    // ── Admin report ──
    resend.emails.send({
      from: 'Marfa Advisory <noreply@marfa.sa>',
      to: 'op.younis@gmail.com',
      subject: `📋 تقرير تذكير منتصف الأسبوع — تم إرسال ${sent}/${targeted.length} تذكير للقاء ${finishedN}`,
      html: `<div style="font-family: sans-serif; padding: 20px;"><h2>تقرير تذكير منتصف الأسبوع للمجلس</h2><p>اللقاء: ${finishedN} — ${meeting.dateStr}</p><p>السؤال: ${questionRow.question}</p><pre>${JSON.stringify({ sent, failed, answered: answeredCount, total: subscribers.length }, null, 2)}</pre></div>`,
    }).catch(e => console.error('[majlis-midweek] admin report', e));

    return NextResponse.json({ success: true, sent, failed, answered: answeredCount, total: subscribers.length });
  } catch (err: unknown) {
    console.error('[majlis-midweek]', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
