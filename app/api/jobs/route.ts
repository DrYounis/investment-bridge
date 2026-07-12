import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, getClientIP, isValidOrigin } from '@/lib/rate-limit';
import { fetchSaudiJobs } from '@/lib/jobs';

export const dynamic = 'force-dynamic';

const RATE_LIMIT = { maxRequests: 20, windowMs: 60_000 };

const QuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(3).default(1),
});

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

  const url = new URL(req.url);
  const pageStr = url.searchParams.get('page') || '1';
  const parsed = QuerySchema.safeParse({ page: pageStr });
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid page parameter' }, { status: 400 });
  }

  if (!process.env.JSEARCH_API_KEY) {
    return NextResponse.json({ error: 'service_unavailable' }, { status: 503 });
  }

  try {
    const jobs = await fetchSaudiJobs(parsed.data.page);
    return NextResponse.json({ jobs });
  } catch (err) {
    console.error('JSEARCH_FETCH_FAIL', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Upstream service unavailable' }, { status: 502 });
  }
}
