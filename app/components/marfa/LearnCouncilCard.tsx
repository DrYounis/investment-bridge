'use client';

import Link from 'next/link';
import { trackEvent } from '@/lib/tracking';

export default function LearnCouncilCard() {
  return (
    <section className="mb-16">
      <Link
        href="/meetings"
        onClick={() => trackEvent('learn_index_council_card_click')}
        className="block bg-white rounded-3xl p-8 border border-[#c9a84c]/25 shadow-[0_8px_30px_rgba(10,15,30,0.06)] hover:shadow-[0_8px_30px_rgba(10,15,30,0.10)] hover:border-[#c9a84c]/50 transition-all text-center"
      >
        <h3 className="text-[#0a0f1e] font-bold text-xl mb-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          🏛️ المجلس الاستشاري — طبّق ما تعلمته
        </h3>
        <p className="text-[#4a5b78] text-sm max-w-lg mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          اختبر معرفتك كل جمعة مع مستشارين معتمدين، وناقش حالة دراسية حقيقية من الواقع.
        </p>
        <span className="inline-block mt-4 text-sm font-bold text-[#c9a84c]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          انضم الآن ←
        </span>
      </Link>
    </section>
  );
}
