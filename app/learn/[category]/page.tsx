import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getPublishedArticles } from '@/lib/learn/articles';
import { CATEGORIES } from '@/lib/learn/taxonomy';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORIES.find(c => c.slug === category);
  if (!cat) return { title: 'تصنيف غير موجود | مرفأ' };
  return { title: `${cat.label} | مركز المعرفة | مرفأ`, description: `مقالات تعليمية في ${cat.label} لرواد الأعمال والمستثمرين السعوديين.` };
}

export default async function LearnCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = CATEGORIES.find(c => c.slug === category);
  if (!cat) notFound();

  const supabase = await createClient();
  const articles = await getPublishedArticles(supabase, category);

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-[#faf8f2]" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <Link href="/learn" className="text-sm text-[#8a94a8] hover:text-[#c9a84c] mb-6 inline-block" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          ← مركز المعرفة
        </Link>
        <h1 className="text-3xl font-bold text-[#0a0f1e] mb-4" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>{cat.label}</h1>
        <p className="text-[#4a5b78] mb-10" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          {articles.length > 0 ? `${articles.length} مقالات منشورة` : 'لا توجد مقالات منشورة بعد'}
        </p>
        {articles.length > 0 ? (
          <div className="space-y-4">
            {articles.map(article => (
              <Link key={article.id} href={`/learn/${article.category}/${article.slug}`}
                className="block bg-white rounded-2xl p-6 border border-[#c9a84c]/20 shadow-[0_8px_30px_rgba(10,15,30,0.04)] hover:shadow-md hover:border-[#c9a84c]/40 transition-all">
                <h2 className="text-[#0a0f1e] font-bold text-lg mb-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>{article.title_ar}</h2>
                <p className="text-[#4a5b78] text-sm mb-3" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>{article.summary_ar}</p>
                <span className="text-xs text-[#8a94a8]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>{article.reading_minutes} دقائق قراءة</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-[#8a94a8] text-lg" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>قريباً — المقالات قيد الإعداد</p>
          </div>
        )}
      </div>
    </main>
  );
}
