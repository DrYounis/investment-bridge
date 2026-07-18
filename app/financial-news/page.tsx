import type { Metadata } from 'next';
import Link from 'next/link';
import { getArticles } from '@/lib/supabase/financial-news';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'الأخبار المالية السعودية | marfa.sa',
  description:
    'تحليلات مالية ذكية يومية للسوق السعودي — تغطية شاملة لأهم أخبار الأسهم والاقتصاد والاستثمار في المملكة. من marfa.sa.',
  openGraph: {
    title: 'الأخبار المالية السعودية | marfa.sa',
    description:
      'تحليلات مالية ذكية يومية للسوق السعودي — تغطية شاملة لأهم أخبار الأسهم والاقتصاد والاستثمار في المملكة.',
    type: 'website',
  },
};

export default async function FinancialNewsPage() {
  const articles = await getArticles();

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="inline-block px-4 py-2 bg-gold/10 border border-gold/20 text-gold rounded-full text-sm font-bold mb-4">
            📰 تحديث يومي
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-100 mb-4">
            الأخبار المالية السعودية
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            تحليلات مالية ذكية ومحتوى حصري للسوق السعودي — نغطي أهم الأخبار
            الاقتصادية لنبقي المستثمرين على اطلاع دائم
          </p>
        </header>

        {/* Articles Grid */}
        {articles.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/financial-news/${article.slug}`}
                className="group block bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10
                           hover:border-gold/30 hover:bg-white/10 transition-all duration-300
                           hover:shadow-lg hover:shadow-gold/5 relative"
              >
                {article.video_url && (
                  <span className="absolute top-3 right-3 text-lg" title="يحتوي على فيديو">🎬</span>
                )}

                {article.date && (
                  <time className="text-xs text-slate-500 mb-3 block">
                    {article.date}
                  </time>
                )}

                <h2 className="text-lg font-bold text-slate-100 mb-3 line-clamp-2 group-hover:text-gold transition-colors">
                  {article.title}
                </h2>

                <p className="text-sm text-slate-400 mb-4 line-clamp-3 leading-relaxed">
                  {article.excerpt}
                </p>

                {article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {article.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gold/10 text-gold/80 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex items-center gap-1 text-sm text-gold font-medium">
                  اقرأ التحليل
                  <span className="group-hover:translate-x-1 transition-transform inline-block">
                    ←
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-16 text-center border border-white/10">
            <p className="text-6xl mb-4">📭</p>
            <h2 className="text-2xl font-bold text-slate-200 mb-3">
              لا توجد تحليلات منشورة بعد
            </h2>
            <p className="text-slate-400 max-w-md mx-auto">
              نعمل على جمع وتحليل أحدث الأخبار المالية السعودية. تابعنا غداً
              للحصول على أول تحليل.
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-white/5 text-center">
          <p className="text-sm text-slate-500">
            تحليلات مالية مقدمة من{' '}
            <Link href="/" className="text-gold hover:underline">
              marfa.sa
            </Link>{' '}
            — منصة التحليل المالي الذكي في المملكة العربية السعودية
          </p>
        </footer>
      </div>
    </main>
  );
}
