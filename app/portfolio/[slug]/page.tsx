import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';

type PortfolioItem = {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  icon: string;
  sector_ar: string;
  stage_ar: string;
  is_featured: boolean;
  display_order: number;
  teaser_ar: string;
};

export default async function PortfolioDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: item } = await supabase
    .from('marfa_portfolio')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!item) notFound();

  const portfolio = item as PortfolioItem;

  return (
    <div className="min-h-screen bg-[#faf8f2]" dir="rtl">
      {/* Hero */}
      <section className="bg-[#0a0f1e] pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-[#a0aec0] hover:text-[#c9a84c] text-sm font-bold mb-6 transition-colors"
            style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
          >
            → العودة للمحفظة
          </Link>
          <div className="flex items-start gap-4">
            <span className="text-5xl">{portfolio.icon}</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-[#c9a84c]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                {portfolio.name_ar}
              </h1>
              <p className="text-[#64748b] mt-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                {portfolio.name_en} · {portfolio.sector_ar}
              </p>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <span className="px-4 py-1.5 rounded-full bg-[#c9a84c]/10 text-[#c9a84c] text-sm font-bold border border-[#c9a84c]/20" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
              {portfolio.stage_ar}
            </span>
            {portfolio.is_featured && (
              <span className="px-4 py-1.5 rounded-full bg-[#c9a84c]/5 text-[#c9a84c] text-sm font-bold border border-[#c9a84c]/15" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                ⭐ مشروع مميز
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        {/* Teaser */}
        <div className="bg-white rounded-3xl p-8 border border-[#c9a84c]/20 shadow-[0_8px_30px_rgba(10,15,30,0.06)]">
          <h2 className="text-lg font-bold text-[#0a0f1e] mb-4" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            عن المشروع
          </h2>
          <p className="text-[#4a5b78] text-lg leading-relaxed" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            {portfolio.teaser_ar}
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-[#64748b] mb-6" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            مهتم بهذه الفرصة الاستثمارية؟
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-10 py-4 bg-[#c9a84c] text-[#0a0f1e] text-lg font-black rounded-2xl hover:bg-[#d4a843] transition-colors"
            style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
          >
            سجّل دخولك للتواصل
          </Link>
        </div>
      </section>
    </div>
  );
}
