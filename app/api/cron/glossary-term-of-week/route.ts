import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createServiceClient } from '@/lib/supabase/service';
import { SCHEDULE_DATA, formatDate, getMeetingNumberForFriday } from '@/app/components/marfa/scheduleData';
import { sendBatch } from '@/lib/resend-batch';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function buildMultiTermHTML(
  terms: Array<{
    english_term: string;
    arabic_term: string;
    arabic_def: string;
    short_desc_ar?: string | null;
    example_ar?: string | null;
  }>,
  meetingNumber: number,
) {
  const meetingEntry = SCHEDULE_DATA[meetingNumber - 1];

  const termsHTML = terms.map((term) => `
    <div style="border: 2px solid #c9a84c33; border-radius: 20px; padding: 24px; background: #ffffff; margin-bottom: 20px;">
      <div style="text-align: center; margin-bottom: 16px;">
        <p style="color: #0a0f1e; font-size: 24px; font-weight: 900; margin: 0 0 4px 0;" dir="ltr">${term.english_term}</p>
        <p style="color: #c9a84c; font-size: 20px; font-weight: 800; margin: 0;">${term.arabic_term}</p>
      </div>
      ${term.short_desc_ar ? `
      <div style="border: 1px solid #c9a84c33; border-radius: 12px; padding: 14px; background: #faf8f2; margin-bottom: 12px; text-align: center;">
        <p style="color: #4a5b78; font-size: 14px; line-height: 1.8; margin: 0;">${term.short_desc_ar}</p>
      </div>` : ''}
      <div style="border: 1px solid #c9a84c33; border-radius: 12px; padding: 14px; background: #ffffff; margin-bottom: 12px;">
        <h4 style="color: #0a0f1e; font-size: 13px; margin: 0 0 6px 0; text-align: center;">📝 التعريف الكامل</h4>
        <p style="color: #4a5b78; font-size: 13px; line-height: 1.8; margin: 0;">${term.arabic_def}</p>
      </div>
      ${term.example_ar ? `
      <div style="border: 1px solid #c9a84c33; border-radius: 12px; padding: 14px; background: #fdf9ef;">
        <h4 style="color: #0a0f1e; font-size: 13px; margin: 0 0 6px 0; text-align: center;">💡 مثال من الواقع</h4>
        <p style="color: #4a5b78; font-size: 13px; line-height: 1.8; margin: 0;">${term.example_ar}</p>
      </div>` : ''}
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="UTF-8"></head>
<body style="font-family: 'Tajawal', 'Cairo', sans-serif; direction: rtl; background: #faf8f2; padding: 30px; margin: 0;">
<div style="max-width: 600px; margin: auto; background: #ffffff; border: 1px solid #c9a84c33; border-radius: 24px; overflow: hidden; box-shadow: 0 8px 30px rgba(10,15,30,0.06);">
  <div style="background: linear-gradient(135deg, #0a0f1e, #0d1628); padding: 32px 24px; text-align: center;">
    <h1 style="color: #c9a84c; font-size: 22px; margin: 0 0 6px 0;">📖 مصطلحات الأسبوع — مرفأ</h1>
    <p style="color: #a0aec0; font-size: 13px; margin: 0;">حيث تَرسو المعرفة</p>
  </div>
  <div style="padding: 32px 24px;">
    <div style="text-align: center; margin-bottom: 24px;">
      <p style="color: #4a5b78; font-size: 14px; line-height: 1.8; margin: 0;">
        استعداداً للقاء الجمعة القادمة عن <strong>${meetingEntry?.topic || ''}</strong> — ${terms.length} مصطلحات أساسية لفهم حالة ${meetingEntry?.case || ''} قبل الحضور.
      </p>
    </div>
    ${termsHTML}
    ${meetingEntry ? `
    <div style="background: linear-gradient(135deg, #0a0f1e, #0d1628); border-radius: 16px; padding: 20px; margin-bottom: 24px; text-align: center;">
      <p style="color: #c9a84c; font-size: 15px; font-weight: bold; margin: 0 0 6px 0;">🔭 الجمعة القادمة — ${meetingEntry.encounter}</p>
      <p style="color: #a0aec0; font-size: 14px; margin: 0;">${meetingEntry.case} — ${meetingEntry.topic}</p>
    </div>` : ''}
    <div style="text-align: center; margin-bottom: 24px;">
      <a href="https://www.marfa.sa/learn/glossary" style="display: inline-block; background: #c9a84c; color: #0a0f1e; padding: 12px 28px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 14px;">تصفح القاموس كاملاً (٣٠٠ مصطلح) ←</a>
    </div>
    <div style="padding-top: 20px; border-top: 1px solid #c9a84c44; text-align: center;">
      <p style="color: #64748b; font-size: 10px; margin: 0;">📖 مصطلحات الأسبوع — تصلك كل اثنين صباحاً لتحضيرك للقاء الجمعة</p>
      <p style="color: #64748b; font-size: 10px; margin: 4px 0 0 0;">www.marfa.sa &nbsp;|&nbsp; منصة مرفأ الاستثمارية &nbsp;|&nbsp; حائل 🇸🇦</p>
    </div>
  </div>
</div>
</body></html>`;
}

function buildTermOfWeekHTML(
  term: {
    english_term: string;
    arabic_term: string;
    english_def: string;
    arabic_def: string;
    short_desc_en?: string | null;
    short_desc_ar?: string | null;
    example_en?: string | null;
    example_ar?: string | null;
  },
  meetingNumber: number,
) {
  const meetingEntry = SCHEDULE_DATA[meetingNumber - 1];
  const hasShortDesc = term.short_desc_en || term.short_desc_ar;
  const hasExample = term.example_en || term.example_ar;

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="UTF-8"></head>
<body style="font-family: 'Tajawal', 'Cairo', sans-serif; direction: rtl; background: #faf8f2; padding: 30px; margin: 0;">
<div style="max-width: 600px; margin: auto; background: #ffffff; border: 1px solid #c9a84c33; border-radius: 24px; overflow: hidden; box-shadow: 0 8px 30px rgba(10,15,30,0.06);">
  
  <!-- Header -->
  <div style="background: linear-gradient(135deg, #0a0f1e, #0d1628); padding: 32px 24px; text-align: center;">
    <h1 style="color: #c9a84c; font-size: 22px; margin: 0 0 6px 0;">📖 مصطلح الأسبوع — مرفأ</h1>
    <p style="color: #a0aec0; font-size: 13px; margin: 0;">حيث تَرسو المعرفة</p>
  </div>

  <div style="padding: 32px 24px;">

    <!-- Term -->
    <div style="text-align: center; margin-bottom: 24px;">
      <p style="color: #0a0f1e; font-size: 26px; font-weight: 900; margin: 0 0 4px 0;" dir="ltr">${term.english_term}</p>
      <p style="color: #c9a84c; font-size: 22px; font-weight: 800; margin: 0;">${term.arabic_term}</p>
    </div>

    ${hasShortDesc ? `
    <!-- Short description -->
    <div style="border: 1px solid #c9a84c33; border-radius: 16px; padding: 20px; background: #faf8f2; margin-bottom: 16px; text-align: center;">
      <p style="color: #4a5b78; font-size: 14px; line-height: 1.9; margin: 0;">${term.short_desc_ar || term.short_desc_en || ''}</p>
      ${term.short_desc_en && term.short_desc_ar ? `<p style="color: #8a94a8; font-size: 12px; line-height: 1.7; margin: 8px 0 0 0;" dir="ltr">${term.short_desc_en}</p>` : ''}
    </div>
    ` : ''}

    <!-- Full definition -->
    <div style="border: 1px solid #c9a84c33; border-radius: 16px; padding: 20px; background: #ffffff; margin-bottom: 16px;">
      <h3 style="color: #0a0f1e; font-size: 14px; margin: 0 0 8px 0; text-align: center;">📝 التعريف</h3>
      <p style="color: #4a5b78; font-size: 14px; line-height: 1.9; margin: 0;">${term.arabic_def}</p>
    </div>

    ${hasExample ? `
    <!-- Example -->
    <div style="border: 1px solid #c9a84c33; border-radius: 16px; padding: 20px; background: #ffffff; margin-bottom: 16px;">
      <h3 style="color: #0a0f1e; font-size: 14px; margin: 0 0 8px 0; text-align: center;">💡 مثال تطبيقي</h3>
      <p style="color: #4a5b78; font-size: 14px; line-height: 1.9; margin: 0;">${term.example_ar || term.example_en || ''}</p>
      ${term.example_en && term.example_ar ? `<p style="color: #8a94a8; font-size: 12px; line-height: 1.7; margin: 8px 0 0 0;" dir="ltr">${term.example_en}</p>` : ''}
    </div>
    ` : ''}

    <!-- Meeting teaser -->
    ${meetingEntry ? `
    <div style="background: linear-gradient(135deg, #0a0f1e, #0d1628); border-radius: 16px; padding: 20px; margin-bottom: 24px; text-align: center;">
      <p style="color: #c9a84c; font-size: 14px; font-weight: bold; margin: 0 0 6px 0;">🔭 الجمعة القادمة — ${meetingEntry.encounter}</p>
      <p style="color: #a0aec0; font-size: 13px; margin: 0;">${meetingEntry.case} — ${meetingEntry.topic}</p>
      <p style="color: #8a94a8; font-size: 11px; margin: 6px 0 0 0;">هذا المصطلح سيساعدك في فهم حالة الجمعة القادمة</p>
    </div>
    ` : ''}

    <!-- CTA -->
    <div style="text-align: center; margin-bottom: 24px;">
      <a href="https://www.marfa.sa/learn/glossary" style="display: inline-block; background: #c9a84c; color: #0a0f1e; padding: 12px 28px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 14px;">تصفح القاموس كاملاً ←</a>
    </div>

    <!-- Footer -->
    <div style="padding-top: 20px; border-top: 1px solid #c9a84c44; text-align: center;">
      <p style="color: #64748b; font-size: 10px; margin: 0;">📖 مصطلح الأسبوع — يصلك كل اثنين صباحاً لتحضيرك للقاء الجمعة</p>
      <p style="color: #64748b; font-size: 10px; margin: 4px 0 0 0;">www.marfa.sa &nbsp;|&nbsp; منصة مرفأ الاستثمارية &nbsp;|&nbsp; حائل 🇸🇦</p>
    </div>
  </div>
</div>
</body></html>`;
}

function isCronAuthorized(request: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return false;
  return request.headers.get('authorization') === `Bearer ${cronSecret}`;
}

export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ── Monday guard ──
  if (new Date().getUTCDay() !== 1) {
    return NextResponse.json({ skipped: true, reason: 'Not Monday' });
  }

  try {
    const supabase = createServiceClient();

    // ── Calculate next Friday's meeting number ──
    const today = new Date();
    const daysUntilFriday = (5 - today.getDay() + 7) % 7 || 7; // if today is Friday, next Friday is 7 days
    const nextFriday = new Date(today);
    nextFriday.setDate(today.getDate() + daysUntilFriday);

    const nextMeetingNumber = getMeetingNumberForFriday(nextFriday);

    if (nextMeetingNumber === null || nextMeetingNumber < 1 || nextMeetingNumber > 14) {
      return NextResponse.json({ skipped: true, reason: 'No scheduled meeting' });
    }

    // ── Find all unsent featured terms for this meeting ──
    // eslint-disable-next-line prefer-const
    let { data: termRows, error: termErr } = await supabase
      .from('marfa_glossary_terms')
      .select('*')
      .eq('featured_meeting', nextMeetingNumber)
      .is('sent_at', null)
      .order('term_number', { ascending: true });

    if (termErr) {
      return NextResponse.json({ error: termErr.message }, { status: 500 });
    }

    // ── Auto-select from junction table if no terms manually tagged ──
    if (!termRows || termRows.length === 0) {
      // Query junction table for top-matching terms
      const { data: junctionRows } = await supabase
        .from('meeting_glossary_terms')
        .select('term_number, relevance_score')
        .eq('meeting_number', nextMeetingNumber)
        .order('relevance_score', { ascending: false })
        .limit(3);

      if (junctionRows && junctionRows.length > 0) {
        const termNumbers = junctionRows.map(j => j.term_number);

        // Fetch the actual term data
        const { data: matchedTerms } = await supabase
          .from('marfa_glossary_terms')
          .select('*')
          .in('term_number', termNumbers)
          .order('term_number', { ascending: true });

        if (matchedTerms && matchedTerms.length > 0) {
          // Tag them for this meeting
          for (const term of matchedTerms) {
            await supabase
              .from('marfa_glossary_terms')
              .update({ featured_meeting: nextMeetingNumber })
              .eq('term_number', term.term_number);
          }

          termRows = matchedTerms;
        }
      }
    }

    if (!termRows || termRows.length === 0) {
      return NextResponse.json({ skipped: true, reason: `No terms for meeting ${nextMeetingNumber}` });
    }

    // ── Fetch subscribers ──
    const { data: subscribers } = await supabase
      .from('meeting_subscribers')
      .select('email')
      .order('subscribed_at', { ascending: true });

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ message: 'No subscribers' });
    }

    // ── Build subject ──
    const termNames = termRows.map(t => t.arabic_term).join('، ');
    const singleTerm = termRows.length === 1;
    const subject = singleTerm
      ? `📖 مصطلح الأسبوع — ${termRows[0].arabic_term} | ${termRows[0].english_term}`
      : `📖 مصطلحات الأسبوع — ${termNames} | استعداداً للقاء ${nextMeetingNumber}`;

    // ── Send emails ──
    const resend = new Resend(process.env.RESEND_API_KEY);

    const emails = subscribers.map((sub) => ({
      from: 'Marfa Learn <noreply@marfa.sa>',
      to: sub.email,
      subject,
      html: singleTerm
        ? buildTermOfWeekHTML(termRows[0], nextMeetingNumber)
        : buildMultiTermHTML(termRows, nextMeetingNumber),
    }));

    const { sent, failed } = await sendBatch(resend, emails);

    // ── Mark all as sent ──
    const now = new Date().toISOString();
    for (const term of termRows) {
      await supabase
        .from('marfa_glossary_terms')
        .update({ sent_at: now })
        .eq('term_number', term.term_number);
    }

    return NextResponse.json({
      success: true,
      sent,
      failed,
      total: subscribers.length,
      meeting: nextMeetingNumber,
      terms: termRows.map(t => t.english_term),
    });
  } catch (err: unknown) {
    console.error('[glossary-term-of-week]', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
