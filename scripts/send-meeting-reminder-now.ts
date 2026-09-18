/**
 * One-off: send the upcoming-Friday meeting reminder NOW to the admin email only (test).
 * Usage: npx tsx scripts/send-meeting-reminder-now.ts
 */
import { config } from 'dotenv';
import { resolve } from 'node:path';
import { Resend } from 'resend';
import { getUpcomingFriday, buildEmailHTML } from '@/app/api/cron/weekly-meeting-notification/route';
import { getLatestArticlesForEmail } from '@/lib/supabase/financial-news';

config({ path: resolve(process.cwd(), '.env.local') });

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const TEST_EMAIL = 'op.younis@gmail.com';

if (!RESEND_API_KEY) {
  console.error('Missing RESEND_API_KEY in .env.local');
  process.exit(1);
}

const resend = new Resend(RESEND_API_KEY);
const meeting = getUpcomingFriday();

async function main() {
  let articles: Awaited<ReturnType<typeof getLatestArticlesForEmail>> = [];
  try {
    articles = await getLatestArticlesForEmail(10);
  } catch {
    articles = [];
  }

  const subject = `🔔 تذكير: لقاء مرفأ ${meeting.meetingNumber} — ${meeting.dateStr} | ${meeting.case}`;
  const html = buildEmailHTML(TEST_EMAIL, 'Younis', false, meeting, articles);

  console.log('📅 Meeting:', meeting.meetingNumber, '|', meeting.dateStr, '|', meeting.case, '|', meeting.topic);
  console.log('📰 Articles:', articles.length);
  console.log('📧 Sending test to:', TEST_EMAIL);

  const r = await resend.emails.send({
    from: 'Marfa Meetings <noreply@marfa.sa>',
    to: TEST_EMAIL,
    subject,
    html,
  });

  if (r.error) {
    console.error('❌ Send failed:', r.error.name, r.error.message);
    process.exit(1);
  }
  console.log('✅ Sent:', r.data?.id);
}

main().catch((e) => {
  console.error('❌ Error:', e);
  process.exit(1);
});
