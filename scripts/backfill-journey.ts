// Backfill user_journey_analysis for the current week.
// Uses the SAME scoring logic as the weekly cron via lib/analytics/journey
// (no reimplementation). Run with: npx --yes tsx scripts/backfill-journey.ts
//
// Unlike the cron, this does NOT send email or call any AI model. It only
// persists per-user journeys + aggregated recommendations, exactly as the
// cron's step 9 would.

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'node:path';
import {
  PageView,
  QuizAnswer,
  UserJourney,
  computeEngagementScore,
  classifySegment,
  computeChurnRisk,
  recommendAction,
  generateAggregatedInsights,
  hashId,
} from '../lib/analytics/journey';

config({ path: resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const svc = createClient(SUPABASE_URL, SUPABASE_KEY);

// Match the cron's UTC week boundary (Monday of the current week, UTC).
function getUtcWeekStart(): string {
  const now = new Date();
  const day = now.getUTCDay();
  const diff = now.getUTCDate() - day + (day === 0 ? -6 : 1);
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), diff))
    .toISOString()
    .split('T')[0];
}

async function main() {
  const weekStart = getUtcWeekStart();
  const since = new Date(weekStart).toISOString();
  const prevWeekStart = new Date(new Date(weekStart).getTime() - 7 * 86400000)
    .toISOString()
    .split('T')[0];
  const prevSince = new Date(prevWeekStart).toISOString();

  console.log(`Backfilling week ${weekStart} (prev: ${prevWeekStart})`);

  const { data: thisWeekViews } = await svc
    .from('page_views')
    .select('visitor_hash, user_hash, path, country, referrer, device, utm_source, event_name, variant, is_likely_bot, created_at')
    .gte('created_at', since)
    .order('created_at', { ascending: true });

  const { data: lastWeekViews } = await svc
    .from('page_views')
    .select('visitor_hash, user_hash, path, country, referrer, device, utm_source, event_name, variant, is_likely_bot, created_at')
    .gte('created_at', prevSince)
    .lt('created_at', since)
    .order('created_at', { ascending: true });

  const { data: quizAnswers } = await svc
    .from('majlis_quiz_answers')
    .select('user_id, meeting_number, score, created_at')
    .gte('created_at', since);

  const { data: profiles } = await svc.from('profiles').select('id, email');

  const profileMap = new Map<string, string>();
  if (profiles) {
    for (const p of profiles) profileMap.set(hashId(p.id), (p.email || '').trim().toLowerCase());
  }

  const views = (thisWeekViews || []) as PageView[];
  const prevViews = (lastWeekViews || []) as PageView[];
  const quizzes = (quizAnswers || []) as QuizAnswer[];

  const userMap = new Map<string, PageView[]>();
  for (const v of views) {
    const key = v.user_hash || v.visitor_hash;
    const arr = userMap.get(key) || [];
    arr.push(v);
    userMap.set(key, arr);
  }

  const prevUserMap = new Map<string, PageView[]>();
  for (const v of prevViews) {
    const key = v.user_hash || v.visitor_hash;
    const arr = prevUserMap.get(key) || [];
    arr.push(v);
    prevUserMap.set(key, arr);
  }

  const quizByUser = new Map<string, QuizAnswer[]>();
  for (const q of quizzes) {
    const key = hashId(q.user_id);
    const arr = quizByUser.get(key) || [];
    arr.push(q);
    quizByUser.set(key, arr);
  }

  const journeys: UserJourney[] = [];

  for (const [userId, userViews] of userMap) {
    const paths = new Map<string, number>();
    const days = new Set<string>();
    let firstVisit = userViews[0].created_at;
    let lastVisit = userViews[0].created_at;

    for (const v of userViews) {
      paths.set(v.path, (paths.get(v.path) || 0) + 1);
      days.add(v.created_at.split('T')[0]);
      if (v.created_at < firstVisit) firstVisit = v.created_at;
      if (v.created_at > lastVisit) lastVisit = v.created_at;
    }

    const pagesVisited = Array.from(paths.entries()).map(([path, count]) => ({ path, count }));
    const isRegistered = !!userViews[0].user_hash;
    const email = isRegistered ? profileMap.get(userId) || null : null;
    const userQuiz = isRegistered ? quizByUser.get(userId) : undefined;
    const quizMeeting = userQuiz?.[0]?.meeting_number || null;
    const quizScore = userQuiz?.[0]?.score || null;
    const prevUserViews = prevUserMap.get(userId) || [];

    const journey: Omit<UserJourney, 'engagementScore' | 'churnRisk' | 'behaviorSegment' | 'recommendedAction'> = {
      userId,
      email,
      isRegistered,
      totalVisits: userViews.length,
      pagesVisited,
      daysActive: days.size,
      firstVisit,
      lastVisit,
      quizMeeting,
      quizScore,
    };

    const engagementScore = computeEngagementScore(journey);
    const churnRisk = computeChurnRisk({ ...journey, engagementScore, churnRisk: '', behaviorSegment: '', recommendedAction: '' }, prevUserViews.length);
    const behaviorSegment = classifySegment({ ...journey, engagementScore, churnRisk }, prevUserViews.length);

    const fullJourney: UserJourney = {
      ...journey,
      engagementScore,
      churnRisk,
      behaviorSegment,
      recommendedAction: '',
    };
    fullJourney.recommendedAction = recommendAction(fullJourney);

    journeys.push(fullJourney);
  }

  journeys.sort((a, b) => b.engagementScore - a.engagementScore);
  const insights = generateAggregatedInsights(journeys);

  let ok = 0;
  let failed = 0;
  for (const j of journeys) {
    const { error } = await svc.from('user_journey_analysis').upsert({
      user_id: j.userId,
      email: j.email,
      is_registered: j.isRegistered,
      week_start: weekStart,
      total_visits: j.totalVisits,
      pages_visited: j.pagesVisited,
      days_active: j.daysActive,
      first_visit: j.firstVisit,
      last_visit: j.lastVisit,
      quiz_meeting: j.quizMeeting,
      quiz_score: j.quizScore,
      engagement_score: j.engagementScore,
      churn_risk: j.churnRisk,
      behavior_segment: j.behaviorSegment,
      recommended_action: j.recommendedAction,
      insights_json: { aggregated_recommendations: insights },
    }, { onConflict: 'user_id, week_start' });

    if (error) {
      failed++;
      console.error(`  ✗ upsert failed for ${j.userId}: ${error.message}`);
    } else {
      ok++;
    }
  }

  console.log(`\nDone. ${ok} upserted, ${failed} failed. Insights: ${insights.length}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
