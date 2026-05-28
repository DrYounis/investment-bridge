import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const status: Record<string, unknown> = {
    status: 'ok',
    timestamp: new Date().toISOString(),
  };

  // Check Supabase connectivity — minimal check, no data exposure
  try {
    const supabase = await createClient();
    const start = Date.now();
    const { error } = await supabase.from('profiles').select('id').limit(1);
    const latency = Date.now() - start;

    status.db = error
      ? { status: 'error' }
      : { status: 'ok', latency_ms: latency };
  } catch {
    status.db = { status: 'error' };
  }

  const overallStatus = status.db && (status.db as Record<string, unknown>).status === 'ok'
    ? 'healthy'
    : 'degraded';

  return NextResponse.json(
    {
      status: overallStatus,
      timestamp: status.timestamp,
    },
    {
      status: overallStatus === 'healthy' ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    }
  );
}
