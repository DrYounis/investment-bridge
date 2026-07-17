import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@/lib/supabase/server';
import { SUPER_ADMIN_EMAILS } from '@/lib/auth/adminEmails';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: { meetingNumber?: unknown; displayName?: unknown; answer?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { meetingNumber, displayName, answer } = body;
  if (typeof meetingNumber !== 'number' || !displayName || !answer) {
    return NextResponse.json({ error: 'Missing meetingNumber, displayName, or answer' }, { status: 400 });
  }

  // ── Build notification recipients ──
  const advisorEmail = 'remy.arbaoui@gmail.com';
  const recipients = [advisorEmail, ...SUPER_ADMIN_EMAILS];

  const subject = `📝 إجابة جديدة في المجلس الاستشاري — ${displayName} | اللقاء ${meetingNumber}`;

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="UTF-8"></head>
<body style="font-family: 'Tajawal', 'Cairo', sans-serif; direction: rtl; background: #faf8f2; padding: 30px; margin: 0;">
<div style="max-width: 600px; margin: auto; background: #ffffff; border: 1px solid #c9a84c33; border-radius: 24px; overflow: hidden; box-shadow: 0 8px 30px rgba(10,15,30,0.06);">
  <div style="background: linear-gradient(135deg, #0a0f1e, #0d1628); padding: 28px 24px; text-align: center;">
    <h1 style="color: #c9a84c; font-size: 20px; margin: 0 0 4px 0;">📝 إجابة جديدة في المجلس الاستشاري</h1>
    <p style="color: #a0aec0; font-size: 13px; margin: 0;">${displayName} — اللقاء ${meetingNumber}</p>
  </div>
  <div style="padding: 28px 24px;">
    <div style="border: 1px solid #c9a84c33; border-radius: 12px; padding: 20px; background: #faf8f2; margin-bottom: 20px;">
      <p style="color: #4a5b78; line-height: 1.8; font-size: 14px; margin: 0; white-space: pre-wrap;">${String(answer).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
    </div>
    <div style="text-align: center;">
      <a href="https://www.marfa.sa/meetings/majlis/${meetingNumber}" style="display: inline-block; background: #c9a84c; color: #0a0f1e; padding: 12px 28px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 14px;">تقييم الإجابة في المجلس ←</a>
    </div>
    <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #c9a84c44; text-align: center;">
      <p style="color: #8a94a8; font-size: 11px; margin: 0;">🏛️ المجلس الاستشاري — مرفأ &nbsp;|&nbsp; حائل 🇸🇦</p>
    </div>
  </div>
</div>
</body></html>`;

  try {
    const resend = getResend();

    for (const to of recipients) {
      try {
        await resend.emails.send({
          from: 'Marfa Advisory <noreply@marfa.sa>',
          to,
          subject,
          html,
        });
      } catch (err) {
        console.error('[majlis-quiz-notify] failed to send to', to, err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[majlis-quiz-notify]', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal error' }, { status: 500 });
  }
}
