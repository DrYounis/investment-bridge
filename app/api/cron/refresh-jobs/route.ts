import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { fetchSaudiJobs, consumeQuota } from '@/lib/jobs';

function isCronAuthorized(request: Request): boolean {
  if (request.headers.get('x-vercel-cron')) return true;
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return false;
  const url = new URL(request.url);
  if (url.searchParams.get('token') === cronSecret) return true;
  const authHeader = request.headers.get('authorization');
  if (authHeader === `Bearer ${cronSecret}`) return true;
  return false;
}

export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createServiceClient();

    // Check daily quota — allow up to 2 calls for this refresh
    const quota = await consumeQuota(supabase, 2);
    if (!quota.allowed) {
      return NextResponse.json(
        { error: 'daily_quota_exhausted', used: quota.used },
        { status: 429 }
      );
    }

    let callsUsed = 0;

    // Page 1
    const page1 = await fetchSaudiJobs();
    callsUsed++;
    const allJobs = [...page1];

    // If we got results and a cursor, fetch one more page
    // fetchSaudiJobs doesn't expose the cursor directly, so we do a fresh fetch
    // with the cursor from the raw response — but since fetchSaudiJobs abstracts
    // the cursor away, we cap at 1 call for now (the function handles cursor
    // internally when called with the cursor param, but we don't have access
    // to it from the public API).
    //
    // We call fetchSaudiJobs once more without a cursor to get a fresh batch;
    // the API returns different results each time for the same query.
    if (page1.length > 0 && callsUsed < 2) {
      const page2 = await fetchSaudiJobs();
      callsUsed++;
      allJobs.push(...page2);
    }

    // Dedupe by job id
    const seen = new Set<string>();
    const unique = allJobs.filter((j) => {
      if (seen.has(j.id)) return false;
      seen.add(j.id);
      return true;
    });

    // Store in cache
    await supabase.from('marfa_jobs_cache').insert({
      payload: unique,
      fetched_at: new Date().toISOString(),
      api_calls_used: callsUsed,
    });

    // Delete rows older than 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();
    await supabase
      .from('marfa_jobs_cache')
      .delete()
      .lt('fetched_at', sevenDaysAgo);

    console.log('JOBS_REFRESH', {
      count: unique.length,
      callsUsed,
      quotaToday: quota.used,
    });

    return NextResponse.json({ refreshed: true, count: unique.length });
  } catch (err: unknown) {
    console.error(
      'JOBS_REFRESH_FAIL',
      err instanceof Error ? err.message : err
    );
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
