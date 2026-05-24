import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlug } from '@/lib/supabase/financial-news';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

function renderContent(summary: string, fullContent?: string | null): string {
  const body = fullContent || summary;

  return (
    body
      // Headers
      .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold text-slate-100 mt-8 mb-3">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-slate-100 mt-10 mb-4">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-extrabold text-gold mt-10 mb-4">$1</h1>')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-slate-200">$1</strong>')
      // Italic
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Links
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-gold hover:underline">$1</a>'
      )
      // Horizontal rules
      .replace(/^---$/gm, '<hr class="my-8 border-white/10" />')
      // Paragraphs
      .split(/\n\n+/)
      .map((block) => {
        const trimmed = block.trim();
        if (!trimmed) return '';
        if (trimmed.startsWith('<h') || trimmed.startsWith('<hr')) return trimmed;
        return `<p class="text-slate-300 leading-loose mb-4">${trimmed.replace(/\n/g, '<br />')}</p>`;
      })
      .join('\n')
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const article = await getArticleBySlug(decodedSlug);

  if (!article) {
    return { title: 'المقال غير موجود | marfa.sa' };
  }

  const title = article.title || article.original_title || 'مقال مالي';
  const description = (article.summary || '').slice(0, 160) || 'تحليل مالي من marfa.sa';

  return {
    title: `${title} | marfa.sa`,
    description,
    openGraph: {
      title: `${title} | marfa.sa`,
      description,
      type: 'article',
      publishedTime: article.article_date || undefined,
      tags: article.tags || [],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  // Next.js may pass URL-encoded Arabic slugs — decode before lookup
  const decodedSlug = decodeURIComponent(slug);

  const article = await getArticleBySlug(decodedSlug);

  if (!article) notFound();

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8" dir="rtl">
      <article className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <Link
            href="/financial-news"
            className="text-gold hover:underline inline-flex items-center gap-1"
          >
            ← الأخبار المالية
          </Link>
        </nav>

        {/* Article Header */}
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gold mb-4 leading-snug">
            {article.title || article.original_title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            {article.article_date && <time>{article.article_date}</time>}
            <span className="px-2 py-1 bg-white/5 rounded-full text-xs">
              marfa.sa الأخبار المالية
            </span>
          </div>
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {article.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gold/10 text-gold/80 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Article Summary */}
        <div className="mb-10 p-6 bg-gold/5 border border-gold/10 rounded-2xl">
          <p className="text-slate-200 leading-loose text-lg">
            {article.summary}
          </p>
        </div>

        {/* Full Content */}
        {article.full_content && (
          <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{
              __html: renderContent(article.summary, article.full_content),
            }}
          />
        )}

        {/* Source Link */}
        {article.source_url && (
          <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
            <a
              href={article.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline font-bold"
            >
              اقرأ المقال الأصلي ←
            </a>
          </div>
        )}

        {/* Back Link */}
        <div className="mt-10 text-center">
          <Link
            href="/financial-news"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 rounded-full text-slate-300 hover:text-gold hover:bg-white/10 transition-all"
          >
            ← جميع التحليلات
          </Link>
        </div>
      </article>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-white/5 text-center max-w-3xl mx-auto">
        <p className="text-sm text-slate-500">
          تحليلات مالية مقدمة من{' '}
          <Link href="/" className="text-gold hover:underline">
            marfa.sa
          </Link>{' '}
          — منصة الاستثمار الذكي في المملكة العربية السعودية
        </p>
      </footer>
    </main>
  );
}
