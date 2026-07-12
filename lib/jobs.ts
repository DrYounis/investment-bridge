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
  job_posted_at_datetime_utc: string;
  job_apply_link: string;
  employer_logo: string | null;
}

interface JSearchResponse {
  status: string;
  data: JSearchJob[];
}

function mapJob(raw: JSearchJob): Job | null {
  const applyLink = raw.job_apply_link;
  if (!applyLink) return null;

  return {
    id: raw.job_id,
    title: raw.job_title,
    company: raw.employer_name,
    city: raw.job_city || raw.job_location || 'السعودية',
    postedAt: raw.job_posted_at_datetime_utc,
    applyLink,
    employerLogo: raw.employer_logo || null,
    isLinkedIn: applyLink.includes('linkedin.com'),
  };
}

export async function fetchSaudiJobs(page = 1): Promise<Job[]> {
  const apiKey = process.env.JSEARCH_API_KEY;
  if (!apiKey) {
    throw new Error('JSEARCH_API_KEY is not configured');
  }

  const url = new URL('https://jsearch.p.rapidapi.com/search');
  url.searchParams.set('query', 'jobs in Saudi Arabia');
  url.searchParams.set('page', String(page));
  url.searchParams.set('num_pages', '1');
  url.searchParams.set('country', 'sa');
  url.searchParams.set('date_posted', 'week');

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

  const json: JSearchResponse = await res.json();
  const jobs = json.data.map(mapJob).filter((j): j is Job => j !== null);
  return jobs;
}
