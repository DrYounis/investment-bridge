import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createServiceClient } from '@/lib/supabase/service';
import { SCHEDULE_DATA } from '@/app/components/marfa/scheduleData';

export const dynamic = 'force-dynamic';

const TEMP_TOKEN = 'glossary-m7-july25-y8m2';

interface TermData {
  term_number: number;
  english_term: string;
  arabic_term: string;
  arabic_def: string;
  short_desc_ar: string;
  short_desc_en: string;
  example_ar: string;
  example_en: string;
}

const TERMS: TermData[] = [
  {
    term_number: 85,
    english_term: 'Corporate Governance',
    arabic_term: 'حوكمة الشركات',
    arabic_def: 'تشير حوكمة الشركات إلى نظام القواعد والممارسات والعمليات التي تُدار وتُراقَب بها الشركة، وتحدد العلاقات وتوازن القوى بين المساهمين ومجلس الإدارة والإدارة التنفيذية وأصحاب المصلحة الآخرين.',
    short_desc_ar: 'نظام القواعد والممارسات الذي يحدد كيفية إدارة الشركة ومراقبتها ومساءلتها — يشمل مجلس الإدارة والمساهمين والشفافية والإفصاح المالي.',
    short_desc_en: 'The system of rules and practices defining how a company is directed, controlled, and held accountable — covering the board, shareholders, transparency, and financial disclosure.',
    example_ar: 'في قضية Saudi German Health، أدى ضعف الحوكمة إلى تورط 11 عضو مجلس إدارة ولجنة مراجعة في تضخيم الإيرادات بـ 358 مليون ريال دون اكتشافهم — مما أدى إلى إدانتهم من قبل هيئة السوق المالية.',
    example_en: 'In the Saudi German Health case, weak governance led to 11 board and audit committee members inflating revenues by 358 million SAR undetected — resulting in their conviction by the CMA.',
  },
  {
    term_number: 86,
    english_term: 'Stakeholder',
    arabic_term: 'صاحب المصلحة',
    arabic_def: 'صاحب المصلحة هو أي فرد أو مجموعة أو مؤسسة لها اهتمام بأعمال الشركة أو قراراتها أو أدائها، أو تتأثر بها، أو يمكنها التأثير فيها، وتشمل هذه الفئة مجموعة أوسع من المساهمين فقط.',
    short_desc_ar: 'كل طرف له مصلحة في الشركة أو يتأثر بقراراتها — مساهمين، مجلس إدارة، موظفين، عملاء، جهات تنظيمية، والمجتمع. ليس المساهمون فقط.',
    short_desc_en: 'Any party with an interest in or affected by a company\'s decisions — shareholders, board, employees, customers, regulators, and the community. Not just shareholders.',
    example_ar: 'عندما انكشف احتيال Saudi German Health، تأثر جميع أصحاب المصلحة: المساهمون خسروا مليارات الريالات من القيمة السوقية، الموظفون والمرضى تضرروا، والجهات التنظيمية تدخلت — مما يوضح لماذا الحوكمة القوية تحمي الجميع.',
    example_en: 'When Saudi German Health\'s fraud was exposed, all stakeholders were affected: shareholders lost billions in market value, employees and patients were harmed, and regulators stepped in — showing why strong governance protects everyone.',
  },
  {
    term_number: 218,
    english_term: 'Board of Directors',
    arabic_term: 'مجلس الإدارة',
    arabic_def: 'مجلس الإدارة هو مجموعة من الأفراد يُنتخبهم مساهمو الشركة لتمثيل مصالح المساهمين وتوفير رقابة استراتيجية وحوكمة واتخاذ أو الموافقة على قرارات كبرى نيابة عن الشركة.',
    short_desc_ar: 'المجموعة المنتخبة من المساهمين للإشراف على استراتيجية الشركة وتعيين التنفيذيين وضمان المساءلة — أعلى سلطة رقابية داخل الشركة.',
    short_desc_en: 'The group elected by shareholders to oversee company strategy, appoint executives, and ensure accountability — the highest oversight authority within a company.',
    example_ar: 'في Saudi German Health، تمت إدانة 11 عضو مجلس إدارة ولجنة مراجعة لتضخيمهم الإيرادات — مما يظهر العواقب القانونية والمالية عندما يفشل مجلس الإدارة في واجبه الرقابي والائتماني.',
    example_en: 'At Saudi German Health, 11 board and audit committee members were convicted for inflating revenues — showing the legal and financial consequences when a Board fails its oversight and fiduciary duty.',
  },
];

function buildAllTermsHTML(terms: TermData[], meetingNumber: number) {
  const meetingEntry = SCHEDULE_DATA[meetingNumber - 1];

  const termsHTML = terms.map((term, i) => `
    <!-- Term ${i + 1} -->
    <div style="border: 2px solid #c9a84c33; border-radius: 20px; padding: 24px; background: #ffffff; margin-bottom: 20px;">
      <!-- Term header -->
      <div style="text-align: center; margin-bottom: 16px;">
        <p style="color: #0a0f1e; font-size: 24px; font-weight: 900; margin: 0 0 4px 0;" dir="ltr">${term.english_term}</p>
        <p style="color: #c9a84c; font-size: 20px; font-weight: 800; margin: 0;">${term.arabic_term}</p>
      </div>

      <!-- Short description -->
      <div style="border: 1px solid #c9a84c33; border-radius: 12px; padding: 14px; background: #faf8f2; margin-bottom: 12px; text-align: center;">
        <p style="color: #4a5b78; font-size: 14px; line-height: 1.8; margin: 0;">${term.short_desc_ar}</p>
      </div>

      <!-- Full definition -->
      <div style="border: 1px solid #c9a84c33; border-radius: 12px; padding: 14px; background: #ffffff; margin-bottom: 12px;">
        <h4 style="color: #0a0f1e; font-size: 13px; margin: 0 0 6px 0; text-align: center;">📝 التعريف الكامل</h4>
        <p style="color: #4a5b78; font-size: 13px; line-height: 1.8; margin: 0;">${term.arabic_def}</p>
      </div>

      <!-- Example -->
      <div style="border: 1px solid #c9a84c33; border-radius: 12px; padding: 14px; background: #fdf9ef; margin-bottom: 0;">
        <h4 style="color: #0a0f1e; font-size: 13px; margin: 0 0 6px 0; text-align: center;">💡 مثال من الواقع</h4>
        <p style="color: #4a5b78; font-size: 13px; line-height: 1.8; margin: 0;">${term.example_ar}</p>
      </div>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="UTF-8"></head>
<body style="font-family: 'Tajawal', 'Cairo', sans-serif; direction: rtl; background: #faf8f2; padding: 30px; margin: 0;">
<div style="max-width: 600px; margin: auto; background: #ffffff; border: 1px solid #c9a84c33; border-radius: 24px; overflow: hidden; box-shadow: 0 8px 30px rgba(10,15,30,0.06);">
  
  <!-- Header -->
  <div style="background: linear-gradient(135deg, #0a0f1e, #0d1628); padding: 32px 24px; text-align: center;">
    <h1 style="color: #c9a84c; font-size: 22px; margin: 0 0 6px 0;">📖 مصطلحات الأسبوع — مرفأ</h1>
    <p style="color: #a0aec0; font-size: 13px; margin: 0;">حيث تَرسو المعرفة</p>
  </div>

  <div style="padding: 32px 24px;">

    <!-- Intro -->
    <div style="text-align: center; margin-bottom: 24px;">
      <p style="color: #4a5b78; font-size: 14px; line-height: 1.8; margin: 0;">
        استعداداً للقاء الجمعة القادمة عن <strong>${meetingEntry?.topic || 'حوكمة الشركات'}</strong> — ثلاث مصطلحات أساسية لفهم قضية ${meetingEntry?.case || 'Saudi German Health'} قبل الحضور.
      </p>
    </div>

    ${termsHTML}

    <!-- Meeting teaser -->
    ${meetingEntry ? `
    <div style="background: linear-gradient(135deg, #0a0f1e, #0d1628); border-radius: 16px; padding: 20px; margin-bottom: 24px; text-align: center;">
      <p style="color: #c9a84c; font-size: 15px; font-weight: bold; margin: 0 0 6px 0;">🔭 الجمعة القادمة — ${meetingEntry.encounter}</p>
      <p style="color: #a0aec0; font-size: 14px; margin: 0;">${meetingEntry.case} — ${meetingEntry.topic}</p>
      <p style="color: #8a94a8; font-size: 12px; margin: 8px 0 0 0;">📋 إدانة 11 عضو مجلس إدارة ولجنة مراجعة بتضخيم إيرادات بـ 358 مليون ريال</p>
    </div>
    ` : ''}

    <!-- CTA -->
    <div style="text-align: center; margin-bottom: 24px;">
      <a href="https://www.marfa.sa/learn/glossary" style="display: inline-block; background: #c9a84c; color: #0a0f1e; padding: 12px 28px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 14px;">تصفح القاموس كاملاً (٣٠٠ مصطلح) ←</a>
    </div>

    <!-- Footer -->
    <div style="padding-top: 20px; border-top: 1px solid #c9a84c44; text-align: center;">
      <p style="color: #64748b; font-size: 10px; margin: 0;">📖 مصطلحات الأسبوع — تصلك كل اثنين صباحاً لتحضيرك للقاء الجمعة</p>
      <p style="color: #64748b; font-size: 10px; margin: 4px 0 0 0;">www.marfa.sa &nbsp;|&nbsp; منصة مرفأ الاستثمارية &nbsp;|&nbsp; حائل 🇸🇦</p>
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
    const meetingNumber = 7; // Saudi German Health

    // 1. Update the 3 terms with short_desc, example, and featured_meeting
    for (const term of TERMS) {
      const { error } = await supabase
        .from('marfa_glossary_terms')
        .update({
          short_desc_ar: term.short_desc_ar,
          short_desc_en: term.short_desc_en,
          example_ar: term.example_ar,
          example_en: term.example_en,
          featured_meeting: meetingNumber,
        })
        .eq('term_number', term.term_number);

      console.log(`Updated term ${term.term_number}: ${error ? error.message : 'OK'}`);
    }

    // 2. Fetch subscribers
    const { data: subscribers } = await supabase
      .from('meeting_subscribers')
      .select('email')
      .order('subscribed_at', { ascending: true });

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ error: 'No subscribers' }, { status: 400 });
    }

    // 3. Send emails
    const resend = new Resend(process.env.RESEND_API_KEY);
    const subject = `📖 مصطلحات الأسبوع — حوكمة الشركات، صاحب المصلحة، مجلس الإدارة | استعداداً للقاء ٧`;

    let sent = 0;
    let failed = 0;

    for (const sub of subscribers) {
      try {
        const { error } = await resend.emails.send({
          from: 'Marfa Learn <noreply@marfa.sa>',
          to: sub.email,
          subject,
          html: buildAllTermsHTML(TERMS, meetingNumber),
        });
        if (error) { failed++; } else { sent++; }
      } catch {
        failed++;
      }
      await new Promise(r => setTimeout(r, 600));
    }

    // 4. Mark all 3 as sent
    for (const term of TERMS) {
      await supabase
        .from('marfa_glossary_terms')
        .update({ sent_at: new Date().toISOString() })
        .eq('term_number', term.term_number);
    }

    return NextResponse.json({
      success: true,
      sent,
      failed,
      total: subscribers.length,
      meeting: meetingNumber,
      terms: TERMS.map(t => t.arabic_term),
    });
  } catch (err: unknown) {
    console.error('[send-glossary-terms]', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
