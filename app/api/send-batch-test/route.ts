import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { sendBatch } from '@/lib/resend-batch';

export const maxDuration = 60;

// One-shot smoke test — remove after running.
const TEST_TOKEN = 'batch-test-9f2e1c';

export async function GET(request: Request) {
  if (request.headers.get('authorization') !== `Bearer ${TEST_TOKEN}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const emails = [
    {
      from: 'مرفأ <noreply@marfa.sa>',
      to: 'op.younis@gmail.com',
      subject: '🧪 Batch smoke test — valid address',
      html: '<div style="font-family:sans-serif;padding:20px;direction:rtl">هذا اختبار للإرسال المجمّع إلى عنوان صحيح.</div>',
    },
    {
      from: 'مرفأ <noreply@marfa.sa>',
      to: 'not-a-real-address@nonexistent-domain-xyz.invalid',
      subject: '🧪 Batch smoke test — invalid domain',
      html: '<div style="font-family:sans-serif;padding:20px">should fail</div>',
    },
    {
      from: 'مرفأ <noreply@marfa.sa>',
      to: 'not-an-email-address',
      subject: '🧪 Batch smoke test — malformed',
      html: '<div style="font-family:sans-serif;padding:20px">should fail</div>',
    },
  ];

  const result = await sendBatch(resend, emails);
  return NextResponse.json(result);
}
