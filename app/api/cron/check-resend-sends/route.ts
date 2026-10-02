import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const maxDuration = 60;

// One-shot temp token — this route is removed immediately after use.
const TEMP_TOKEN = 'c4f0a3e5-8b2d-4f7a-9d1e-6c9b3a5f2e94';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('token') !== TEMP_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.list({ limit: 100 });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const emails = data?.data ?? [];

    const bySubject: Record<string, number> = {};
    for (const e of emails) {
      bySubject[e.subject] = (bySubject[e.subject] || 0) + 1;
    }

    const rows = emails.map((e) => ({
      to: e.to.join(', '),
      subject: e.subject,
      created_at: e.created_at,
      last_event: e.last_event,
    }));

    return NextResponse.json({ total: emails.length, bySubject, rows });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
