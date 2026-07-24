import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createServiceClient } from '@/lib/supabase/service';
import { SCHEDULE_DATA, getFridayDates, formatDate, type YouTubeLink } from '@/app/components/marfa/scheduleData';

const TEMP_TOKEN = 'mjls-reminder-july24-x7k9';

export const dynamic = 'force-dynamic';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

function getLastFriday(): { dateStr: string; meetingNumber: number; case: string; topic: string } {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysSinceFriday = (dayOfWeek - 5 + 7) % 7;

  const friday = new Date(now);
  friday.setDate(friday.getDate() - daysSinceFriday);

  const dateStr = formatDate(friday);

  const baseFriday = new Date(2026, 5, 19);
  const diffMs = friday.getTime() - baseFriday.getTime();
  const diffWeeks = Math.round(diffMs / (7 * 24 * 60 * 60 * 1000));
  const meetingNumber = diffWeeks + 1;

  const idx = meetingNumber - 1;
  const entry = idx >= 0 && idx < SCHEDULE_DATA.length ? SCHEDULE_DATA[idx] : SCHEDULE_DATA[0];

  return { dateStr, meetingNumber, case: entry.case, topic: entry.topic };
}

function buildMajlisReminderHTML(
  email: string,
  meeting: ReturnType<typeof getLastFriday>,
  questionText: string,
  deadlineDate: string,
  nextN: number,
  youtubeLinks?: YouTubeLink[],
) {
  const nextEntry = nextN >= 1 && nextN <= 14 ? SCHEDULE_DATA[nextN - 1] : null;

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="UTF-8"></head>
<body style="font-family: 'Tajawal', 'Cairo', sans-serif; direction: rtl; background: #faf8f2; padding: 30px; margin: 0;">
<div style="max-width: 600px; margin: auto; background: #ffffff; border: 1px solid #c9a84c33; border-radius: 24px; overflow: hidden; box-shadow: 0 8px 30px rgba(10,15,30,0.06);">
  <div style="background: linear-gradient(135deg, #0a0f1e, #0d1628); padding: 32px 24px; text-align: center;">
    <h1 style="color: #c9a84c; font-size: 24px; margin: 0 0 8px 0;">🏛️ المجلس الاستشاري — مرفأ</h1>
    <p style="color: #a0aec0; font-size: 13px; margin: 0;">حيث تَرسو الطموحات</p>
  </div>
  <div style="padding: 32px 24px;">

    <div style="border: 2px solid #c9a84c; border-radius: 16px; padding: 24px; background: #faf8f2; margin-bottom: 24px;">
      <h2 style="color: #0a0f1e; font-size: 18px; margin: 0 0 12px 0; text-align: center;">اللقاء ${meeting.meetingNumber} انتهى… والقرار الآن قرارك</h2>
      <p style="color: #4a5b78; line-height: 1.8; font-size: 15px; margin: 0; text-align: center;">
        ناقشنا ${meeting.case} — لكن المجلس الاستشاري لا يكتفي بالحضور. سؤال الحالة بانتظارك، وإجابتك تُقيَّم من المستشار بدرجة من 5.
      </p>
    </div>

    ${youtubeLinks && youtubeLinks.length > 0 ? `
    <div style="border: 1px solid #c9a84c33; border-radius: 16px; padding: 24px; background: #ffffff; margin-bottom: 24px;">
      <h3 style="color: #0a0f1e; font-size: 16px; margin: 0 0 16px 0; text-align: center;">🎬 فيديوهات الحالة — شاهد قبل الإجابة</h3>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${youtubeLinks.map(link => `
        <a href="${link.url}" style="display: block; background: #faf8f2; border: 1px solid #c9a84c33; border-radius: 12px; padding: 14px 18px; text-decoration: none; color: #0a0f1e; text-align: center;">
          <span style="display: inline-block; vertical-align: middle; margin-left: 8px;">▶️</span>
          <span style="font-weight: bold; font-size: 14px;">${link.label}</span>
        </a>
        `).join('')}
      </div>
    </div>
    ` : ''}

    <div style="border: 1px solid #c9a84c33; border-radius: 16px; padding: 24px; background: #ffffff; margin-bottom: 24px;">
      <h3 style="color: #0a0f1e; font-size: 16px; margin: 0 0 16px 0; text-align: center;">📋 سؤال الحالة — ${meeting.topic}</h3>
      <p style="color: #4a5b78; line-height: 1.9; font-size: 15px; margin: 0; text-align: center;">${questionText}</p>
    </div>

    <div style="background: linear-gradient(135deg, #0a0f1e, #0d1628); border-radius: 16px; padding: 24px; margin-bottom: 24px; text-align: center;">
      <p style="color: #c9a84c; font-size: 16px; font-weight: bold; margin: 0 0 8px 0;">⏳ آخر موعد للإجابة: قبل ${deadlineDate}</p>
      <p style="color: #a0aec0; font-size: 13px; margin: 0; line-height: 1.6;">إجابات المجلس الاستشاري تدخل في تقييمك الشهري أمام المجلس — الحضور وحده لا يكفي.</p>
    </div>

    <div style="text-align: center; margin-bottom: 24px;">
      <a href="https://www.marfa.sa/meetings/majlis/${meeting.meetingNumber}" style="display: inline-block; background: #c9a84c; color: #0a0f1e; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 15px;">أجب الآن في المجلس الاستشاري ←</a>
      <p style="color: #8a94a8; font-size: 11px; margin: 8px 0 0 0;">تحتاج تسجيل الدخول بحسابك في مرفأ</p>
    </div>

    ${nextEntry ? `
    <div style="border: 1px solid #c9a84c33; border-radius: 16px; padding: 20px; background: #faf8f2; text-align: center;">
      <p style="color: #0a0f1e; font-size: 14px; margin: 0 0 4px 0;">🔭 الأسبوع القادم: ${nextEntry.case} — ${nextEntry.topic}</p>
      <p style="color: #8a94a8; font-size: 12px; margin: 0;">احضر وقد قرأت الحالة… ثم واجه سؤالها.</p>
    </div>
    ` : ''}

    <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #c9a84c44; text-align: center;">
      <p style="color: #64748b; font-size: 11px; margin: 0 0 4px 0;">🏛️ المجلس الاستشاري — لتقييم رواد الأعمال من قبل مستشارين معتمدين</p>
      <p style="color: #64748b; font-size: 11px; margin: 0;">www.marfa.sa &nbsp;|&nbsp; منصة مرفأ الاستثمارية &nbsp;|&nbsp; حائل 🇸🇦</p>
    </div>
  </div>
</div>
</body></html>`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  if (token !== TEMP_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createServiceClient();
    const meeting = getLastFriday();
    const finishedN = meeting.meetingNumber;

    if (finishedN < 1 || finishedN > 14) {
      return NextResponse.json({ skipped: true, reason: 'no active meeting' });
    }

    const nextN = finishedN + 1;

    let deadlineDate: string;
    if (nextN <= 14) {
      const fridayDates = getFridayDates();
      deadlineDate = formatDate(fridayDates[nextN - 1]);
    } else {
      const finishedFriday = new Date(2026, 5, 19);
      finishedFriday.setDate(finishedFriday.getDate() + (finishedN - 1) * 7 + 7);
      deadlineDate = formatDate(finishedFriday);
    }

    const { data: questionRow, error: qErr } = await supabase
      .from('majlis_quiz_questions')
      .select('question')
      .eq('meeting_number', finishedN)
      .maybeSingle();

    if (qErr || !questionRow) {
      return NextResponse.json({ skipped: true, reason: `no question for meeting ${finishedN}` });
    }

    const questionText = questionRow.question;
    const youtubeLinks = SCHEDULE_DATA[finishedN - 1]?.youtubeLinks;

    const { data: subscribers } = await supabase
      .from('meeting_subscribers')
      .select('email')
      .order('subscribed_at', { ascending: true });

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ message: 'No subscribers found' });
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
    const skipped: string[] = [];

    for (const sub of subscribers) {
      const normalizedEmail = sub.email.trim().toLowerCase();
      const profileId = emailToProfileId.get(normalizedEmail);
      if (profileId && answeredUserIds.has(profileId)) {
        skipped.push(sub.email);
      } else {
        targeted.push(sub.email);
      }
    }

    if (targeted.length === 0) {
      return NextResponse.json({ message: 'All already answered', skipped: skipped.length });
    }

    const resend = getResend();
    const results: { email: string; status: string }[] = [];

    for (const r of skipped) {
      results.push({ email: r, status: 'تم التخطي (أجاب مسبقاً)' });
    }

    const subject = `🏛️ المجلس الاستشاري بانتظار قرارك — سؤال حالة اللقاء ${finishedN} | آخر موعد ${deadlineDate}`;

    for (const email of targeted) {
      try {
        const { error } = await resend.emails.send({
          from: 'Marfa Advisory <noreply@marfa.sa>',
          to: email,
          subject,
          html: buildMajlisReminderHTML(email, meeting, questionText, deadlineDate, nextN, youtubeLinks),
        });
        results.push({ email, status: error ? `فشل: ${error.message}` : 'تم الإرسال' });
      } catch (err: unknown) {
        results.push({ email, status: `فشل: ${err instanceof Error ? err.message : String(err)}` });
      }
      await new Promise(r => setTimeout(r, 600));
    }

    const sent = results.filter(r => r.status === 'تم الإرسال').length;

    await resend.emails.send({
      from: 'Marfa Advisory <noreply@marfa.sa>',
      to: 'op.younis@gmail.com',
      subject: `📋 تقرير تذكير المجلس الاستشاري (يدوي) — تم إرسال ${sent}/${targeted.length} تذكير للقاء ${finishedN}`,
      html: `<div style="font-family: sans-serif; padding: 20px;"><h2>تقرير تذكير المجلس الاستشاري (يدوي)</h2><p>اللقاء: ${finishedN} — ${meeting.dateStr}</p><p>السؤال: ${questionText}</p><pre>${JSON.stringify(results, null, 2)}</pre></div>`,
    }).catch(e => console.error('[send-majlis-reminder] admin report', e));

    return NextResponse.json({ success: true, sent, total: targeted.length, skipped: skipped.length, meeting: finishedN, question: questionText, results });
  } catch (err: unknown) {
    console.error('[send-majlis-reminder]', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
