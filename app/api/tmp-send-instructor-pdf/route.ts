import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createServiceClient } from '@/lib/supabase/service';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

const TEMP_TOKEN = 'ba77073a-f451-4351-a4cc-afa1574d5863';
const PDF_STORAGE_NAME = 'Marfa_MBA_JnJ_Tylenol_EN.pdf';
const PDF_FILENAME = 'Marfa_MBA_JnJ_Tylenol_EN.pdf';
const WELCOME_EMAIL = 'accmahamad86@gmail.com';
const WELCOME_NAME = 'Mohamad ahmad Fathallah';

function welcomeHtml(name: string): string {
  return `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"></head>
<body style="font-family:'Tajawal','Cairo',sans-serif;direction:rtl;background:#faf8f2;padding:30px;margin:0">
<div style="max-width:560px;margin:auto;background:#fff;border:1px solid #c9a84c33;border-radius:24px;overflow:hidden;box-shadow:0 8px 30px rgba(10,15,30,0.06)">
  <div style="background:linear-gradient(135deg,#0a0f1e,#0d1628);padding:32px 24px;text-align:center">
    <h1 style="color:#c9a84c;font-size:22px;margin:0 0 6px 0">🚀 مرحباً بك في مرفأ</h1>
    <p style="color:#a0aec0;font-size:13px;margin:0">حيث تَرسو الطموحات</p>
  </div>
  <div style="padding:28px 24px">
    <p style="color:#4a5b78;font-size:15px;line-height:1.9;margin:0 0 16px 0">مرحباً ${name}،</p>
    <p style="color:#4a5b78;font-size:14px;line-height:1.9;margin:0 0 20px 0">
      يسرّنا انضمامك إلى مجتمع مرفأ لتدريب روّاد الأعمال. نلتقي كل جمعة في لقاء تدريبي يعتمد على دراسة حالة حقيقية، مع نقاش مباشر وتغذية راجعة من مستشارين معتمدين.
    </p>
    <div style="text-align:center;margin-bottom:20px">
      <a href="https://www.marfa.sa/meetings" style="display:inline-block;background:linear-gradient(135deg,#c9a84c,#d4a843);color:#0a0f1e;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:bold;font-size:15px">📅 تصفح جدول اللقاءات</a>
    </div>
    <div style="margin-top:16px;padding-top:16px;border-top:1px solid #c9a84c33;text-align:center">
      <p style="color:#8a94a8;font-size:11px;margin:0">مرفأ — منصة تدريب روّاد الأعمال | حائل 🇸🇦</p>
    </div>
  </div>
</div></body></html>`;
}

function pdfEmailHtml(greeting: string): string {
  return `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"></head>
<body style="font-family:'Tajawal','Cairo',sans-serif;direction:rtl;background:#faf8f2;padding:30px;margin:0">
<div style="max-width:560px;margin:auto;background:#fff;border:1px solid #c9a84c33;border-radius:24px;overflow:hidden;box-shadow:0 8px 30px rgba(10,15,30,0.06)">
  <div style="background:linear-gradient(135deg,#0a0f1e,#0d1628);padding:32px 24px;text-align:center">
    <h1 style="color:#c9a84c;font-size:22px;margin:0 0 6px 0">⚓ مرفأ — لقاء اليوم</h1>
    <p style="color:#a0aec0;font-size:13px;margin:0">دليل المدرّب باللغة الإنجليزية</p>
  </div>
  <div style="padding:28px 24px">
    <p style="color:#4a5b78;font-size:15px;line-height:1.9;margin:0 0 16px 0">${greeting}،</p>
    <p style="color:#4a5b78;font-size:14px;line-height:1.9;margin:0 0 20px 0">
      مرفق بهذه الرسالة دليل المدرّب باللغة الإنجليزية لدراسة حالة اليوم: <b style="color:#0a0f1e">Johnson &amp; Johnson — Tylenol</b> (إدارة الأزمات).
    </p>
    <div style="background:#faf8f2;border:1px solid #c9a84c33;border-radius:12px;padding:14px 16px;margin-bottom:20px">
      <p style="color:#64748b;font-size:13px;line-height:1.8;margin:0">📎 الملف المرفق: ${PDF_FILENAME}</p>
    </div>
    <div style="margin-top:16px;padding-top:16px;border-top:1px solid #c9a84c33;text-align:center">
      <p style="color:#8a94a8;font-size:11px;margin:0">مرفأ — منصة تدريب روّاد الأعمال | حائل 🇸🇦</p>
    </div>
  </div>
</div></body></html>`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('token') !== TEMP_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const supabase = createServiceClient();

  // 1. Download PDF from storage
  const { data: pdfBlob, error: pdfErr } = await supabase.storage
    .from('instructor-guides')
    .download(PDF_STORAGE_NAME);
  if (pdfErr || !pdfBlob) {
    return NextResponse.json({ error: `PDF download failed: ${pdfErr?.message || 'no blob'}` }, { status: 500 });
  }
  const pdfBase64 = Buffer.from(await pdfBlob.arrayBuffer()).toString('base64');

  // 2. Resolve subscriber names from profiles
  const { data: subscribers } = await supabase
    .from('meeting_subscribers')
    .select('email')
    .order('subscribed_at', { ascending: true });

  const { data: profiles } = await supabase
    .from('profiles')
    .select('email, full_name');

  const nameMap = new Map<string, string>();
  for (const p of profiles || []) {
    if (p.email && p.full_name) nameMap.set(p.email.toLowerCase(), p.full_name);
  }

  // 3. Welcome email (separate, to the new user)
  let welcomeStatus = 'skipped';
  try {
    const { error: wErr } = await resend.emails.send({
      from: 'مرفأ <noreply@marfa.sa>',
      to: WELCOME_EMAIL,
      subject: '🚀 مرحباً بك في مرفأ — حيث تَرسو الطموحات',
      html: welcomeHtml(WELCOME_NAME),
    });
    welcomeStatus = wErr ? `فشل: ${wErr.message}` : 'تم الإرسال';
  } catch (e) {
    welcomeStatus = `فشل: ${e instanceof Error ? e.message : String(e)}`;
  }

  // 4. PDF email to each subscriber (individual send to preserve the attachment)
  const results: { email: string; status: string }[] = [];
  const subs = subscribers || [];
  for (const sub of subs) {
    const name = nameMap.get(sub.email.toLowerCase());
    const greeting = name ? `مرحباً ${name}` : 'مرحباً بك';
    try {
      const { error } = await resend.emails.send({
        from: 'مرفأ <noreply@marfa.sa>',
        to: sub.email,
        subject: '📎 دليل المدرّب باللغة الإنجليزية — لقاء اليوم (Johnson & Johnson)',
        html: pdfEmailHtml(greeting),
        attachments: [{ filename: PDF_FILENAME, content: pdfBase64 }],
      });
      results.push({ email: sub.email, status: error ? `فشل: ${error.message}` : 'تم الإرسال' });
    } catch (e) {
      results.push({ email: sub.email, status: `فشل: ${e instanceof Error ? e.message : String(e)}` });
    }
    await new Promise((r) => setTimeout(r, 600));
  }

  const sent = results.filter((r) => r.status === 'تم الإرسال').length;
  return NextResponse.json({ welcome: welcomeStatus, sent, total: results.length, results });
}
