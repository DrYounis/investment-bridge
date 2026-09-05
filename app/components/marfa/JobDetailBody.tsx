'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { trackEvent } from '@/lib/tracking';

export type JobCtaVariant = 'banner' | 'gate' | 'off';

interface JobDetailBodyProps {
  description: string;
  applyLink: string;
  isLinkedIn: boolean;
  publisher: string | null;
  variant: JobCtaVariant;
}

export default function JobDetailBody({
  description,
  applyLink,
  isLinkedIn,
  publisher,
  variant,
}: JobDetailBodyProps) {
  const { user } = useAuth();
  const isAuthed = Boolean(user);

  // Fire a "CTA viewed" event whenever an anonymous visitor sees a CTA variant
  useEffect(() => {
    if (!isAuthed && variant !== 'off') {
      trackEvent('job_detail_cta_view', undefined, variant);
    }
  }, [isAuthed, variant]);

  const handleCtaClick = () => {
    trackEvent('job_detail_cta_click', undefined, variant);
  };

  const summary = description.length > 220 ? `${description.slice(0, 220).trimEnd()}…` : description;

  const descCard = (
    <div className="bg-white rounded-3xl border border-[#c9a84c]/20 shadow-[0_8px_30px_rgba(10,15,30,0.06)] p-8 mb-8">
      <h2 className="text-xl font-bold text-[#0a0f1e] mb-4" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
        الوصف الوظيفي
      </h2>
      <p className="whitespace-pre-line leading-relaxed text-[#4a5b78]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
        {description}
      </p>
    </div>
  );

  const summaryCard = (
    <div className="bg-white rounded-3xl border border-[#c9a84c]/20 shadow-[0_8px_30px_rgba(10,15,30,0.06)] p-8 mb-6">
      <h2 className="text-xl font-bold text-[#0a0f1e] mb-4" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
        نبذة عن الوظيفة
      </h2>
      <p className="whitespace-pre-line leading-relaxed text-[#4a5b78]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
        {summary}
      </p>
    </div>
  );

  const applyBtn = (
    <div className="sticky bottom-6">
      <a
        href={applyLink}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="block w-full max-w-md mx-auto text-center px-6 py-4 rounded-2xl bg-gradient-to-r from-[#c9a84c] to-[#d4a843] text-[#0a0f1e] text-lg font-bold hover:shadow-xl hover:shadow-[#c9a84c]/30 transition-all duration-300"
        style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
      >
        قدّم الآن {isLinkedIn ? 'عبر LinkedIn' : `عبر ${publisher || 'الموقع الخارجي'}`} ←
      </a>
    </div>
  );

  // Logged-in users (and the "off" variant) always see the full description.
  if (isAuthed || variant === 'off') {
    return (
      <>
        {description && descCard}
        {applyBtn}
      </>
    );
  }

  // Variant (b): gate full details + apply button behind registration.
  if (variant === 'gate') {
    return (
      <>
        {description && summaryCard}
        <div className="bg-white rounded-2xl border border-[#c9a84c]/30 p-6 text-center shadow-[0_4px_20px_rgba(10,15,30,0.04)] mb-8">
          <p className="text-[#0a0f1e] font-bold text-lg mb-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            🔒 سجّل لعرض التفاصيل الكاملة والتقديم
          </p>
          <p className="text-[#4a5b78] text-sm mb-4 leading-relaxed" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            أنشئ حسابك المجاني لعرض الوصف الكامل وزر التقديم — يستغرق أقل من دقيقة
          </p>
          <Link
            href="/join?src=jobs"
            onClick={handleCtaClick}
            className="inline-block px-8 py-2.5 rounded-full bg-gradient-to-r from-[#c9a84c] to-[#d4a843] text-[#0a0f1e] text-sm font-bold hover:shadow-lg hover:shadow-[#c9a84c]/25 transition-all duration-300"
            style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
          >
            سجّل الآن مجاناً ←
          </Link>
        </div>
        {description && (
          <div className="relative mb-8" aria-hidden>
            <div className="bg-white rounded-3xl border border-[#c9a84c]/20 p-8 blur-[6px] select-none pointer-events-none">
              <p className="whitespace-pre-line leading-relaxed text-[#4a5b78]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                {description}
              </p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-[#0a0f1e] text-[#c9a84c] text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                🔒 المحتوى الكامل متاح بعد التسجيل
              </span>
            </div>
          </div>
        )}
      </>
    );
  }

  // Variant (a): prominent CTA banner after the summary, before full details.
  return (
    <>
      {description && summaryCard}
      <div className="bg-white rounded-2xl border border-[#c9a84c]/30 p-6 text-center shadow-[0_4px_20px_rgba(10,15,30,0.04)] mb-8">
        <p className="text-[#0a0f1e] font-bold text-lg mb-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          سجّل لمتابعة هذه الوظيفة
        </p>
        <p className="text-[#4a5b78] text-sm mb-4 leading-relaxed" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          أنشئ حسابك المجاني لتصلك تنبيهات الوظائف المشابهة أولاً بأول — وتابع تقدمك المهني
        </p>
        <Link
          href="/join?src=jobs"
          onClick={handleCtaClick}
          className="inline-block px-8 py-2.5 rounded-full bg-gradient-to-r from-[#c9a84c] to-[#d4a843] text-[#0a0f1e] text-sm font-bold hover:shadow-lg hover:shadow-[#c9a84c]/25 transition-all duration-300"
          style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
        >
          سجّل الآن مجاناً ←
        </Link>
        <p className="text-[#8a94a8] text-xs mt-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          يستغرق أقل من دقيقة
        </p>
      </div>
      {description && descCard}
      {applyBtn}
    </>
  );
}
