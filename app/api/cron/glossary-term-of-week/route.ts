import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createServiceClient } from '@/lib/supabase/service';
import { SCHEDULE_DATA, formatDate } from '@/app/components/marfa/scheduleData';

export const dynamic = 'force-dynamic';

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

export async function GET() {
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

    const baseFriday = new Date(2026, 5, 19); // meeting 1 = June 19
    const diffMs = nextFriday.getTime() - baseFriday.getTime();
    const diffWeeks = Math.round(diffMs / (7 * 24 * 60 * 60 * 1000));
    const nextMeetingNumber = diffWeeks + 1;

    if (nextMeetingNumber < 1 || nextMeetingNumber > 14) {
      return NextResponse.json({ skipped: true, reason: `No scheduled meeting for #${nextMeetingNumber}` });
    }

    // ── Find featured term for this meeting ──
    const { data: termRow, error: termErr } = await supabase
      .from('marfa_glossary_terms')
      .select('*')
      .eq('featured_meeting', nextMeetingNumber)
      .is('sent_at', null)
      .maybeSingle();

    if (termErr || !termRow) {
      return NextResponse.json({ skipped: true, reason: `No unsent featured term for meeting ${nextMeetingNumber}` });
    }

    // ── Fetch subscribers ──
    const { data: subscribers } = await supabase
      .from('meeting_subscribers')
      .select('email')
      .order('subscribed_at', { ascending: true });

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ message: 'No subscribers' });
    }

    // ── Send emails ──
    const resend = new Resend(process.env.RESEND_API_KEY);
    const subject = `📖 مصطلح الأسبوع — ${termRow.arabic_term} | ${termRow.english_term}`;

    let sent = 0;
    let failed = 0;

    for (const sub of subscribers) {
      try {
        const { error } = await resend.emails.send({
          from: 'Marfa Learn <noreply@marfa.sa>',
          to: sub.email,
          subject,
          html: buildTermOfWeekHTML(termRow, nextMeetingNumber),
        });
        if (error) { failed++; } else { sent++; }
      } catch {
        failed++;
      }
      await new Promise(r => setTimeout(r, 600));
    }

    // ── Mark as sent ──
    await supabase
      .from('marfa_glossary_terms')
      .update({ sent_at: new Date().toISOString() })
      .eq('term_number', termRow.term_number);

    return NextResponse.json({
      success: true,
      sent,
      failed,
      total: subscribers.length,
      meeting: nextMeetingNumber,
      term: termRow.english_term,
    });
  } catch (err: unknown) {
    console.error('[glossary-term-of-week]', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
