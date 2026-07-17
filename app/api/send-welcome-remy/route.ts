import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  if (token !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="UTF-8"></head>
<body style="font-family:'Tajawal','Cairo',sans-serif;direction:rtl;background:#faf8f2;padding:30px;margin:0">
<div style="max-width:600px;margin:auto;background:#fff;border:1px solid #c9a84c33;border-radius:24px;overflow:hidden;box-shadow:0 8px 30px rgba(10,15,30,0.06)">
  <div style="background:linear-gradient(135deg,#0a0f1e,#0d1628);padding:32px 24px;text-align:center">
    <h1 style="color:#c9a84c;font-size:24px;margin:0 0 8px 0">🏛️ أهلاً بك في المجلس الاستشاري — مرفأ</h1>
    <p style="color:#a0aec0;font-size:13px;margin:0">حيث تَرسو الطموحات</p>
  </div>
  <div style="padding:32px 24px">
    <div style="border:2px solid #c9a84c;border-radius:16px;padding:24px;background:#faf8f2;margin-bottom:20px;text-align:center">
      <h2 style="color:#0a0f1e;font-size:18px;margin:0 0 12px 0">د. ريمي أرباوي — المستشار الأول للأعمال</h2>
      <p style="color:#4a5b78;line-height:1.9;font-size:15px;margin:0">
        يسرّنا في منصة مرفأ أن نرحب بكم مستشاراً أول للمجلس الاستشاري.
        <br/><br/>
        دوركم في المجلس: قراءة إجابات رواد الأعمال على أسئلة الحالات الأسبوعية، وتقييمها بدرجة من ٥، وكتابة ردود توجيهية.
        <br/><br/>
        منهجكم الذي يجمع بين إدارة الأعمال وعلم النفس وسلوك الإنسان والحوكمة هو بالضبط ما يحتاجه رواد الأعمال في مرفأ.
      </p>
    </div>
    <div style="text-align:center;margin-bottom:20px">
      <a href="https://www.marfa.sa/meetings" style="display:inline-block;background:#c9a84c;color:#0a0f1e;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:bold;font-size:15px">تصفح لقاءات مرفأ ←</a>
    </div>
    <div style="border:1px solid #c9a84c33;border-radius:12px;padding:16px;background:#faf8f2">
      <p style="color:#0a0f1e;font-size:14px;font-weight:bold;margin:0 0 8px 0">📋 آلية العمل:</p>
      <p style="color:#4a5b78;font-size:13px;line-height:1.8;margin:0">
        • كل يوم سبت مساءً، يصلك إشعار بالإجابات الجديدة بعد كل لقاء<br/>
        • تدخل على صفحة المجلس وتقيّم كل إجابة (درجة + رد)<br/>
        • يحصل رائد الأعمال على تقييمك فوراً في حسابه
      </p>
    </div>
    <div style="margin-top:32px;padding-top:20px;border-top:1px solid #c9a84c44;text-align:center">
      <p style="color:#8a94a8;font-size:11px;margin:0">للتواصل: remy.arbaoui@gmail.com</p>
      <p style="color:#8a94a8;font-size:11px;margin:4px 0 0">www.marfa.sa | منصة مرفأ الاستثمارية | حائل 🇸🇦</p>
    </div>
  </div>
</div>
</body></html>`;

  try {
    const { error } = await resend.emails.send({
      from: 'Marfa Advisory <noreply@marfa.sa>',
      to: 'remy.arbaoui@gmail.com',
      subject: '🏛️ أهلاً بك في المجلس الاستشاري — مرفأ | د. ريمي أرباوي',
      html,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, to: 'remy.arbaoui@gmail.com' });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal error' }, { status: 500 });
  }
}
