import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlug } from '@/lib/supabase/financial-news';
import { escapeHtml } from '@/lib/security';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

function renderContent(summary: string, fullContent?: string | null): string {
  let body = fullContent || summary;

  // Escape HTML entities first — before any markdown transforms
  body = escapeHtml(body);

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
      // Links — only emit <a> for https? URLs
      .replace(
        /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
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

        {/* YouTube Video Link */}
        {article.video_url && (
          <div className="mb-10">
            <a
              href={article.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-4 bg-red-600/20 border border-red-600/30 rounded-2xl text-red-400 hover:bg-red-600/30 transition-all"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span className="font-bold">مشاهدة الفيديو على يوتيوب</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}

        {/* Full Content */}
        {article.full_content && (
          <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{
              __html: renderContent(article.summary, article.full_content),
            }}
          />
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
