import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getArticleBySlug, getRelatedArticles } from '@/lib/learn/articles';
import { CATEGORIES } from '@/lib/learn/taxonomy';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const article = await getArticleBySlug(supabase, slug);
  if (!article) return { title: 'المقال غير موجود | مرفأ' };
  return {
    title: `${article.title_ar} | مرفأ`,
    description: article.summary_ar,
    openGraph: { title: article.title_ar, description: article.summary_ar, type: 'article' },
    alternates: { canonical: `https://www.marfa.sa/learn/${article.category}/${article.slug}` },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const article = await getArticleBySlug(supabase, slug);
  if (!article) notFound();

  const related = await getRelatedArticles(supabase, article.category, article.slug);
  const categoryLabel = CATEGORIES.find(c => c.slug === article.category)?.label || article.category;

  // Fix literal \n strings + strip leading H1 (page already has its own H1)
  let content = article.content_ar.replace(/\\n/g, '\n');
  content = content.replace(/^# .+\n+/, '');

  const markdownComponents = {
    h2: ({ children, ...props }: React.ComponentPropsWithoutRef<'h2'>) => <h2 className="text-2xl font-bold mt-8 mb-3" style={{ color: '#0a0f1e', fontFamily: 'var(--font-tajawal), sans-serif' }} {...props}>{children}</h2>,
    h3: ({ children, ...props }: React.ComponentPropsWithoutRef<'h3'>) => <h3 className="text-xl font-semibold mt-6 mb-2" style={{ color: '#0a0f1e', fontFamily: 'var(--font-tajawal), sans-serif' }} {...props}>{children}</h3>,
    p: ({ children, ...props }: React.ComponentPropsWithoutRef<'p'>) => <p className="leading-loose mb-4 text-start" style={{ color: '#4a5b78', fontFamily: 'var(--font-tajawal), sans-serif' }} {...props}>{children}</p>,
    strong: ({ children, ...props }: React.ComponentPropsWithoutRef<'strong'>) => <strong className="font-bold" style={{ color: '#0a0f1e' }} {...props}>{children}</strong>,
    ul: ({ children, ...props }: React.ComponentPropsWithoutRef<'ul'>) => <ul className="ms-6 mb-4 space-y-2 list-disc" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }} {...props}>{children}</ul>,
    ol: ({ children, ...props }: React.ComponentPropsWithoutRef<'ol'>) => <ol className="ms-6 mb-4 space-y-2 list-decimal" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }} {...props}>{children}</ol>,
    hr: (props: React.ComponentPropsWithoutRef<'hr'>) => <hr className="my-8" style={{ borderColor: 'rgba(201,168,76,0.3)' }} {...props} />,
    a: ({ children, href, ...props }: React.ComponentPropsWithoutRef<'a'>) => <a href={href} className="text-[#c9a84c] underline" target="_blank" rel="noopener noreferrer" {...props}>{children}</a>,
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title_ar,
    description: article.summary_ar,
    datePublished: article.created_at,
    dateModified: article.updated_at,
    wordCount: article.content_ar.split(/\s+/).length,
    inLanguage: 'ar',
  };

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-[#faf8f2]" dir="rtl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#8a94a8] mb-6" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          <Link href="/learn" className="hover:text-[#c9a84c]">مركز المعرفة</Link>
          <span>/</span>
          <Link href={`/learn/${article.category}`} className="hover:text-[#c9a84c]">{categoryLabel}</Link>
        </div>

        {/* Header */}
        <span className="text-xs font-bold text-[#c9a84c] bg-[#fdf9ef] px-2 py-1 rounded-full mb-4 inline-block">{categoryLabel}</span>
        <h1 className="text-3xl md:text-4xl font-bold text-[#0a0f1e] mb-3" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>{article.title_ar}</h1>
        <p className="text-[#4a5b78] text-lg mb-4" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>{article.summary_ar}</p>
        <div className="flex items-center gap-4 text-xs text-[#8a94a8] mb-10" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          <span>{article.reading_minutes} دقائق قراءة</span>
          <span>·</span>
          <span>{new Date(article.created_at).toLocaleDateString('ar-SA')}</span>
        </div>

        {/* Article body */}
        <div className="bg-white rounded-2xl p-8 border border-[#c9a84c]/20 shadow-[0_8px_30px_rgba(10,15,30,0.04)]"
          style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {content}
          </ReactMarkdown>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-[#0a0f1e] mb-4" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>مقالات ذات صلة</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {related.map(r => (
                <Link key={r.id} href={`/learn/${r.category}/${r.slug}`}
                  className="block bg-white rounded-xl p-5 border border-[#c9a84c]/20 shadow-[0_4px_15px_rgba(10,15,30,0.03)] hover:shadow-md hover:border-[#c9a84c]/40 transition-all">
                  <h3 className="text-[#0a0f1e] font-bold text-sm mb-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>{r.title_ar}</h3>
                  <span className="text-xs text-[#8a94a8]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>{r.reading_minutes} دقائق</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
