/**
 * Send TODAY's AI special-session reminder to ALL meeting_subscribers.
 * Usage: npx tsx scripts/send-ai-session-reminder-now.ts
 */
import { config } from 'dotenv';
import { resolve } from 'node:path';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { sendBatch } from '../lib/resend-batch';

config({ path: resolve(process.cwd(), '.env.local') });

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!RESEND_API_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing env (RESEND_API_KEY / NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)');
  process.exit(1);
}

const resend = new Resend(RESEND_API_KEY);
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="UTF-8"></head>
<body style="font-family: 'Tajawal', 'Cairo', sans-serif; direction: rtl; background: #faf8f2; padding: 30px; margin: 0;">
<div style="max-width: 600px; margin: auto; background: #ffffff; border: 1px solid #c9a84c33; border-radius: 24px; overflow: hidden;">
  <div style="background: linear-gradient(135deg, #0a0f1e, #0d1628); padding: 32px 24px; text-align: center;">
    <h1 style="color: #c9a84c; font-size: 24px; margin: 0 0 8px 0;">⚓ مرفأ — لقاء خاص</h1>
    <p style="color: #a0aec0; font-size: 13px; margin: 0;">حيث تَرسو الطموحات</p>
  </div>
  <div style="padding: 32px 24px;">
    <div style="border: 2px solid #c9a84c; border-radius: 16px; padding: 24px; background: #faf8f2;">
      <h2 style="color: #0a0f1e; font-size: 19px; margin: 0 0 18px 0; text-align: center;">🤖 لقاء الذكاء الاصطناعي</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 10px 12px; font-weight: bold; color: #64748b; width: 100px;">📅 التاريخ</td><td style="padding: 10px 12px; color: #0a0f1e; font-weight: bold;">الجمعة 18 سبتمبر 2026</td></tr>
        <tr><td style="padding: 10px 12px; font-weight: bold; color: #64748b;">🕐 الوقت</td><td style="padding: 10px 12px; color: #0a0f1e; font-weight: bold;">بعد صلاة الجمعة</td></tr>
        <tr><td style="padding: 10px 12px; font-weight: bold; color: #64748b;">📍 المكان</td><td style="padding: 10px 12px; color: #0a0f1e; font-weight: bold;"><a href="https://maps.app.goo.gl/hH2bhED852UMbL6Y9" style="color: #0a0f1e; text-decoration: underline;">فندق هوليداي فيلا حائل</a></td></tr>
        <tr><td style="padding: 10px 12px; font-weight: bold; color: #64748b;">🎤 المقدم</td><td style="padding: 10px 12px; color: #c9a84c; font-weight: bold;">المهندس أحمد يونس — الرئيس التنفيذي للتقنية في مرفأ</td></tr>
      </table>
    </div>
    <div style="margin-top: 28px; text-align: center;">
      <p style="color: #0a0f1e; font-weight: bold; font-size: 15px; margin: 0 0 8px 0;">ننتظر حضوركم 🌟</p>
    </div>
    <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #c9a84c44; text-align: center;">
      <p style="color: #64748b; font-size: 12px; margin: 0 0 4px 0;">📍 <a href="https://maps.app.goo.gl/hH2bhED852UMbL6Y9" style="color: #64748b; text-decoration: underline;">فندق هوليداي فيلا حائل</a> — بعد صلاة الجمعة</p>
      <p style="color: #64748b; font-size: 11px; margin: 0;">www.marfa.sa &nbsp;|&nbsp; منصة مرفأ الاستثمارية &nbsp;|&nbsp; حائل 🇸🇦</p>
    </div>
  </div>
</div>
</body></html>`;

async function main() {
  const { data: subscribers, error: fetchErr } = await supabase
    .from('meeting_subscribers')
    .select('email')
    .order('subscribed_at', { ascending: true });

  if (fetchErr || !subscribers || subscribers.length === 0) {
    console.error('❌ No subscribers found:', fetchErr?.message || 'empty');
    process.exit(1);
  }

  console.log('📬 Subscribers:', subscribers.length);

  const emails = subscribers.map((s) => ({
    from: 'Marfa Meetings <noreply@marfa.sa>',
    to: s.email,
    subject: '🔔 تذكير: لقاء الذكاء الاصطناعي — الجمعة 18 سبتمبر 2026',
    html,
  }));

  const { sent, failed, failures } = await sendBatch(resend, emails);
  const failedSet = new Map(failures.map((f) => [f.index, f.message]));

  console.log(`✅ Sent: ${sent} | ❌ Failed: ${failed}`);

  const failedRecipients = subscribers
    .map((s, i) => (failedSet.has(i) ? { email: s.email, error: failedSet.get(i) } : null))
    .filter(Boolean);

  // Admin report
  await resend.emails.send({
    from: 'Marfa Meetings <noreply@marfa.sa>',
    to: 'op.younis@gmail.com',
    subject: `📋 تقرير إرسال — لقاء الذكاء الاصطناعي (${sent}/${subscribers.length})`,
    html: `<div style="font-family: sans-serif; padding: 20px;"><h2>تقرير إرسال لقاء الذكاء الاصطناعي</h2><p>أُرسل ${sent} من ${subscribers.length}.</p><pre>${JSON.stringify(failedRecipients, null, 2)}</pre></div>`,
  }).catch(() => {});

  if (failedRecipients.length > 0) {
    console.error('❌ Failed recipients:', JSON.stringify(failedRecipients, null, 2));
  }
}

main().catch((e) => {
  console.error('❌ Error:', e);
  process.exit(1);
});
