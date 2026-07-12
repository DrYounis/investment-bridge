// Server-side only — fetches job listings from JSearch (RapidAPI)
// Do NOT import this file in client components

import type { SupabaseClient } from '@supabase/supabase-js';

export interface Job {
  id: string;
  title: string;
  titleAr: string | null;
  company: string;
  city: string;
  postedAt: string;
  applyLink: string;
  employerLogo: string | null;
  isLinkedIn: boolean;
}

interface JSearchJob {
  job_id: string;
  job_title: string;
  employer_name: string;
  job_city: string | null;
  job_location: string | null;
  job_posted_at_datetime_utc: string | null;
  job_posted_at: string | null;
  job_apply_link: string;
  employer_logo: string | null;
}

interface JSearchV2Response {
  status: string;
  data: {
    jobs: JSearchJob[];
    cursor: string;
  };
}

/** Parse city from job_location when job_city is null (v2 embeds it). */
function extractCity(raw: JSearchJob): string {
  if (raw.job_city) return raw.job_city;
  if (!raw.job_location) return 'السعودية';
  const parts = raw.job_location.split('•');
  const candidate = (parts[0] ?? '').trim();
  return candidate || 'السعودية';
}

function sanitizeTitle(raw: string): string {
  let t = raw
    // Remove literal "null" word (any case) — garbage from some JSearch entries
    .replace(/\bnull\b/gi, '')
    // Collapse repeated whitespace
    .replace(/\s+/g, ' ')
    .trim();

  // Remove "الراتب ... ريال ... شهرياً" segments that lose meaning after null stripping
  // Matches: " - الراتب ريال null شهرياً" or "الراتب null ريال شهرياً"
  t = t.replace(
    /\s*[-–—]?\s*الراتب\s*.{0,20}?\s*شهرياً/gi,
    ''
  ).trim();

  return t;
}

function mapJob(raw: JSearchJob): Job | null {
  const applyLink = raw.job_apply_link;
  if (!applyLink) return null;

  return {
    id: raw.job_id,
    title: sanitizeTitle(raw.job_title),
    titleAr: null, // populated later by translateTitles()
    company: raw.employer_name,
    city: extractCity(raw),
    postedAt: raw.job_posted_at_datetime_utc || raw.job_posted_at || '',
    applyLink,
    employerLogo: raw.employer_logo || null,
    isLinkedIn: applyLink.includes('linkedin.com'),
  };
}

export async function fetchSaudiJobs(cursor?: string): Promise<Job[]> {
  const apiKey = process.env.JSEARCH_API_KEY;
  if (!apiKey) {
    throw new Error('JSEARCH_API_KEY is not configured');
  }

  const url = new URL('https://jsearch.p.rapidapi.com/search-v2');
  url.searchParams.set('query', 'jobs in Saudi Arabia');
  url.searchParams.set('country', 'sa');
  url.searchParams.set('date_posted', 'month');
  if (cursor) {
    url.searchParams.set('cursor', cursor);
  }

  const res = await fetch(url.toString(), {
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
    },
    next: { revalidate: 21600 },
  });

  if (!res.ok) {
    throw new Error(`JSearch API returned ${res.status}`);
  }

  const json: unknown = await res.json();

  // Guard against non-standard error payloads where data.jobs is missing
  const typed = json as JSearchV2Response;
  const data = typed.data;
  if (!data || !Array.isArray(data.jobs)) {
    console.error('JSEARCH_BAD_PAYLOAD', {
      httpStatus: res.status,
      apiStatus: typed.status ?? 'missing',
    });
    return [];
  }

  const jobs = data.jobs.map(mapJob).filter((j): j is Job => j !== null);

  console.log('JSEARCH_FETCH', { status: res.status, count: jobs.length });
  return jobs;
}

// ── Translation ────────────────────────────────────────────────────────────

function hasArabic(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

export async function translateTitles(jobs: Job[]): Promise<Job[]> {
  // Only translate titles without Arabic already present
  const toTranslate = jobs.filter((j) => !hasArabic(j.title));
  if (toTranslate.length === 0) return jobs;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn('JOBS_TRANSLATE_SKIP: ANTHROPIC_API_KEY not set');
    return jobs;
  }

  try {
    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    const client = new Anthropic({ apiKey });

    const titles = toTranslate.map((j) => j.title);
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content:
            'You translate job titles from English to Modern Standard Arabic for a Saudi jobs board. Keep company names, certifications, and acronyms (IT, CAT III, ESS, HR, CEO...) in Latin as-is. Respond ONLY with a JSON array of strings in the same order as the input, no markdown, no preamble.\n\n' +
            JSON.stringify(titles),
        },
      ],
    });

    const raw = msg.content
      .filter((block) => block.type === 'text')
      .map((block) => (block.type === 'text' ? block.text : ''))
      .join('')
      .trim();

    // Strip markdown fences if present
    const json = raw.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');

    const translations: string[] = JSON.parse(json);

    if (!Array.isArray(translations) || translations.length !== toTranslate.length) {
      throw new Error(`Mismatch: expected ${toTranslate.length}, got ${translations?.length ?? 'non-array'}`);
    }

    // Map translations back by index
    const translatedSet = new Set(toTranslate.map((j) => j.id));
    for (const job of jobs) {
      if (!translatedSet.has(job.id)) continue;
      const idx = toTranslate.findIndex((t) => t.id === job.id);
      if (idx >= 0) job.titleAr = translations[idx];
    }
  } catch (err) {
    console.error('JOBS_TRANSLATE_FAIL', err instanceof Error ? err.message : err);
    // Never throw — translation failure must not break the refresh
  }

  return jobs;
}

// ── Quota + cache (Supabase-backed) ────────────────────────────────────────

/**
 * Check and consume daily API quota. Upserts today's row in marfa_jobs_quota.
 * Returns { allowed: false, used } if adding n would exceed the daily cap (6).
 */
export async function consumeQuota(
  supabaseAdmin: SupabaseClient,
  n: number
): Promise<{ allowed: boolean; used: number }> {
  const today = new Date().toISOString().split('T')[0];

  const { data: current } = await supabaseAdmin
    .from('marfa_jobs_quota')
    .select('calls')
    .eq('day', today)
    .maybeSingle();

  const currentCalls = current?.calls ?? 0;
  const newTotal = currentCalls + n;

  if (newTotal > 6) {
    return { allowed: false, used: currentCalls };
  }

  await supabaseAdmin
    .from('marfa_jobs_quota')
    .upsert({ day: today, calls: newTotal }, { onConflict: 'day' });

  return { allowed: true, used: newTotal };
}

/**
 * Read the most recent cached jobs from Supabase.
 * Returns { jobs: [], fetchedAt: null } when the cache is empty.
 */
export async function getCachedJobs(supabase: SupabaseClient): Promise<{
  jobs: Job[];
  fetchedAt: string | null;
}> {
  const { data } = await supabase
    .from('marfa_jobs_cache')
    .select('payload, fetched_at')
    .order('fetched_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return { jobs: [], fetchedAt: null };

  return {
    jobs: (data.payload as Job[]) || [],
    fetchedAt: data.fetched_at,
  };
}
