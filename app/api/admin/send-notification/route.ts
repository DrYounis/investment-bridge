import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isSuperAdminEmail } from '@/lib/auth/adminEmails';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const MEETING_DETAILS = {
  number: 3,
  date: 'الجمعة 3 يوليو 2026',
  time: 'بعد صلاة الجمعة',
  location: 'فندق هوليداي فيلا حائل',
  topic: 'المالية',
  case: 'حالة "WeWork" (الفشل المالي)',
  challenge: 'كيف تحولت شركة بمليارات الدولارات إلى الإفلاس؟ فهم الفرق بين "النمو" و"الربحية".',
};

function buildEmailHTML(name: string, isWelcome: boolean) {
  const welcomeBlock = isWelcome
    ? `
    <div style="background: linear-gradient(135deg, #0a0f1e, #1a2540); padding: 30px; border-radius: 16px; margin-bottom: 24px; text-align: center;">
      <h2 style="color: #c9a84c; margin: 0 0 12px 0; font-size: 22px;">🕌 أهلاً بك في مجتمع مرفأ الاستثماري</h2>
      <p style="color: #a0aec0; line-height: 1.8; font-size: 15px; margin: 0;">
        ${name || 'ضيفنا الكريم'}، يسرّنا انضمامك إلى نخبة من رواد الأعمال والمستثمرين في منصة مرفأ.
        <br/>لقاءاتنا الأسبوعية تجمع بين دراسة الحالة والتحليل العملي — نتعلم معاً ونبني جسور الاستثمار.
      </p>
    </div>`
    : '';

  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="UTF-8"></head>
<body style="font-family: 'Tajawal', 'Cairo', sans-serif; direction: rtl; background: #faf8f2; padding: 30px; margin: 0;">

<div style="max-width: 600px; margin: auto; background: #ffffff; border: 1px solid #c9a84c33; border-radius: 24px; overflow: hidden; box-shadow: 0 8px 30px rgba(10,15,30,0.06);">

  <!-- Header -->
  <div style="background: linear-gradient(135deg, #0a0f1e, #0d1628); padding: 32px 24px; text-align: center;">
    <h1 style="color: #c9a84c; font-size: 24px; margin: 0 0 8px 0;">⚓ مرفأ — لقاءات دراسات الحالة</h1>
    <p style="color: #a0aec0; font-size: 13px; margin: 0;">حيث تَرسو الطموحات</p>
  </div>

  <div style="padding: 32px 24px;">

    ${welcomeBlock}

    <!-- Meeting Card -->
    <div style="border: 2px solid #c9a84c; border-radius: 16px; padding: 24px; background: #faf8f2;">
      <h2 style="color: #0a0f1e; font-size: 18px; margin: 0 0 16px 0; text-align: center;">
        📅 دعوة لحضور اللقاء ${MEETING_DETAILS.number}
      </h2>

      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px 12px; font-weight: bold; color: #64748b; width: 100px;">📅 التاريخ</td>
          <td style="padding: 10px 12px; color: #0a0f1e; font-weight: bold;">${MEETING_DETAILS.date}</td>
        </tr>
        <tr>
          <td style="padding: 10px 12px; font-weight: bold; color: #64748b;">🕐 الوقت</td>
          <td style="padding: 10px 12px; color: #0a0f1e; font-weight: bold;">${MEETING_DETAILS.time}</td>
        </tr>
        <tr>
          <td style="padding: 10px 12px; font-weight: bold; color: #64748b;">📍 المكان</td>
          <td style="padding: 10px 12px; color: #0a0f1e; font-weight: bold;">${MEETING_DETAILS.location}</td>
        </tr>
        <tr>
          <td style="padding: 10px 12px; font-weight: bold; color: #64748b;">📚 الموضوع</td>
          <td style="padding: 10px 12px; color: #c9a84c; font-weight: bold;">${MEETING_DETAILS.topic}</td>
        </tr>
        <tr>
          <td style="padding: 10px 12px; font-weight: bold; color: #64748b;">🏢 دراسة الحالة</td>
          <td style="padding: 10px 12px; color: #0a0f1e;">${MEETING_DETAILS.case}</td>
        </tr>
        <tr>
          <td style="padding: 10px 12px; font-weight: bold; color: #64748b; vertical-align: top;">🎯 التحدي</td>
          <td style="padding: 10px 12px; color: #64748b; line-height: 1.7;">${MEETING_DETAILS.challenge}</td>
        </tr>
      </table>
    </div>

    <!-- CTA -->
    <div style="margin-top: 24px; text-align: center;">
      <a href="https://www.marfa.sa/meetings" style="display: inline-block; background: #c9a84c; color: #0a0f1e; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 15px;">
        📄 تصفح ملف PDF للقاء
      </a>
    </div>

    <!-- Method -->
    <div style="margin-top: 24px; padding: 20px; background: #f5f5f5; border-radius: 12px;">
      <h3 style="color: #0a0f1e; font-size: 14px; margin: 0 0 8px 0;">🧠 منهجية اللقاء (90 دقيقة)</h3>
      <p style="color: #64748b; font-size: 13px; line-height: 1.8; margin: 0;">
        1. عرض الحالة (15 دقيقة) &nbsp;|&nbsp;
        2. العصف الذهني (30 دقيقة) &nbsp;|&nbsp;
        3. تطبيق المحاكاة (30 دقيقة) &nbsp;|&nbsp;
        4. الخلاصة (15 دقيقة)
      </p>
    </div>

    <!-- Footer -->
    <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #c9a84c44; text-align: center;">
      <p style="color: #64748b; font-size: 12px; margin: 0 0 4px 0;">
        📍 فندق هوليداي فيلا حائل — بعد صلاة الجمعة من كل أسبوع
        🔗 https://maps.app.goo.gl/hH2bhED852UMbL6Y9
      </p>
      <p style="color: #64748b; font-size: 11px; margin: 0;">
        www.marfa.sa &nbsp;|&nbsp; منصة مرفأ الاستثمارية &nbsp;|&nbsp; حائل 🇸🇦
      </p>
    </div>

  </div>
</div>

</body>
</html>`;
}

export async function POST(request: Request) {
  try {
    // Auth check — session or API key
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const apiKey = request.headers.get('x-api-key');

    const isAuthorized =
      (user?.email && isSuperAdminEmail(user.email)) ||
      Boolean(apiKey && process.env.INTERNAL_API_SECRET && apiKey === process.env.INTERNAL_API_SECRET);

    if (!isAuthorized) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    const body = await request.json();
    const { emails } = body as { emails: string[] };

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json({ error: 'قائمة البريد الإلكتروني فارغة' }, { status: 400 });
    }

    const resend = getResend();
    const results: { email: string; status: string; error?: string }[] = [];

    for (const email of emails) {
      const isFirstTime = true; // Can be refined with a subscribers table

      try {
        const { error } = await resend.emails.send({
          from: 'Marfa Meetings <noreply@marfa.sa>',
          to: email,
          subject: `دعوة لحضور لقاء مرفأ — ${MEETING_DETAILS.date} | ${MEETING_DETAILS.case}`,
          html: buildEmailHTML(email.split('@')[0], isFirstTime),
        });

        if (error) {
          results.push({ email, status: 'فشل', error: error.message });
        } else {
          results.push({ email, status: 'تم الإرسال' });
        }
      } catch (err: unknown) {
        results.push({ email, status: 'فشل', error: err instanceof Error ? err.message : String(err) });
      }
      // Rate limit: Resend allows 2/sec — wait 600ms between sends
      await new Promise(r => setTimeout(r, 600));
    }

    // Also send a copy to the super admin
    await resend.emails.send({
      from: 'Marfa Meetings <noreply@marfa.sa>',
      to: 'op.younis@gmail.com',
      subject: `📋 تأكيد إرسال — لقاء ${MEETING_DETAILS.number} — تم الإرسال إلى ${emails.length} بريد`,
      html: `<div style="font-family: sans-serif; padding: 20px;"><h2>تم إرسال الإشعار</h2><pre>${JSON.stringify(results, null, 2)}</pre></div>`,
    }).catch(() => {});

    return NextResponse.json({ success: true, results });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
