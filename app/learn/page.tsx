import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getPublishedArticles } from '@/lib/learn/articles';
import { CATEGORIES, TOPICS } from '@/lib/learn/taxonomy';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'مركز المعرفة | مرفأ',
  description: 'موسوعة تعليمية عربية شاملة في ريادة الأعمال والاستثمار والتمويل — مقالات أصلية لرواد الأعمال والمستثمرين السعوديين.',
  openGraph: { title: 'مركز المعرفة | مرفأ', description: 'موسوعة تعليمية عربية شاملة في ريادة الأعمال والاستثمار والتمويل.', url: 'https://www.marfa.sa/learn' },
};

export default async function LearnHubPage() {
  const supabase = await createClient();
  const articles = await getPublishedArticles(supabase);
  const totalTopics = TOPICS.length;
  const publishedSlugs = new Set(articles.map(a => a.slug));

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-[#faf8f2]" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: 'var(--font-tajawal), sans-serif', background: 'linear-gradient(135deg, #d4b366, #b8933a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            مركز المعرفة
          </h1>
          <p className="text-[#4a5b78] max-w-2xl mx-auto text-lg" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            موسوعة تعليمية عربية شاملة في ريادة الأعمال والاستثمار والتمويل — {totalTopics} مقالاً أصلياً لرواد الأعمال والمستثمرين السعوديين
          </p>
        </section>

        {/* Category grid */}
        <section className="mb-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map(cat => {
              const count = TOPICS.filter(t => t.category === cat.slug).length;
              const published = TOPICS.filter(t => t.category === cat.slug && publishedSlugs.has(t.slug)).length;
              return (
                <Link key={cat.slug} href={`/learn/${cat.slug}`}
                  className="block bg-white rounded-2xl p-6 border border-[#c9a84c]/20 shadow-[0_8px_30px_rgba(10,15,30,0.04)] hover:shadow-[0_8px_30px_rgba(10,15,30,0.08)] hover:border-[#c9a84c]/40 transition-all">
                  <h3 className="text-[#0a0f1e] font-bold text-lg mb-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>{cat.label}</h3>
                  <p className="text-sm text-[#8a94a8]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                    {published > 0 ? `${published} من ${count} مقالاً منشوراً` : `${count} مقالاً`}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Latest articles */}
        {articles.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-[#0a0f1e] mb-6" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>أحدث المقالات</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {articles.slice(0, 6).map(article => (
                <Link key={article.id} href={`/learn/${article.category}/${article.slug}`}
                  className="block bg-white rounded-2xl p-6 border border-[#c9a84c]/20 shadow-[0_8px_30px_rgba(10,15,30,0.04)] hover:shadow-[0_8px_30px_rgba(10,15,30,0.08)] hover:border-[#c9a84c]/40 transition-all">
                  <span className="text-xs font-bold text-[#c9a84c] bg-[#fdf9ef] px-2 py-1 rounded-full mb-3 inline-block">
                    {CATEGORIES.find(c => c.slug === article.category)?.label}
                  </span>
                  <h3 className="text-[#0a0f1e] font-bold mb-2 leading-snug" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>{article.title_ar}</h3>
                  <p className="text-sm text-[#4a5b78] line-clamp-2 mb-3" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>{article.summary_ar}</p>
                  <span className="text-xs text-[#8a94a8]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>{article.reading_minutes} دقائق قراءة</span>
                </Link>
              ))}
            </div>
            {articles.length > 6 && (
              <div className="text-center mt-8">
                <span className="text-sm text-[#8a94a8]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                  و {articles.length - 6} مقالاً آخر — تصفح حسب الفئة أعلاه
                </span>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
