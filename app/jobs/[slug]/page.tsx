import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getCachedJobBySlug, type Job } from '@/lib/jobs';
import JobRegistrationCTA from '@/app/components/marfa/JobRegistrationCTA';

// ── Helpers ────────────────────────────────────────────────────────────────

function relativeTimeArabic(iso: string): string {
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

function formatSalary(min: number, max: number, period: string | null): string {
  const fmt = (n: number) => n.toLocaleString('ar-SA');
  const per = period === 'yearly' ? 'سنوياً' : period === 'monthly' ? 'شهرياً' : period || '';
  return `${fmt(min)} – ${fmt(max)} ${per ? `ريال ${per}` : ''}`.trim();
}

function buildJsonLd(job: Job): Record<string, unknown> {
  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.titleAr || job.title,
    description: job.description || job.title,
    datePosted: job.postedAt || undefined,
    hiringOrganization: { '@type': 'Organization', name: job.company },
    jobLocation: {
      '@type': 'Place',
      address: { '@type': 'PostalAddress', addressLocality: job.city, addressCountry: 'SA' },
    },
    directApply: false,
  };
  if (job.employmentType) {
    ld.employmentType = job.employmentType;
  }
  return ld;
}

// ── Metadata ───────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const job = await getCachedJobBySlug(supabase, slug);
  if (!job) return { title: 'الوظيفة غير متاحة | مرفأ' };
  const desc = (job.description || '').slice(0, 155);
  return {
    title: `${job.title} — ${job.company} | مرفأ`,
    description: desc,
  };
}

// ── Page ───────────────────────────────────────────────────────────────────

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const job = await getCachedJobBySlug(supabase, slug);
  if (!job) notFound();

  const postedTime = job.postedAt ? relativeTimeArabic(job.postedAt) : null;
  const hasSalary = job.salaryMin != null && job.salaryMax != null;

  return (
    <div className="min-h-screen bg-[#faf8f2]" dir="rtl">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildJsonLd(job)).replace(/</g, '\\u003c'),
        }}
      />

      {/* Compact navy hero */}
      <section className="bg-[#0a0f1e] pt-28 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/jobs"
            className="inline-block text-sm text-[#64748b] hover:text-[#c9a84c] mb-6 transition-colors"
            style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
          >
            ← جميع الوظائف
          </Link>

          {job.titleAr ? (
            <>
              <h1
                className="text-3xl md:text-4xl font-black text-[#c9a84c] mb-2"
                style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
              >
                {job.titleAr}
              </h1>
              <p className="text-lg text-[#a0aec0] mb-4" dir="ltr">
                {job.title}
              </p>
            </>
          ) : (
            <h1
              className="text-3xl md:text-4xl font-black text-[#c9a84c] mb-4"
              style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
            >
              {job.title}
            </h1>
          )}

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="text-[#a0aec0]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
              {job.company} · {job.city}
            </span>
            {postedTime && (
              <span className="text-[#64748b]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                {postedTime}
              </span>
            )}
          </div>

          {/* Pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {job.employmentType && (
              <span className="text-xs px-3 py-1 rounded-full bg-[#fdf9ef] text-[#c9a84c] font-bold border border-[#c9a84c]/20">
                {job.employmentType}
              </span>
            )}
            {job.isRemote && (
              <span className="text-xs px-3 py-1 rounded-full bg-[#e8f3fc] text-[#0a66c2] font-bold">
                عن بُعد
              </span>
            )}
            {hasSalary && (
              <span className="text-xs px-3 py-1 rounded-full bg-[#fdf9ef] text-[#c9a84c] font-bold border border-[#c9a84c]/20">
                {formatSalary(job.salaryMin!, job.salaryMax!, job.salaryPeriod)}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        {/* Description */}
        {job.description && (
          <div className="bg-white rounded-3xl border border-[#c9a84c]/20 shadow-[0_8px_30px_rgba(10,15,30,0.06)] p-8 mb-8">
            <h2 className="text-xl font-bold text-[#0a0f1e] mb-4" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
              الوصف الوظيفي
            </h2>
            <p className="whitespace-pre-line leading-relaxed text-[#4a5b78]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
              {job.description}
            </p>
          </div>
        )}

        {/* Registration CTA for anonymous visitors */}
        <div className="max-w-md mx-auto mb-8">
          <JobRegistrationCTA />
        </div>

        {/* Apply CTA */}
        <div className="sticky bottom-6">
          <a
            href={job.applyLink}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="block w-full max-w-md mx-auto text-center px-6 py-4 rounded-2xl bg-gradient-to-r from-[#c9a84c] to-[#d4a843] text-[#0a0f1e] text-lg font-bold hover:shadow-xl hover:shadow-[#c9a84c]/30 transition-all duration-300"
            style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
          >
            قدّم الآن {job.isLinkedIn ? 'عبر LinkedIn' : `عبر ${job.publisher || 'الموقع الخارجي'}`} ←
          </a>
        </div>
      </div>
    </div>
  );
}
