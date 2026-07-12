import type { Metadata } from 'next';
import { fetchSaudiJobs } from '@/lib/jobs';
import JobsClient from './JobsClient';

export const metadata: Metadata = {
  title: 'الوظائف | مرفأ',
  description: 'فرص وظيفية محدّثة من كبرى المنصات في السعودية — قدّم مباشرة عبر LinkedIn',
};

export default async function JobsPage() {
  const jobs = await fetchSaudiJobs().catch(() => []);

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
        <JobsClient jobs={jobs} />
      </div>
    </div>
  );
}
