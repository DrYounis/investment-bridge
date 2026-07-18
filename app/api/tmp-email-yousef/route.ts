import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('token') !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="UTF-8"></head>
<body style="font-family:Tajawal,Cairo,sans-serif;direction:rtl;background:#faf8f2;padding:30px;margin:0">
<div style="max-width:600px;margin:auto;background:#fff;border:1px solid #c9a84c33;border-radius:24px;overflow:hidden">
  <div style="background:linear-gradient(135deg,#0a0f1e,#0d1628);padding:28px 24px;text-align:center">
    <h1 style="color:#c9a84c;font-size:20px;margin:0">🏛️ المجلس الاستشاري — مرفأ</h1>
  </div>
  <div style="padding:28px 24px">
    <p style="color:#0a0f1e;font-size:15px;line-height:1.9">
      د. يوسف حميد،
      <br/><br/>
      وصلتنا مشاركتك في نقاش المجلس — لكن يبدو أنك كتبت إجابتك في خانة <strong>النقاش</strong> وليس في خانة <strong>سؤال الحالة</strong> المخصصة للإجابة الأسبوعية.
      <br/><br/>
      📋 <strong>لإرسال إجابتك correctly:</strong>
      <br/>
      ١. ادخل على صفحة اللقاء من هنا:
      <br/>
      <a href="https://www.marfa.sa/meetings/majlis/5" style="color:#c9a84c">www.marfa.sa/meetings/majlis/5</a>
      <br/>
      ٢. اذهب إلى قسم <strong>«سؤال الحالة»</strong> (في الأعلى)
      <br/>
      ٣. اكتب إجابتك واضغط <strong>«أرسل إجابتك»</strong>
      <br/><br/>
      ❗️ النقاش (في الأسفل) للمناقشة العامة فقط — الإجابات فيه لا تُحتسب ضمن التقييم.
    </p>
    <div style="text-align:center;margin:24px 0">
      <a href="https://www.marfa.sa/meetings/majlis/5" style="display:inline-block;background:#c9a84c;color:#0a0f1e;padding:12px 28px;border-radius:50px;text-decoration:none;font-weight:bold;font-size:14px">📝 أرسل إجابتك الآن</a>
    </div>
    <hr style="border:none;border-top:1px solid #c9a84c33;margin:20px 0">
    <p style="color:#8a94a8;font-size:11px;text-align:center;margin:0">🏛️ المجلس الاستشاري — مرفأ | حائل 🇸🇦</p>
  </div>
</div>
</body></html>`;

  try {
    const { error } = await resend.emails.send({
      from: 'Marfa Advisory <noreply@marfa.sa>',
      to: 'yhemaid2031@icloud.com',
      subject: '📝 تنبيه: إجابتك في نقاش المجلس — أرسلها من سؤال الحالة',
      html,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal error' }, { status: 500 });
  }
}
