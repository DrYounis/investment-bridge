import { NextResponse } from 'next/server';
import { Resend } from 'resend';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

function getUpcomingFriday(): { dateStr: string; meetingNumber: number; case: string; topic: string; challenge: string } {
  const now = new Date();
  const dayOfWeek = now.getDay();
  let daysUntilFriday = (5 - dayOfWeek + 7) % 7;
  if (daysUntilFriday === 0) daysUntilFriday = 0;

  const friday = new Date(now);
  friday.setDate(friday.getDate() + daysUntilFriday);

  const months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  const dateStr = `الجمعة ${friday.getDate()} ${months[friday.getMonth()]} ${friday.getFullYear()}`;

  const baseFriday = new Date(2026, 5, 19);
  const diffMs = friday.getTime() - baseFriday.getTime();
  const diffWeeks = Math.round(diffMs / (7 * 24 * 60 * 60 * 1000));
  const meetingNumber = diffWeeks + 1;

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
        <tr><td style="padding: 10px 12px; font-weight: bold; color: #64748b;">📍 المكان</td><td style="padding: 10px 12px; color: #0a0f1e; font-weight: bold;">ثمد كوفي</td></tr>
        <tr><td style="padding: 10px 12px; font-weight: bold; color: #64748b;">📚 الموضوع</td><td style="padding: 10px 12px; color: #c9a84c; font-weight: bold;">${meeting.topic}</td></tr>
        <tr><td style="padding: 10px 12px; font-weight: bold; color: #64748b;">🏢 دراسة الحالة</td><td style="padding: 10px 12px; color: #0a0f1e;">${meeting.case}</td></tr>
        <tr><td style="padding: 10px 12px; font-weight: bold; color: #64748b; vertical-align: top;">🎯 التحدي</td><td style="padding: 10px 12px; color: #64748b; line-height: 1.7;">${meeting.challenge}</td></tr>
      </table>
    </div>
    <div style="margin-top: 24px; text-align: center;">
      <a href="https://www.marfa.sa/meetings" style="display: inline-block; background: #c9a84c; color: #0a0f1e; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 15px;">📄 تصفح ملف PDF للقاء</a>
    </div>
    <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #c9a84c44; text-align: center;">
      <p style="color: #64748b; font-size: 12px; margin: 0 0 4px 0;">📍 ثمد كوفي — بعد صلاة الجمعة من كل أسبوع</p>
      <p style="color: #64748b; font-size: 11px; margin: 0;">www.marfa.sa &nbsp;|&nbsp; منصة مرفأ الاستثمارية &nbsp;|&nbsp; حائل 🇸🇦</p>
    </div>
  </div>
</div>
</body></html>`;
}

const TEMP_TOKEN = 'a76698bb19354fe39e10ce9e78b17325';

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${TEMP_TOKEN}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || !Array.isArray(body.emails) || body.emails.length === 0) {
    return NextResponse.json({ error: 'Missing emails array' }, { status: 400 });
  }

  const emails: string[] = body.emails;
  const meeting = getUpcomingFriday();
  const resend = getResend();
  const results: { email: string; status: string }[] = [];
  const BATCH_SIZE = 10;
  const DELAY_BETWEEN_EMAILS_MS = 600;
  const DELAY_BETWEEN_BATCHES_MS = 2000;

  for (let i = 0; i < emails.length; i += BATCH_SIZE) {
    const batch = emails.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(emails.length / BATCH_SIZE);
    console.log(`Batch ${batchNum}/${totalBatches}: sending to ${batch.length} emails...`);

    for (const email of batch) {
      const name = email.split('@')[0];
      try {
        const { error } = await resend.emails.send({
          from: 'Marfa Meetings <noreply@marfa.sa>',
          to: email,
          subject: `🔔 تذكير: لقاء مرفأ ${meeting.meetingNumber} — ${meeting.dateStr} | ${meeting.case}`,
          html: buildEmailHTML(name, meeting),
        });
        results.push({ email, status: error ? `فشل: ${error.message}` : 'تم الإرسال' });
      } catch (err: unknown) {
        results.push({ email, status: `فشل: ${err instanceof Error ? err.message : String(err)}` });
      }
      await new Promise(r => setTimeout(r, DELAY_BETWEEN_EMAILS_MS));
    }

    if (i + BATCH_SIZE < emails.length) {
      console.log(`Waiting ${DELAY_BETWEEN_BATCHES_MS}ms before next batch...`);
      await new Promise(r => setTimeout(r, DELAY_BETWEEN_BATCHES_MS));
    }
  }

  const sent = results.filter(r => r.status === 'تم الإرسال').length;
  const failed = results.filter(r => r.status !== 'تم الإرسال').length;

  return NextResponse.json({ success: true, sent, failed, total: emails.length, results });
}
