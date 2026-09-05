'use client';

import Link from 'next/link';
import { trackEvent } from '@/lib/tracking';

interface ArticleCouncilCTAProps {
  articleId: string;
}

export default function ArticleCouncilCTA({ articleId }: ArticleCouncilCTAProps) {
  return (
    <section className="mt-12">
      <div className="bg-gradient-to-r from-[#0a0f1e] to-[#0d1628] border border-[#c9a84c]/30 rounded-3xl p-8 text-center shadow-[0_8px_40px_rgba(201,168,76,0.08)]">
        <h2 className="text-2xl font-black text-white mb-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          🏛️ طبّق معرفتك
        </h2>
        <p className="text-[#a0aec0] text-sm mb-6 max-w-lg mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          لا تكتفِ بالقراءة — ناقش هذه المفاهيم مع مستشارين معتمدين في المجلس الاستشاري، وطبّقها على حالة دراسية حقيقية كل جمعة.
        </p>
        <Link
          href="/meetings"
          onClick={() => trackEvent('article_council_cta_click', { article_id: articleId })}
          className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-[#c9a84c] to-[#d4a843] text-[#0a0f1e] font-bold text-sm hover:shadow-xl hover:shadow-[#c9a84c]/25 transition-all duration-300"
          style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
        >
          انضم إلى المجلس الاستشاري ←
        </Link>
      </div>
    </section>
  );
}
