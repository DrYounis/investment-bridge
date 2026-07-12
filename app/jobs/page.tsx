import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getCachedJobs } from '@/lib/jobs';
import JobsClient from './JobsClient';

export const metadata: Metadata = {
  title: 'الوظائف | مرفأ',
  description: 'فرص وظيفية محدّثة من كبرى المنصات في السعودية — قدّم مباشرة عبر LinkedIn',
};

function lastUpdateArabic(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffHours = Math.floor(diffMs / 3600000);
  if (diffHours < 1) return 'منذ أقل من ساعة';
  if (diffHours < 2) return 'منذ ساعة';
  if (diffHours < 24) return `منذ ${diffHours} ساعة`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'منذ يوم';
  if (diffDays === 2) return 'منذ يومين';
  if (diffDays <= 10) return `منذ ${diffDays} أيام`;
  return `منذ ${diffDays} يوماً`;
}

export default async function JobsPage() {
  const supabase = await createClient();
  const { jobs, fetchedAt } = await getCachedJobs(supabase).catch((err) => {
    console.error('JOBS_PAGE_FETCH_FAIL', err instanceof Error ? err.message : 'unknown');
    return { jobs: [] as import('@/lib/jobs').Job[], fetchedAt: null };
  });

  return (
    <div className="min-h-screen bg-[#faf8f2]" dir="rtl">
      {/* Hero */}
      <section className="bg-[#0a0f1e] pt-32 pb-20 px-6 text-center">
        <h1
          className="text-4xl md:text-5xl font-black text-[#c9a84c] mb-4"
          style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
        >
          وظائف في السعودية
        </h1>
        <p
          className="text-[#a0aec0] max-w-2xl mx-auto text-lg leading-relaxed"
          style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
        >
          فرص وظيفية محدّثة من كبرى المنصات — قدّم مباشرة عبر LinkedIn
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
        {fetchedAt && (
          <p
            className="text-center text-sm text-[#64748b] mb-6"
            style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
          >
            آخر تحديث: {lastUpdateArabic(fetchedAt)}
          </p>
        )}
        <JobsClient jobs={jobs} />
      </div>
    </div>
  );
}
