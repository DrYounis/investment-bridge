import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { rateLimit, getClientIP, isValidOrigin } from '@/lib/rate-limit';
import { getCachedJobs } from '@/lib/jobs';

export const dynamic = 'force-dynamic';

const RATE_LIMIT = { maxRequests: 20, windowMs: 60_000 };

export async function GET(req: NextRequest): Promise<NextResponse> {
  if (!isValidOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const ip = getClientIP(req);
  const limit = rateLimit(ip, RATE_LIMIT);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((limit.resetAt - Date.now()) / 1000)),
          'X-RateLimit-Remaining': String(limit.remaining),
        },
      }
    );
  }

  try {
    const supabase = await createClient();
    const { jobs } = await getCachedJobs(supabase);
    return NextResponse.json({ jobs });
  } catch (err) {
    console.error('JOBS_API_FAIL', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}
