import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { createClient } from '@/lib/supabase/server';
import { isSuperAdminEmail } from '@/lib/auth/adminEmails';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isSuperAdminEmail(user.email)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') === '30d' ? '30d' : '7d';
  const days = range === '30d' ? 30 : 7;

  try {
    const svc = createServiceClient();
    const since = new Date(Date.now() - days * 86400000).toISOString();
    const prevSince = new Date(Date.now() - days * 2 * 86400000).toISOString();
    const prevUntil = since;

    // Fetch rows for current + previous period
    const { data: rows, error } = await svc
      .from('page_views')
      .select('path,referrer,country,device,visitor_hash,created_at')
      .gte('created_at', prevSince)
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const all = rows || [];

    // Split into current and previous
    const current = all.filter((r) => r.created_at >= since);
    const previous = all.filter((r) => r.created_at >= prevSince && r.created_at < prevUntil);

    // Stats
    const totalViews = current.length;
    const uniqueVisitors = new Set(current.map((r) => r.visitor_hash)).size;
    const prevTotalViews = previous.length;
    const prevUniqueVisitors = new Set(previous.map((r) => r.visitor_hash)).size;

    // Daily breakdown
    const dailyMap: Record<string, { views: number; visitors: Set<string> }> = {};
    for (let i = 0; i < days; i++) {
      const d = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
      dailyMap[d] = { views: 0, visitors: new Set() };
    }
    for (const r of current) {
      const d = r.created_at.split('T')[0];
      if (dailyMap[d]) {
        dailyMap[d].views++;
        dailyMap[d].visitors.add(r.visitor_hash);
      }
    }
    const daily = Object.entries(dailyMap).reverse().map(([date, v]) => ({
      date,
      views: v.views,
      visitors: v.visitors.size,
    }));

    // Aggregation helpers
    const top = <T>(map: Map<string, number>, limit = 10) =>
      [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([k, v]) => ({ key: k, views: v }));

    const pageMap = new Map<string, number>();
    const referrerMap = new Map<string, number>();
    const countryMap = new Map<string, number>();
    const deviceMap = new Map<string, number>();

    for (const r of current) {
      pageMap.set(r.path, (pageMap.get(r.path) || 0) + 1);
      const ref = r.referrer ? new URL(r.referrer).hostname : 'مباشر';
      referrerMap.set(ref, (referrerMap.get(ref) || 0) + 1);
      if (r.country) countryMap.set(r.country, (countryMap.get(r.country) || 0) + 1);
      deviceMap.set(r.device, (deviceMap.get(r.device) || 0) + 1);
    }

    return NextResponse.json({
      totalViews,
      uniqueVisitors,
      prevTotalViews,
      prevUniqueVisitors,
      daily,
      topPages: top(pageMap).map(({ key, views }) => ({ path: key, views })),
      topReferrers: top(referrerMap).map(({ key, views }) => ({ referrer: key, views })),
      countries: top(countryMap).map(({ key, views }) => ({ country: key, views })),
      devices: [...deviceMap.entries()].map(([device, views]) => ({ device, views })),
    });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal error' }, { status: 500 });
  }
}
