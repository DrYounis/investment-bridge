import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createServiceClient } from '@/lib/supabase/service';

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

  // Calculate which meeting number this Friday corresponds to
  // Base: meeting 1 was June 19, 2026
  const baseFriday = new Date(2026, 5, 19); // June 19, 2026
  const diffMs = friday.getTime() - baseFriday.getTime();
  const diffWeeks = Math.round(diffMs / (7 * 24 * 60 * 60 * 1000));
  const meetingNumber = diffWeeks + 1;

  // Map meeting number to case study from SCHEDULE_DATA
  const schedule = [
    { case: 'حالة "Airbnb" في البدايات', topic: 'الاستراتيجية', challenge: 'كيف تقنع المستثمر بفكرة "تأجير خيام أو غرف" بينما يوجد فنادق؟' },
    { case: 'حالة "Zappos" في خدمة العملاء', topic: 'القيادة', challenge: 'هل يمكن بناء ثقافة مؤسسية تجعل الموظف يضحي من أجل العميل؟' },
    { case: 'حالة "WeWork" (الفشل المالي)', topic: 'المالية', challenge: 'كيف تحولت شركة بمليارات الدولارات إلى الإفلاس؟ فهم الفرق بين "النمو" و"الربحية".' },
    { case: 'حالة "Liquid Death" (تسويق المياه)', topic: 'التسويق', challenge: 'كيف تبيع منتجاً عادياً جداً (ماء) ببراند عبقري؟' },
    { case: 'حالة "Amazon Logistics"', topic: 'العمليات', challenge: 'كيف تدار العمليات لتقليل الهدر؟' },
    { case: 'حالة "Shark Tank" (نماذج حقيقية)', topic: 'التفاوض', challenge: 'تحليل صفقات حقيقية: لماذا رفض المستثمر فكرة عبقرية؟ ولماذا قبل فكرة بسيطة؟' },
    { case: 'حالة Saudi German Health (تداول: 4009)', topic: 'حوكمة الشركات', challenge: 'إدانة 11 عضو مجلس إدارة بتضخيم إيرادات بـ 358 مليون ريال.' },
    { case: 'حالة "Netflix" (من تأجير DVD إلى الستريمنج)', topic: 'الابتكار', challenge: 'كيف تُقدم على تدمير نموذج عملك الناجح حالياً لتبني نموذجاً جديداً؟' },
    { case: 'حالة "Google – Project Aristotle"', topic: 'الموارد البشرية', challenge: 'ما الذي يصنع فريقاً عالي الأداء فعلاً؟ الأمان النفسي مقابل "تجميع النجوم".' },
    { case: 'حالة "Theranos" (انهيار الثقة الاستثمارية)', topic: 'إدارة المخاطر', challenge: 'كيف يكتشف المستثمر علامات الخطر مبكراً قبل ضخ رأس المال؟' },
    { case: 'حالة "IKEA" في دخول أسواق جديدة', topic: 'التوسع الدولي', challenge: 'كيف توازن الشركة بين "المعيار العالمي" و"التكيف المحلي"؟' },
    { case: 'حالة "Johnson & Johnson" (أزمة تايلينول 1982)', topic: 'إدارة الأزمات', challenge: 'كيف تدار أزمة ثقة المستهلك بشفافية تحفظ سمعة العلامة التجارية؟' },
    { case: 'حالة "Patagonia" (الأرض هي المساهم الوحيد)', topic: 'الاستدامة والمسؤولية', challenge: 'هل يمكن أن يتوافق الربح مع القيم؟' },
    { case: 'حالة "Quibi" (فشل رغم مليار دولار تمويل)', topic: 'دراسة الجدوى', challenge: 'لماذا يفشل مشروع ضخم التمويل وبفريق نجوم؟' },
  ];

  const idx = meetingNumber - 1;
  const entry = idx >= 0 && idx < schedule.length ? schedule[idx] : schedule[0];

  return { dateStr, meetingNumber, ...entry };
}

function buildEmailHTML(email: string, name: string, isWelcome: boolean, meeting: ReturnType<typeof getUpcomingFriday>) {
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
    <div style="border: 2px solid #c9a84c; border-radius: 16px; padding: 24px; background: #fdf9ef;">
      <h2 style="color: #0a0f1e; font-size: 18px; margin: 0 0 16px 0; text-align: center;">📅 دعوة لحضور اللقاء ${meeting.meetingNumber}</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 10px 12px; font-weight: bold; color: #4a5b78; width: 100px;">📅 التاريخ</td><td style="padding: 10px 12px; color: #0a0f1e; font-weight: bold;">${meeting.dateStr}</td></tr>
        <tr><td style="padding: 10px 12px; font-weight: bold; color: #4a5b78;">🕐 الوقت</td><td style="padding: 10px 12px; color: #0a0f1e; font-weight: bold;">بعد صلاة الجمعة</td></tr>
        <tr><td style="padding: 10px 12px; font-weight: bold; color: #4a5b78;">📍 المكان</td><td style="padding: 10px 12px; color: #0a0f1e; font-weight: bold;">ثمد كوفي</td></tr>
        <tr><td style="padding: 10px 12px; font-weight: bold; color: #4a5b78;">📚 الموضوع</td><td style="padding: 10px 12px; color: #c9a84c; font-weight: bold;">${meeting.topic}</td></tr>
        <tr><td style="padding: 10px 12px; font-weight: bold; color: #4a5b78;">🏢 دراسة الحالة</td><td style="padding: 10px 12px; color: #0a0f1e;">${meeting.case}</td></tr>
        <tr><td style="padding: 10px 12px; font-weight: bold; color: #4a5b78; vertical-align: top;">🎯 التحدي</td><td style="padding: 10px 12px; color: #4a5b78; line-height: 1.7;">${meeting.challenge}</td></tr>
      </table>
    </div>
    <div style="margin-top: 24px; text-align: center;">
      <a href="https://www.marfa.sa/meetings" style="display: inline-block; background: #c9a84c; color: #0a0f1e; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 15px;">📄 تصفح ملف PDF للقاء</a>
    </div>
    <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #c9a84c44; text-align: center;">
      <p style="color: #8a94a8; font-size: 12px; margin: 0 0 4px 0;">📍 ثمد كوفي — بعد صلاة الجمعة من كل أسبوع</p>
      <p style="color: #8a94a8; font-size: 11px; margin: 0;">www.marfa.sa &nbsp;|&nbsp; منصة مرفأ الاستثمارية &nbsp;|&nbsp; حائل 🇸🇦</p>
    </div>
  </div>
</div>
</body></html>`;
}

export async function GET(request: Request) {
  try {
    const supabase = createServiceClient();
    const meeting = getUpcomingFriday();
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
    const results: { email: string; status: string }[] = [];

    for (const sub of recipients) {
      const name = sub.email.split('@')[0];
      try {
        const { error } = await resend.emails.send({
          from: 'Marfa Meetings <noreply@marfa.sa>',
          to: sub.email,
          subject: `🔔 تذكير: لقاء مرفأ ${meeting.meetingNumber} — ${meeting.dateStr} | ${meeting.case}`,
          html: buildEmailHTML(sub.email, name, isWelcome, meeting),
        });
        results.push({ email: sub.email, status: error ? `فشل: ${error.message}` : 'تم الإرسال' });
      } catch (err: unknown) {
        results.push({ email: sub.email, status: `فشل: ${err instanceof Error ? err.message : String(err)}` });
      }
      // Rate limit: Resend allows 2/sec — wait 600ms between sends
      await new Promise(r => setTimeout(r, 600));
    }

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
