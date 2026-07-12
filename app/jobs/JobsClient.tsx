'use client';

import { useState, useMemo } from 'react';
import { Building2 } from 'lucide-react';
import type { Job } from '@/lib/jobs';

// ── Sector filter definitions ──────────────────────────────────────────────

const SECTORS = [
  {
    key: 'all',
    label: 'الكل',
    keywords: [] as string[],
  },
  {
    key: 'tech',
    label: 'التقنية',
    keywords: [
      'developer', 'engineer', 'software', 'it', 'data', 'tech',
      'digital', 'ai', 'مطور', 'تقنية',
    ],
  },
  {
    key: 'health',
    label: 'الصحة',
    keywords: [
      'health', 'medical', 'nurse', 'doctor', 'pharma', 'hospital',
      'طبيب', 'صحة', 'تمريض',
    ],
  },
  {
    key: 'education',
    label: 'التعليم',
    keywords: [
      'teacher', 'education', 'trainer', 'academic',
      'معلم', 'تعليم', 'مدرب',
    ],
  },
  {
    key: 'retail',
    label: 'التجزئة',
    keywords: [
      'retail', 'sales', 'store', 'commerce',
      'مبيعات', 'تجزئة',
    ],
  },
  {
    key: 'industry',
    label: 'الصناعة',
    keywords: [
      'manufacturing', 'factory', 'production', 'industrial',
      'مصنع', 'إنتاج',
    ],
  },
  {
    key: 'finance',
    label: 'المالية',
    keywords: [
      'finance', 'accounting', 'bank', 'investment',
      'محاسب', 'مالية', 'بنك',
    ],
  },
  {
    key: 'tourism',
    label: 'السياحة والتراث',
    keywords: [
      'tourism', 'hotel', 'hospitality', 'travel',
      'سياحة', 'فندق', 'ضيافة',
    ],
  },
];

// ── Arabic relative time helper ────────────────────────────────────────────

function timeAgoArabic(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 30) return 'منذ أكثر من شهر';
  if (diffDays > 10) return `منذ ${diffDays} يوماً`;
  if (diffDays > 2) return `منذ ${diffDays} أيام`;
  if (diffDays === 2) return 'منذ يومين';
  if (diffDays === 1) return 'منذ يوم';
  if (diffHours > 2) return `منذ ${diffHours} ساعات`;
  if (diffHours === 2) return 'منذ ساعتين';
  if (diffHours === 1) return 'منذ ساعة';
  if (diffMinutes > 0) return `منذ ${diffMinutes} دقيقة`;
  return 'منذ أقل من دقيقة';
}

// ── Props ──────────────────────────────────────────────────────────────────

interface JobsClientProps {
  jobs: Job[];
}

// ── Component ──────────────────────────────────────────────────────────────

export default function JobsClient({ jobs }: JobsClientProps) {
  const [activeSector, setActiveSector] = useState('all');

  const filteredJobs = useMemo(() => {
    if (activeSector === 'all') return jobs;

    const sector = SECTORS.find((s) => s.key === activeSector);
    if (!sector) return jobs;

    const keywords = sector.keywords;
    return jobs.filter((job) => {
      const title = job.title.toLowerCase();
      return keywords.some((kw) => title.includes(kw));
    });
  }, [jobs, activeSector]);

  return (
    <div>
      {/* Sector filter pills */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {SECTORS.map((sector) => {
          const isActive = activeSector === sector.key;
          return (
            <button
              key={sector.key}
              onClick={() => setActiveSector(sector.key)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors duration-200 ${
                isActive
                  ? 'bg-[#c9a84c] text-[#0a0f1e]'
                  : 'bg-white border border-[rgba(212,175,55,0.2)] text-[#0a0f1e] hover:border-[#c9a84c]/40'
              }`}
              style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
            >
              {sector.label}
            </button>
          );
        })}
      </div>

      {/* Results */}
      {filteredJobs.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <p
          className="text-center text-[#8a94a8] text-lg py-20"
          style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
        >
          لا توجد وظائف في هذا القطاع حالياً — جرّب قطاعاً آخر
        </p>
      )}
    </div>
  );
}

// ── Job card ───────────────────────────────────────────────────────────────

function JobCard({ job }: { job: Job }) {
  return (
    <div className="bg-white rounded-2xl border border-[rgba(201,168,76,0.2)] shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col">
      {/* Top row: logo + title */}
      <div className="flex items-start gap-3 mb-3">
        {job.employerLogo ? (
          <img
            src={job.employerLogo}
            alt={job.company}
            className="h-10 w-10 rounded-lg object-contain shrink-0"
          />
        ) : (
          <div className="h-10 w-10 rounded-lg bg-[#fdf9ef] border border-[#c9a84c]/30 flex items-center justify-center shrink-0">
            <Building2 className="h-5 w-5 text-[#c9a84c]" />
          </div>
        )}
        <div className="min-w-0">
          <h3
            className="font-bold text-[#0a0f1e] leading-snug line-clamp-2"
            style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
          >
            {job.title}
          </h3>
        </div>
      </div>

      {/* Company + city */}
      <p
        className="text-sm text-[#64748b] mb-2"
        style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
      >
        {job.company}
        {job.city ? ` · ${job.city}` : ''}
      </p>

      {/* Meta row */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span
          className="text-xs text-[#8a94a8]"
          style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
        >
          {timeAgoArabic(job.postedAt)}
        </span>
        {job.isLinkedIn && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#e8f3fc] text-[#0a66c2] font-bold">
            LinkedIn
          </span>
        )}
      </div>

      {/* Apply button — pushed to bottom */}
      <div className="mt-auto">
        <a
          href={job.applyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#c9a84c] to-[#d4a843] text-[#0a0f1e] text-sm font-bold hover:shadow-lg hover:shadow-[#c9a84c]/25 transition-all duration-300"
          style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
        >
          قدّم الآن ←
        </a>
      </div>
    </div>
  );
}
