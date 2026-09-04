import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

// One-shot route — remove after sending.
const TEMP_TOKEN = 'mukhtar-welcome-9b4d2f';

const EMAIL = 'mukhtarhalfa1974@yahoo.com';
const NAME = 'Dr Mukhtar Othman';

function buildHTML(): string {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="UTF-8"></head>
<body style="font-family:'Tajawal','Cairo',sans-serif;direction:rtl;background:#faf8f2;padding:30px;margin:0">
<div style="max-width:560px;margin:auto;background:#fff;border:1px solid #c9a84c33;border-radius:24px;overflow:hidden;box-shadow:0 8px 30px rgba(10,15,30,0.06)">

<div style="background:linear-gradient(135deg,#0a0f1e,#0d1628);padding:32px 24px;text-align:center">
  <h1 style="color:#c9a84c;font-size:22px;margin:0 0 6px 0">🚀 مرحباً بك في مرفأ</h1>
  <p style="color:#a0aec0;font-size:13px;margin:0">حيث تَرسو الطموحات</p>
</div>

<div style="padding:28px 24px">

  <p style="color:#0a0f1e;font-size:16px;line-height:1.9;margin:0 0 20px 0;text-align:center;font-weight:bold">
    مرحباً ${NAME}،
  </p>

  <p style="color:#4a5b78;font-size:15px;line-height:1.9;margin:0 0 20px 0;text-align:center">
    تم تسجيلك بنجاح! هذه أبرز ما يمكنك فعله الآن:
  </p>

  <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:24px">
    <a href="https://www.marfa.sa/advisor" style="display:block;background:#faf8f2;border:1px solid #c9a84c33;border-radius:12px;padding:14px 16px;text-decoration:none;color:#0a0f1e;text-align:right">
      <span style="display:block;font-weight:bold;font-size:14px">🧠 Marfa 360° — حلّل فكرتك</span>
      <span style="font-size:12px;color:#64748b">مستشار استراتيجي يحلل فكرة مشروعك من 6 زوايا خلال دقائق</span>
    </a>
    <a href="https://www.marfa.sa/meetings" style="display:block;background:#faf8f2;border:1px solid #c9a84c33;border-radius:12px;padding:14px 16px;text-decoration:none;color:#0a0f1e;text-align:right">
      <span style="display:block;font-weight:bold;font-size:14px">🏛️ المجلس الاستشاري</span>
      <span style="font-size:12px;color:#64748b">١٤ لقاء تدريبي — كل جمعة — مع تقييم شهري من مستشارين معتمدين</span>
    </a>
    <a href="https://www.marfa.sa/learn/glossary" style="display:block;background:#faf8f2;border:1px solid #c9a84c33;border-radius:12px;padding:14px 16px;text-decoration:none;color:#0a0f1e;text-align:right">
      <span style="display:block;font-weight:bold;font-size:14px">📚 قاموس المصطلحات التجارية</span>
      <span style="font-size:12px;color:#64748b">٣٠٠ مصطلح ثنائي اللغة — ومصطلح الأسبوع على إيميلك كل اثنين</span>
    </a>
    <a href="https://www.marfa.sa/jobs" style="display:block;background:#faf8f2;border:1px solid #c9a84c33;border-radius:12px;padding:14px 16px;text-decoration:none;color:#0a0f1e;text-align:right">
      <span style="display:block;font-weight:bold;font-size:14px">💼 فرص وظيفية</span>
      <span style="font-size:12px;color:#64748b">وظائف محدّثة من كبرى المنصات في السعودية</span>
    </a>
  </div>

  <div style="text-align:center">
    <a href="https://www.marfa.sa/dashboard/hub" style="display:inline-block;background:linear-gradient(135deg,#c9a84c,#d4a843);color:#0a0f1e;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:bold;font-size:15px">🚢 ادخل إلى مرساك</a>
  </div>

  <div style="margin-top:24px;padding-top:16px;border-top:1px solid #c9a84c33;text-align:center">
    <p style="color:#64748b;font-size:10px;margin:0">مرفأ — منصة تدريب رواد الأعمال | حائل 🇸🇦</p>
  </div>

</div></div></body></html>`;
}

export async function POST(request: Request) {
  if (request.headers.get('authorization') !== `Bearer ${TEMP_TOKEN}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: 'مرفأ <noreply@marfa.sa>',
    to: EMAIL,
    subject: '🚀 مرحباً بك في مرفأ — حيث تَرسو الطموحات',
    html: buildHTML(),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, to: EMAIL });
}
