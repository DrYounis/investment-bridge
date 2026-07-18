import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createServiceClient } from '@/lib/supabase/service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('token') !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const svc = createServiceClient();

  // Find who hasn't answered meeting 5
  const { data: answers } = await svc.from('majlis_quiz_answers').select('user_id').eq('meeting_number', 5);
  const answeredIds = new Set(answers?.map(a => a.user_id) || []);

  const { data: profiles } = await svc.from('profiles').select('id, email, full_name').order('created_at');
  if (!profiles) return NextResponse.json({ error: 'No profiles' }, { status: 500 });

  const skipEmails = ['op.younis@gmail.com', 'remy.arbaoui@gmail.com', 'mohamedy2003@gmail.com', '10.younis@gmail.com'];
  const targets = profiles.filter(p =>
    !answeredIds.has(p.id) && p.email && !p.email.includes('test.com') && !skipEmails.includes(p.email)
  );

  const resend = new Resend(process.env.RESEND_API_KEY);
  const results: { email: string; status: string }[] = [];

  const html = (name: string) => `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="UTF-8"></head>
<body style="font-family:Tajawal,Cairo,sans-serif;direction:rtl;background:#faf8f2;padding:30px;margin:0">
<div style="max-width:600px;margin:auto;background:#fff;border:1px solid #c9a84c33;border-radius:24px;overflow:hidden">
  <div style="background:linear-gradient(135deg,#0a0f1e,#0d1628);padding:28px 24px;text-align:center">
    <h1 style="color:#c9a84c;font-size:20px;margin:0">🏛️ المجلس الاستشاري — مرفأ</h1>
    <p style="color:#a0aec0;font-size:12px;margin:4px 0 0">5 نقاط على كل إجابة</p>
  </div>
  <div style="padding:28px 24px">
    <p style="color:#0a0f1e;font-size:15px;line-height:1.9">
      ${name ? 'أهلاً ' + name + '،' : 'أهلاً،'}
      <br/><br/>
      نذكّرك بالإجابة على <strong>سؤال الحالة</strong> للقاء الخامس قبل موعد اللقاء القادم (الجمعة 24 يوليو).
      <br/><br/>
      🎯 <strong>كل إجابة تمنحك 5 نقاط في تقييمك الشهري لدى المجلس الاستشاري.</strong>
      <br/><br/>
      📋 للإجابة:
      <br/>
      ١. ادخل على <a href="https://www.marfa.sa/meetings/majlis/5" style="color:#c9a84c">صفحة المجلس</a>
      <br/>
      ٢. اذهب إلى قسم <strong>«سؤال الحالة»</strong> في الأعلى
      <br/>
      ٣. اكتب إجابتك واضغط <strong>«أرسل إجابتك»</strong>
      <br/><br/>
      ⏳ آخر موعد: <strong>قبل الجمعة 24 يوليو 2026</strong>
    </p>
    <div style="text-align:center;margin:24px 0">
      <a href="https://www.marfa.sa/meetings/majlis/5" style="display:inline-block;background:#c9a84c;color:#0a0f1e;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:bold;font-size:14px">📝 أجب الآن في المجلس</a>
    </div>
    <hr style="border:none;border-top:1px solid #c9a84c33;margin:20px 0">
    <p style="color:#8a94a8;font-size:11px;text-align:center;margin:0">🏛️ المجلس الاستشاري — مرفأ | حائل 🇸🇦</p>
  </div>
</div>
</body></html>`;

  for (const p of targets) {
    try {
      const { error } = await resend.emails.send({
        from: 'Marfa Advisory <noreply@marfa.sa>',
        to: p.email!,
        subject: '🏛️ 5 نقاط في تقييمك — أجب على سؤال الحالة قبل الجمعة القادمة',
        html: html(p.full_name || ''),
      });
      results.push({ email: p.email!, status: error ? `FAIL: ${error.message}` : 'SENT' });
    } catch (err) {
      results.push({ email: p.email!, status: `FAIL: ${err instanceof Error ? err.message : String(err)}` });
    }
    await new Promise(r => setTimeout(r, 600));
  }

  return NextResponse.json({ success: true, sent: results.filter(r => r.status === 'SENT').length, total: targets.length, results });
}
