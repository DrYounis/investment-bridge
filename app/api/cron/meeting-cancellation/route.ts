import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createServiceClient } from '@/lib/supabase/service';
import { sendBatch } from '@/lib/resend-batch';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

function isCronAuthorized(request: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return false;
  const authHeader = request.headers.get('authorization');
  if (authHeader === `Bearer ${cronSecret}`) return true;
  return false;
}

function buildCancellationHTML(email: string) {
  const name = email.split('@')[0];

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

    <div style="border: 2px solid #c9a84c; border-radius: 16px; padding: 24px; background: #faf8f2; margin-bottom: 24px;">
      <h2 style="color: #0a0f1e; font-size: 18px; margin: 0 0 16px 0; text-align: center;">📅 تأجيل لقاء الذكاء الاصطناعي</h2>
      <p style="color: #4a5b78; line-height: 1.9; font-size: 15px; margin: 0; text-align: center;">
        عزيزنا ${name}،
      </p>
      <p style="color: #4a5b78; line-height: 1.9; font-size: 15px; margin: 16px 0 0 0; text-align: center;">
        نحيطكم علماً بأن لقاء هذا الأسبوع حول <strong style="color: #0a0f1e;">الذكاء الاصطناعي</strong> — الذي كان مقرراً أن يقدمه <strong style="color: #0a0f1e;">المهندس أحمد يونس، الرئيس التنفيذي للتقنية في مرفأ</strong> — قد تم تأجيله نظراً لعدم اكتمال العدد المتوقع من الحضور.
      </p>
      <p style="color: #4a5b78; line-height: 1.9; font-size: 15px; margin: 16px 0 0 0; text-align: center;">
        وسيُعقد اللقاء بإذن الله يوم <strong style="color: #c9a84c;">الجمعة 18 سبتمبر 2026</strong>، وسنوافيكم بالتفاصيل النهائية قريباً.
      </p>
    </div>

    <div style="background: linear-gradient(135deg, #0a0f1e, #0d1628); border-radius: 16px; padding: 24px; text-align: center;">
      <p style="color: #c9a84c; font-size: 15px; font-weight: bold; margin: 0;">نعتذر عن أي إزعاج، ونتطلع للقائكم قريباً.</p>
    </div>

    <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #c9a84c44; text-align: center;">
      <p style="color: #64748b; font-size: 12px; margin: 0 0 4px 0;">📍 <a href="https://maps.app.goo.gl/hH2bhED852UMbL6Y9" style="color: #64748b; text-decoration: underline;">فندق هوليداي فيلا حائل</a> — بعد صلاة الجمعة من كل أسبوع</p>
      <p style="color: #64748b; font-size: 11px; margin: 0;">www.marfa.sa &nbsp;|&nbsp; منصة مرفأ الاستثمارية &nbsp;|&nbsp; حائل 🇸🇦</p>
    </div>
  </div>
</div>
</body></html>`;
}

export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createServiceClient();

    // Fetch all meeting subscribers
    const { data: subscribers } = await supabase
      .from('meeting_subscribers')
      .select('email')
      .order('subscribed_at', { ascending: true });

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ message: 'No subscribers found' });
    }

    // Optional single-email test mode: ?email=op.younis@gmail.com
    const { searchParams } = new URL(request.url);
    const singleEmail = searchParams.get('email');
    const recipients = singleEmail
      ? subscribers.filter(s => s.email === singleEmail)
      : subscribers;

    if (recipients.length === 0) {
      return NextResponse.json({ message: `Email not found: ${singleEmail}` });
    }

    const resend = getResend();
    const subject = '📅 تأجيل لقاء الذكاء الاصطناعي إلى الجمعة 18 سبتمبر 2026';

    const emails = recipients.map((sub) => ({
      from: 'Marfa Meetings <noreply@marfa.sa>',
      to: sub.email,
      subject,
      html: buildCancellationHTML(sub.email),
    }));

    const { failures } = await sendBatch(resend, emails);
    const failedByIndex = new Map(failures.map(f => [f.index, f.message]));
    const results: { email: string; status: string }[] = recipients.map((sub, i) => ({
      email: sub.email,
      status: failedByIndex.has(i) ? `فشل: ${failedByIndex.get(i)}` : 'تم الإرسال',
    }));

    const sent = results.filter(r => r.status === 'تم الإرسال').length;

    // Admin report
    await resend.emails.send({
      from: 'Marfa Meetings <noreply@marfa.sa>',
      to: 'op.younis@gmail.com',
      subject: `📋 تقرير إرسال — تأجيل لقاء الذكاء الاصطناعي (${sent}/${recipients.length})`,
      html: `<div style="font-family: sans-serif; padding: 20px;"><h2>تقرير إرسال إشعار التأجيل</h2><p>اللقاء: الذكاء الاصطناعي — تأجيل إلى الجمعة 18 سبتمبر 2026</p><pre>${JSON.stringify(results, null, 2)}</pre></div>`,
    }).catch(() => {});

    return NextResponse.json({ success: true, sent, total: recipients.length, results });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
