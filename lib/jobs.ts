// Server-side only — fetches job listings from JSearch (RapidAPI)
// Do NOT import this file in client components

export interface Job {
  id: string;
  title: string;
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

function mapJob(raw: JSearchJob): Job | null {
  const applyLink = raw.job_apply_link;
  if (!applyLink) return null;

  return {
    id: raw.job_id,
    title: raw.job_title,
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
