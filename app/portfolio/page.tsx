import { createClient } from '@/lib/supabase/server';
import InterestCTA from './InterestCTA';

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

export default async function PortfolioPage() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from('marfa_portfolio')
    .select('id, slug, name_ar, name_en, icon, sector_ar, stage_ar, is_featured, display_order, teaser_ar')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  const portfolio = (items || []) as PortfolioItem[];
  const featured = portfolio.filter((i) => i.is_featured);
  const others = portfolio.filter((i) => !i.is_featured);

  return (
    <div className="min-h-screen bg-[#faf8f2]" dir="rtl">
      {/* Hero */}
      <section className="bg-[#0a0f1e] pt-32 pb-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-[#c9a84c] mb-4" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          معرض مشاريع مرفأ
        </h1>
        <p className="text-[#a0aec0] max-w-2xl mx-auto text-lg leading-relaxed" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          منتجات حقيقية بناها فريق مرفأ ومتدربو برامجنا — من الفكرة إلى السوق.
        </p>
      </section>

      {/* CMA compliance disclaimer */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-6">
        <div className="bg-[#fdf9ef] border border-[#c9a84c]/30 rounded-2xl p-4 text-center">
          <p className="text-sm text-[#4a5b78]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            هذه الصفحة تعرض مخرجات برامج مرفأ التدريبية والمشاريع التي طورها فريقنا. مرفأ لا يقدم خدمات طرح أو ترتيب أوراق مالية ولا يتوسط في عمليات استثمار.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16 space-y-16">
        {/* Featured */}
        {featured.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-[#0a0f1e] mb-8 text-center" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
              ⭐ مشاريع مميزة
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((item) => (
                <PortfolioCard key={item.id} item={item} featured />
              ))}
            </div>
          </section>
        )}

        {/* Others */}
        {others.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-[#0a0f1e] mb-8 text-center" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
              🚀 مشاريع واعدة
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {others.map((item) => (
                <PortfolioCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function PortfolioCard({ item, featured }: { item: PortfolioItem; featured?: boolean }) {
  return (
    <div
      className={`group rounded-3xl p-6 transition-all duration-300 ${
        featured
          ? 'bg-white border-2 border-[#c9a84c]/30 shadow-[0_8px_30px_rgba(10,15,30,0.08)] hover:border-[#c9a84c]/60'
          : 'bg-white border border-[#c9a84c]/15 shadow-[0_4px_20px_rgba(10,15,30,0.04)]'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-4xl">{item.icon}</span>
        <span className="text-xs px-3 py-1 rounded-full bg-[#fdf9ef] text-[#c9a84c] font-bold border border-[#c9a84c]/20" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          {item.stage_ar}
        </span>
      </div>
      <h3 className="text-xl font-bold text-[#0a0f1e] mb-1" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
        {item.name_ar}
      </h3>
      <p className="text-xs text-[#64748b] mb-3" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
        {item.name_en} · {item.sector_ar}
      </p>
      <p className="text-sm text-[#4a5b78] leading-relaxed mb-4" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
        {item.teaser_ar}
      </p>
      <InterestCTA projectId={item.id} projectName={item.name_ar} />
    </div>
  );
}
