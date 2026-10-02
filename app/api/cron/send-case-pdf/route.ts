import { NextResponse } from 'next/server';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Resend } from 'resend';
import { createServiceClient } from '@/lib/supabase/service';

export const maxDuration = 60;

// One-shot temp token — this route is removed immediately after use.
const TEMP_TOKEN = 'b3e9d2f4-7a1c-4e5b-9d0f-6c8a2e7b5d31';

const PDF_PATH = join(process.cwd(), 'public/case-studies/Marfa_MBA_Theranos_Case_Weekly.pdf');
const PDF_FILENAME = 'Marfa_MBA_Theranos_Case_Weekly.pdf';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('token') !== TEMP_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const pdfBuffer = readFileSync(PDF_PATH);
    const pdfBase64 = pdfBuffer.toString('base64');

    const supabase = createServiceClient();
    const singleEmail = searchParams.get('email');

    const { data: subscribers } = await supabase
      .from('meeting_subscribers')
      .select('email')
      .order('subscribed_at', { ascending: true });

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ message: 'No subscribers found' });
    }

    const recipients = singleEmail
      ? subscribers.filter((s) => s.email.toLowerCase() === singleEmail.toLowerCase())
      : subscribers;

    if (recipients.length === 0) {
      return NextResponse.json({ message: `Email not found: ${singleEmail}` });
    }

    if (searchParams.get('dryRun') === '1') {
      return NextResponse.json({
        dryRun: true,
        total: recipients.length,
        attachment: { filename: PDF_FILENAME, bytes: pdfBuffer.length },
        recipients: recipients.map((s) => s.email),
      });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const subject = '📎 حالة الأسبوع — لقاء مرفأ 13: إدارة المخاطر (Theranos)';
    const html = `
      <div dir="rtl" style="font-family: Tahoma, Arial, sans-serif; color:#0a0f1e; line-height:1.9; font-size:16px;">
        <p>مرحباً بك،</p>
        <p>مرفق مع هذه الرسالة ملف دراسة الحالة لهذا الأسبوع — <strong>اللقاء 13: إدارة المخاطر</strong>، حالة "Theranos" الاحتيال.</p>
        <p>نلتقي يوم الجمعة، 2 أكتوبر 2026.</p>
        <p style="color:#8a94a8;">— فريق مرفأ</p>
      </div>
    `;

    const results: { email: string; status: string }[] = [];

    for (const sub of recipients) {
      try {
        await resend.emails.send({
          from: 'Marfa Meetings <noreply@marfa.sa>',
          to: sub.email,
          subject,
          html,
          attachments: [{ filename: PDF_FILENAME, content: pdfBase64 }],
        });
        results.push({ email: sub.email, status: 'تم الإرسال' });
      } catch (err: unknown) {
        results.push({ email: sub.email, status: `فشل: ${err instanceof Error ? err.message : String(err)}` });
      }
      await delay(700);
    }

    const sent = results.filter((r) => r.status === 'تم الإرسال').length;

    return NextResponse.json({
      success: true,
      sent,
      total: recipients.length,
      attachment: { filename: PDF_FILENAME, bytes: pdfBuffer.length },
      results,
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
