import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createServiceClient } from '@/lib/supabase/service';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Temp token (route is deleted after the one-shot send).
const TEMP_TOKEN = 'mfa-send-meeting12-8c4d1f2a9b';

const PDF_BUCKET = 'instructor-guides';
const PDF_PATH = 'Marfa_MBA_Tawuniya_Case_Meeting12.pdf';

const SUBJECT = '📄 دراسة حالة اللقاء 12 — اقتصاديات التأمين: حالة «التعاونية» (تداول: 8010)';
const BODY_AR = 'نرفق لكم ملف دراسة الحالة للقاء الثاني عشر «اقتصاديات التأمين» — حالة شركة التعاونية. يرجى قراءته قبل اللقاء.';

function buildHTML(name: string): string {
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
    <p style="color: #0a0f1e; font-size: 16px; margin: 0 0 16px 0;">مرحباً ${name}،</p>
    <div style="border: 2px solid #c9a84c; border-radius: 16px; padding: 24px; background: #faf8f2;">
      <h2 style="color: #0a0f1e; font-size: 18px; margin: 0 0 12px 0; text-align: center;">📚 اللقاء 12 — اقتصاديات التأمين</h2>
      <p style="color: #4a5b78; line-height: 1.9; font-size: 15px; margin: 0; text-align: center;">${BODY_AR}</p>
    </div>
    <div style="margin-top: 24px; text-align: center;">
      <p style="color: #8a94a8; font-size: 13px; margin: 0 0 8px 0;">📎 الملف مرفق بهذه الرسالة.</p>
    </div>
    <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #c9a84c44; text-align: center;">
      <p style="color: #64748b; font-size: 11px; margin: 0;">www.marfa.sa &nbsp;|&nbsp; منصة مرفأ الاستثمارية &nbsp;|&nbsp; حائل 🇸🇦</p>
    </div>
  </div>
</div>
</body></html>`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('token') !== TEMP_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServiceClient();
  const resend = new Resend(process.env.RESEND_API_KEY);

  // 1. Download the PDF from private storage → base64
  const { data: pdfBlob, error: dlError } = await supabase.storage
    .from(PDF_BUCKET)
    .download(PDF_PATH);

  if (dlError || !pdfBlob) {
    return NextResponse.json({ error: `PDF download failed: ${dlError?.message || 'no data'}` }, { status: 500 });
  }

  const arrayBuffer = await pdfBlob.arrayBuffer();
  const contentBase64 = Buffer.from(arrayBuffer).toString('base64');

  // 2. Fetch subscribers (dedupe by lowercase email)
  const { data: subscribers, error: subsError } = await supabase
    .from('meeting_subscribers')
    .select('email')
    .order('subscribed_at', { ascending: true });

  if (subsError || !subscribers || subscribers.length === 0) {
    return NextResponse.json({ error: `Subscribers fetch failed: ${subsError?.message || 'none found'}` }, { status: 500 });
  }

  const uniqueEmails: string[] = [];
  const seen = new Set<string>();
  for (const s of subscribers) {
    const e = (s.email || '').trim().toLowerCase();
    if (e && !seen.has(e)) {
      seen.add(e);
      uniqueEmails.push(e);
    }
  }

  // 3. Resolve names
  const { data: profiles } = await supabase
    .from('profiles')
    .select('email, full_name, full_name_ar')
    .in('email', uniqueEmails);

  const nameByEmail = new Map<string, string>();
  if (profiles) {
    for (const p of profiles) {
      nameByEmail.set((p.email || '').trim().toLowerCase(), p.full_name || p.full_name_ar || '');
    }
  }

  // 4. Send individually (batch silently drops attachments)
  const results: { email: string; name: string; status: string }[] = [];
  let sent = 0;
  let failed = 0;

  for (const email of uniqueEmails) {
    const name = nameByEmail.get(email) || '';
    try {
      const { error } = await resend.emails.send({
        from: 'مرفأ <noreply@marfa.sa>',
        to: email,
        subject: SUBJECT,
        html: buildHTML(name || 'بك'),
        attachments: [{ filename: PDF_PATH, content: contentBase64 }],
      });
      if (error) {
        failed++;
        results.push({ email, name, status: `فشل: ${error.message}` });
      } else {
        sent++;
        results.push({ email, name, status: 'تم الإرسال' });
      }
    } catch (err: unknown) {
      failed++;
      results.push({ email, name, status: `فشل: ${err instanceof Error ? err.message : String(err)}` });
    }
    await new Promise((r) => setTimeout(r, 700));
  }

  // 5. Admin report
  await resend.emails
    .send({
      from: 'مرفأ <noreply@marfa.sa>',
      to: 'op.younis@gmail.com',
      subject: `📋 تقرير إرسال ملف اللقاء 12 — تم ${sent}/${uniqueEmails.length}`,
      html: `<div style="font-family: sans-serif; padding: 20px;"><h2>تقرير إرسال ملف دراسة الحالة (اللقاء 12)</h2><p>تم الإرسال: ${sent} | فشل: ${failed} | الإجمالي: ${uniqueEmails.length}</p><pre>${JSON.stringify(results, null, 2)}</pre></div>`,
    })
    .catch(() => {});

  return NextResponse.json({ success: true, sent, failed, total: uniqueEmails.length, results });
}
