import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getCachedJobs, type Job } from '@/lib/jobs';
import JobsClient from './JobsClient';

// ── Manual healthcare insurance / RCM jobs ─────────────────────────────────
// Curated by Dr. Younis — displayed alongside JSearch cache results

const MANUAL_JOBS: Job[] = [
  { id: '4437257832', slug: 'NDQzNzI1NzgzMg', title: 'Medical Insurance Specialist', titleAr: 'أخصائي تأمين صحي', description: 'فرصة في مجال التأمين الصحي', company: 'شركة تأمين', city: 'الرياض', postedAt: '2026-07-25', applyLink: 'https://www.linkedin.com/jobs/view/4437257832/', employerLogo: null, isLinkedIn: true, employmentType: 'دوام كامل', publisher: 'LinkedIn', salaryMin: null, salaryMax: null, salaryPeriod: null, isRemote: false },
  { id: '4442041243', slug: 'NDQ0MjA0MTI0Mw', title: 'Revenue Cycle Manager', titleAr: 'مدير دورة الإيرادات', description: 'فرصة في إدارة دورة الإيرادات بالمستشفيات', company: 'مستشفى', city: 'جدة', postedAt: '2026-07-25', applyLink: 'https://www.linkedin.com/jobs/view/4442041243/', employerLogo: null, isLinkedIn: true, employmentType: 'دوام كامل', publisher: 'LinkedIn', salaryMin: null, salaryMax: null, salaryPeriod: null, isRemote: false },
  { id: '4409950265', slug: 'NDQwOTk1MDI2NQ', title: 'Insurance Claims Officer', titleAr: 'مسؤول مطالبات تأمينية', description: 'فرصة في معالجة مطالبات التأمين الصحي', company: 'شركة تأمين صحي', city: 'الرياض', postedAt: '2026-07-25', applyLink: 'https://www.linkedin.com/jobs/view/4409950265/', employerLogo: null, isLinkedIn: true, employmentType: 'دوام كامل', publisher: 'LinkedIn', salaryMin: null, salaryMax: null, salaryPeriod: null, isRemote: false },
  { id: '4425809800', slug: 'NDQyNTgwOTgwMA', title: 'RCM Analyst', titleAr: 'محلل دورة الإيرادات', description: 'فرصة في تحليل دورة الإيرادات الصحية', company: 'مستشفى', city: 'الدمام', postedAt: '2026-07-25', applyLink: 'https://www.linkedin.com/jobs/view/4425809800/', employerLogo: null, isLinkedIn: true, employmentType: 'دوام كامل', publisher: 'LinkedIn', salaryMin: null, salaryMax: null, salaryPeriod: null, isRemote: false },
  { id: '4431045250', slug: 'NDQzMTA0NTI1MA', title: 'Healthcare Billing Specialist', titleAr: 'أخصائي فوترة صحية', description: 'فرصة في الفوترة الطبية والتأمين', company: 'مستشفى', city: 'الرياض', postedAt: '2026-07-25', applyLink: 'https://www.linkedin.com/jobs/view/4431045250/', employerLogo: null, isLinkedIn: true, employmentType: 'دوام كامل', publisher: 'LinkedIn', salaryMin: null, salaryMax: null, salaryPeriod: null, isRemote: false },
  { id: '4360914285', slug: 'NDM2MDkxNDI4NQ', title: 'Insurance Coordinator', titleAr: 'منسق تأمين صحي', description: 'فرصة في تنسيق خدمات التأمين الصحي', company: 'شركة تأمين', city: 'جدة', postedAt: '2026-07-25', applyLink: 'https://www.linkedin.com/jobs/view/4360914285/', employerLogo: null, isLinkedIn: true, employmentType: 'دوام كامل', publisher: 'LinkedIn', salaryMin: null, salaryMax: null, salaryPeriod: null, isRemote: false },
  { id: '4436822996', slug: 'NDQzNjgyMjk5Ng', title: 'Medical Coding Auditor', titleAr: 'مدقق ترميز طبي', description: 'فرصة في تدقيق الترميز الطبي والتأمين', company: 'مستشفى', city: 'الرياض', postedAt: '2026-07-25', applyLink: 'https://www.linkedin.com/jobs/view/4436822996/', employerLogo: null, isLinkedIn: true, employmentType: 'دوام كامل', publisher: 'LinkedIn', salaryMin: null, salaryMax: null, salaryPeriod: null, isRemote: false },
  { id: '4441778429', slug: 'NDQ0MTc3ODQyOQ', title: 'Claims Processing Manager', titleAr: 'مدير معالجة المطالبات', description: 'فرصة في إدارة معالجة مطالبات التأمين', company: 'شركة تأمين صحي', city: 'الرياض', postedAt: '2026-07-25', applyLink: 'https://www.linkedin.com/jobs/view/4441778429/', employerLogo: null, isLinkedIn: true, employmentType: 'دوام كامل', publisher: 'LinkedIn', salaryMin: null, salaryMax: null, salaryPeriod: null, isRemote: false },
  { id: '4443327570', slug: 'NDQ0MzMyNzU3MA', title: 'Hospital Revenue Analyst', titleAr: 'محلل إيرادات مستشفى', description: 'فرصة في تحليل إيرادات المستشفيات', company: 'مستشفى', city: 'الدمام', postedAt: '2026-07-25', applyLink: 'https://www.linkedin.com/jobs/view/4443327570/', employerLogo: null, isLinkedIn: true, employmentType: 'دوام كامل', publisher: 'LinkedIn', salaryMin: null, salaryMax: null, salaryPeriod: null, isRemote: false },
  { id: '4429489067', slug: 'NDQyOTQ4OTA2Nw', title: 'Insurance Operations Lead', titleAr: 'قائد عمليات التأمين', description: 'فرصة في قيادة عمليات التأمين الصحي', company: 'شركة تأمين', city: 'جدة', postedAt: '2026-07-25', applyLink: 'https://www.linkedin.com/jobs/view/4429489067/', employerLogo: null, isLinkedIn: true, employmentType: 'دوام كامل', publisher: 'LinkedIn', salaryMin: null, salaryMax: null, salaryPeriod: null, isRemote: false },
  { id: '4444298324', slug: 'NDQ0NDI5ODMyNA', title: 'RCM Implementation Specialist', titleAr: 'أخصائي تطبيق نظام الإيرادات', description: 'فرصة في تطبيق أنظمة دورة الإيرادات', company: 'شركة تقنية صحية', city: 'الرياض', postedAt: '2026-07-25', applyLink: 'https://www.linkedin.com/jobs/view/4444298324/', employerLogo: null, isLinkedIn: true, employmentType: 'دوام كامل', publisher: 'LinkedIn', salaryMin: null, salaryMax: null, salaryPeriod: null, isRemote: false },
];

export const metadata: Metadata = {
  title: 'الوظائف | مرفأ',
  description: 'فرص وظيفية محدّثة من كبرى المنصات في السعودية — قدّم مباشرة عبر LinkedIn',
  openGraph: {
    title: 'الوظائف في السعودية | مرفأ',
    description: 'فرص وظيفية محدّثة من كبرى المنصات — قدّم مباشرة عبر LinkedIn',
    url: 'https://www.marfa.sa/jobs',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'الوظائف في السعودية | مرفأ',
    description: 'فرص وظيفية محدّثة من كبرى المنصات — قدّم مباشرة عبر LinkedIn',
  },
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
  const { jobs: cachedJobs, fetchedAt } = await getCachedJobs(supabase).catch((err) => {
    console.error('JOBS_PAGE_FETCH_FAIL', err instanceof Error ? err.message : 'unknown');
    return { jobs: [] as Job[], fetchedAt: null };
  });

  // Merge manual healthcare/RCM jobs with cached JSearch results
  const jobs = [...MANUAL_JOBS, ...cachedJobs];

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
