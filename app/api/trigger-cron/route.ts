import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json({ error: 'CRON_SECRET not set' }, { status: 500 });
  }

  const res = await fetch('https://www.marfa.sa/api/cron/weekly-meeting-notification', {
    headers: { Authorization: `Bearer ${cronSecret}` },
  });

  const body = await res.json();
  return NextResponse.json({ status: res.status, body });
}
