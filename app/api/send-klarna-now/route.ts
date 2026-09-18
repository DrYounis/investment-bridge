import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Resend } from 'resend';
import { createServiceClient } from '@/lib/supabase/service';

export const maxDuration = 60;

// One-shot temp token — remove this route after the send.
const TEMP_TOKEN = '9c87b999-98e0-4098-af5c-145c6d5874c9';
const PDF_FILENAME = 'Marfa_MBA_Klarna_AIFirst_Training.pdf';

const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="UTF-8"></head>
<body style="font-family: 'Tajawal', 'Cairo', sans-serif; direction: rtl; background: #faf8f2; padding: 30px; margin: 0;">
<div style="max-width: 600px; margin: auto; background: #ffffff; border: 1px solid #c9a84c33; border-radius: 24px; overflow: hidden;">
  <div style="background: linear-gradient(135deg, #0a0f1e, #0d1628); padding: 32px 24px; text-align: center;">
    <h1 style="color: #c9a84c; font-size: 22px; margin: 0 0 8px 0;">⚓ مرفأ — موديولز MBA</h1>
    <p style="color: #a0aec0; font-size: 13px; margin: 0;">حيث تَرسو الطموحات</p>
  </div>
  <div style="padding: 32px 24px;">
    <h2 style="color: #0a0f1e; font-size: 18px; margin: 0 0 16px 0; text-align: center;">📎 مادة تدريبية: Klarna — AI-First</h2>
    <p style="color: #4a5b78; font-size: 14px; line-height: 1.8; margin: 0 0 12px 0;">أهلًا بكم،</p>
    <p style="color: #4a5b78; font-size: 14px; line-height: 1.8; margin: 0 0 12px 0;">نرفق لكم مادة التدريب الخاصة بجلسة <strong>Klarna (AI-First)</strong> من موديولز مرفأ MBA.</p>
    <p style="color: #4a5b78; font-size: 14px; line-height: 1.8; margin: 0;">نتمنى أن تكون مفيدة لكم.</p>
    <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #c9a84c44; text-align: center;">
      <p style="color: #64748b; font-size: 11px; margin: 0;">www.marfa.sa &nbsp;|&nbsp; مرفأ &nbsp;|&nbsp; حائل 🇸🇦</p>
    </div>
  </div>
</div>
</body></html>`;

export async function GET(request: NextRequest) {
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${TEMP_TOKEN}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const pdfBase64 = readFileSync(join(process.cwd(), 'public', PDF_FILENAME)).toString('base64');

    const svc = createServiceClient();
    const { data: subscribers, error: fetchErr } = await svc
      .from('meeting_subscribers')
      .select('email')
      .order('subscribed_at', { ascending: true });

    if (fetchErr || !subscribers || subscribers.length === 0) {
      return NextResponse.json({ error: fetchErr?.message || 'No subscribers' }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const results: { email: string; ok: boolean; error?: string }[] = [];

    for (const s of subscribers) {
      const { error } = await resend.emails.send({
        from: 'Marfa Meetings <noreply@marfa.sa>',
        to: s.email,
        subject: '📎 مادة تدريبية — جلسة Klarna AI-First (MBA)',
        html,
        attachments: [{ filename: PDF_FILENAME, content: pdfBase64 }],
      });
      results.push({ email: s.email, ok: !error, error: error?.message });
      await new Promise((r) => setTimeout(r, 700));
    }

    const sent = results.filter((r) => r.ok).length;
    const failed = results.filter((r) => !r.ok);

    await resend.emails.send({
      from: 'Marfa Meetings <noreply@marfa.sa>',
      to: 'op.younis@gmail.com',
      subject: `📋 تقرير إرسال — مادة Klarna AI-First (${sent}/${subscribers.length})`,
      html: `<div style="font-family: sans-serif; padding: 20px;"><h2>تقرير إرسال مادة Klarna AI-First</h2><p>أُرسل ${sent} من ${subscribers.length}.</p><pre>${JSON.stringify(failed, null, 2)}</pre></div>`,
    }).catch(() => {});

    return NextResponse.json({ success: true, sent, failed: failed.length, total: subscribers.length, results });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
