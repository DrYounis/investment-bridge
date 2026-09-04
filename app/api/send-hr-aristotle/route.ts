import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createServiceClient } from '@/lib/supabase/service';

export const dynamic = 'force-dynamic';

// One-shot auth token — remove this route immediately after sending.
const TEMP_TOKEN = '3f8c2d19-4b7a-4e5c-9a1d-7f6e5b4a3c21';

const SUBJECT = 'دليل تدريبي من مرفأ: فعالية الفريق (Google Project Aristotle)';
const BODY_TEXT =
  'مرحباً،\n\nنشارككم دليل المدرب لوحدة تدريبية عن فعالية الفرق، مستوحاة من دراسة Google Project Aristotle.\n\nالملف مرفق مع هذه الرسالة بصيغة PDF.\n\nفريق مرفأ — حيث تَرسو الطموحات';

function buildEmailHTML(name: string): string {
  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0a0f1e;direction:rtl;font-family:Tajawal,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f1e;padding:30px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#0d1628;border-radius:12px;overflow:hidden;border-top:4px solid #c9a84c;">
        <tr>
          <td style="padding:32px 28px;text-align:right;">
            <h2 style="color:#c9a84c;font-size:18px;margin:0 0 8px 0;font-weight:800;font-family:Tajawal,sans-serif;">مرفأ</h2>
            <p style="color:#ffffff;font-size:15px;line-height:1.7;margin:16px 0 0 0;font-family:Tajawal,sans-serif;">مرحباً ${name}،</p>
            <div style="color:#a0aec0;font-size:14px;line-height:1.8;margin-top:12px;font-family:Tajawal,sans-serif;white-space:pre-wrap;">${BODY_TEXT}</div>
            <hr style="border:none;border-top:1px solid #1a2540;margin:24px 0 12px 0;">
            <p style="color:#64748b;font-size:11px;text-align:right;font-family:Tajawal,sans-serif;margin:0;">
              فريق مرفأ — حيث تَرسو الطموحات
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${TEMP_TOKEN}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { pdfBase64?: string; filename?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { pdfBase64, filename } = body;
  if (!pdfBase64 || !filename) {
    return NextResponse.json({ error: 'Missing pdfBase64 or filename' }, { status: 400 });
  }

  const supabaseAdmin = createServiceClient();
  const { data, error: dbError } = await supabaseAdmin
    .from('meeting_subscribers')
    .select('email')
    .order('subscribed_at', { ascending: true });

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  const rows = (data ?? []) as Array<{ email: string | null }>;
  const emails = rows.map((r) => r.email).filter((e): e is string => Boolean(e));

  if (emails.length === 0) {
    return NextResponse.json({ error: 'No subscribers found' }, { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const results: Array<{ email: string; status: string }> = [];
  let sent = 0;
  let failed = 0;

  for (let i = 0; i < emails.length; i++) {
    const email = emails[i];
    const { error } = await resend.emails.send({
      from: 'مرفأ <noreply@marfa.sa>',
      to: email,
      subject: SUBJECT,
      html: buildEmailHTML(email.split('@')[0]),
      attachments: [
        {
          filename,
          content: pdfBase64,
          contentType: 'application/pdf',
        },
      ],
    });

    if (error) {
      failed++;
      results.push({ email, status: `فشل: ${error.message}` });
    } else {
      sent++;
      results.push({ email, status: 'تم الإرسال' });
    }

    if (i < emails.length - 1) {
      await new Promise((r) => setTimeout(r, 600));
    }
  }

  return NextResponse.json({ success: true, total: emails.length, sent, failed, results });
}
