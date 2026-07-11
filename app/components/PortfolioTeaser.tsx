import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function PortfolioTeaser() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from('marfa_portfolio')
    .select('slug, name_ar, icon, sector_ar, stage_ar, teaser_ar')
    .eq('is_featured', true)
    .order('display_order', { ascending: true })
    .limit(3);

  if (!items?.length) return null;

  return (
    <section className="py-16 px-4 bg-[#0a0f1e]" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-[#c9a84c] mb-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            محفظة مرفأ
          </h2>
          <p className="text-[#a0aec0]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            مشاريع سعودية نؤمن بها ونستثمر فيها
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item: any) => (
            <Link
              key={item.slug}
              href={`/portfolio/${item.slug}`}
              className="group block bg-[#0d1628] rounded-2xl p-6 border border-[#1a2540] hover:border-[#c9a84c]/40 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{item.icon}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-[#c9a84c]/10 text-[#c9a84c] font-bold" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                  {item.stage_ar}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                {item.name_ar}
              </h3>
              <p className="text-xs text-[#64748b] mb-3" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                {item.sector_ar}
              </p>
              <p className="text-sm text-[#a0aec0] leading-relaxed" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                {item.teaser_ar}
              </p>
              <span className="inline-block mt-4 text-sm font-bold text-[#c9a84c] group-hover:text-[#d4a843] transition-colors">
                اكتشف الفرصة ←
              </span>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#c9a84c] text-[#0a0f1e] font-black rounded-full hover:bg-[#d4a843] transition-colors text-sm"
            style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
          >
            عرض المحفظة كاملة
          </Link>
        </div>
      </div>
    </section>
  );
}
