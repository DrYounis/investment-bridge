import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';

export const dynamic = 'force-dynamic';
const TEMP_TOKEN = 'analytics-july25-z9x5';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('token') !== TEMP_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const svc = createServiceClient();

    // ── Date ranges ──
    const now = new Date();
    const since = new Date(now.getTime() - 7 * 86400000).toISOString();
    const prevSince = new Date(now.getTime() - 14 * 86400000).toISOString();
    const prevUntil = since;

    // ── 1. Page views ──
    const { data: allViews } = await svc
      .from('page_views')
      .select('path,referrer,country,device,visitor_hash,user_hash,utm_source,created_at')
      .gte('created_at', prevSince)
      .order('created_at', { ascending: false });

    const views = allViews || [];
    const current = views.filter(r => r.created_at >= since);
    const previous = views.filter(r => r.created_at >= prevSince && r.created_at < prevUntil);

    const totalViews = current.length;
    const uniqueVisitors = new Set(current.map(r => r.visitor_hash)).size;
    const prevTotalViews = previous.length;
    const prevUniqueVisitors = new Set(previous.map(r => r.visitor_hash)).size;

    const viewChange = prevTotalViews ? Math.round((totalViews - prevTotalViews) / prevTotalViews * 100) : null;
    const visitorChange = prevUniqueVisitors ? Math.round((uniqueVisitors - prevUniqueVisitors) / prevUniqueVisitors * 100) : null;

    // Top pages
    const pageMap = new Map<string, number>();
    for (const r of current) {
      pageMap.set(r.path, (pageMap.get(r.path) || 0) + 1);
    }
    const topPages = [...pageMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([path, views]) => ({ path, views }));

    // Auth split
    let authTotal = 0, anonTotal = 0;
    for (const r of current) {
      r.user_hash ? authTotal++ : anonTotal++;
    }

    // Top referrers
    const refMap = new Map<string, number>();
    for (const r of current) {
      const ref = r.referrer ? new URL(r.referrer).hostname : 'direct';
      refMap.set(ref, (refMap.get(ref) || 0) + 1);
    }
    const topReferrers = [...refMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([domain, views]) => ({ domain, views }));

    // UTM
    const utmMap = new Map<string, number>();
    for (const r of current) {
      if (r.utm_source) utmMap.set(r.utm_source, (utmMap.get(r.utm_source) || 0) + 1);
    }
    const topUtm = [...utmMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

    // Countries
    const countryMap = new Map<string, number>();
    for (const r of current) {
      if (r.country) countryMap.set(r.country, (countryMap.get(r.country) || 0) + 1);
    }
    const topCountries = [...countryMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

    // ── 2. Quiz answers (Meeting 6: Shark Tank) ──
    const { data: quizAnswers } = await svc
      .from('majlis_quiz_answers')
      .select('meeting_number, score, created_at')
      .gte('created_at', since)
      .order('created_at', { ascending: false });

    const meeting6Answers = (quizAnswers || []).filter(a => a.meeting_number === 6);
    const meeting6Graded = meeting6Answers.filter(a => a.score !== null);
    const meeting6AvgScore = meeting6Graded.length
      ? (meeting6Graded.reduce((s, a) => s + (a.score || 0), 0) / meeting6Graded.length).toFixed(1)
      : null;

    // All meeting answers this week
    const answersByMeeting: Record<number, number> = {};
    for (const a of (quizAnswers || [])) {
      answersByMeeting[a.meeting_number] = (answersByMeeting[a.meeting_number] || 0) + 1;
    }

    // ── 3. New registrations ──
    const { data: newProfiles } = await svc
      .from('profiles')
      .select('email, created_at')
      .gte('created_at', since)
      .order('created_at', { ascending: false });

    // ── 4. New subscribers ──
    const { data: newSubs } = await svc
      .from('meeting_subscribers')
      .select('email, subscribed_at')
      .gte('subscribed_at', since)
      .order('subscribed_at', { ascending: false });

    // ── 5. Total counts ──
    const { count: totalSubs } = await svc.from('meeting_subscribers').select('*', { count: 'exact', head: true });
    const { count: totalProfiles } = await svc.from('profiles').select('*', { count: 'exact', head: true });

    // ── 6. Daily breakdown (last 7 days) ──
    const dailyMap: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000).toISOString().split('T')[0];
      dailyMap[d] = 0;
    }
    for (const r of current) {
      const d = r.created_at.split('T')[0];
      if (dailyMap[d] !== undefined) dailyMap[d]++;
    }

    return NextResponse.json({
      period: { since, until: new Date().toISOString() },
      pageViews: {
        total: totalViews,
        uniqueVisitors,
        prevTotalViews,
        prevUniqueVisitors,
        viewChangePct: viewChange,
        visitorChangePct: visitorChange,
        authVsAnon: { authenticated: authTotal, anonymous: anonTotal, authPct: totalViews ? Math.round(authTotal / totalViews * 100) : 0 },
        topPages,
        topReferrers,
        topUtmSources: topUtm.map(([k, v]) => ({ source: k, views: v })),
        topCountries: topCountries.map(([k, v]) => ({ country: k, views: v })),
        dailyBreakdown: Object.entries(dailyMap).map(([date, views]) => ({ date, views })),
      },
      quiz: {
        meeting6Submissions: meeting6Answers.length,
        meeting6Graded: meeting6Graded.length,
        meeting6AvgScore,
        allMeetingsThisWeek: Object.entries(answersByMeeting).map(([meeting, count]) => ({ meeting: Number(meeting), submissions: count })),
      },
      users: {
        newRegistrations: (newProfiles || []).length,
        totalRegistrations: totalProfiles || 0,
        newSubscribers: (newSubs || []).length,
        totalSubscribers: totalSubs || 0,
      },
    });
  } catch (err: unknown) {
    console.error('[analytics-snapshot]', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
