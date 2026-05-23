import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface Props {
  params: Promise<{ slug: string }>;
}

function getArticle(slug: string) {
  const filepath = path.join(
    process.cwd(),
    'content',
    'news',
    'financial-news',
    `${slug}.md`
  );

  if (!fs.existsSync(filepath)) return null;

  const raw = fs.readFileSync(filepath, 'utf-8');
  const { data, content } = matter(raw);

  return {
    frontmatter: data as Record<string, any>,
    content: renderMarkdownToHTML(content),
    rawContent: content,
  };
}

function renderMarkdownToHTML(md: string): string {
  return (
    md
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
      // Paragraphs (blank-line separated blocks)
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
  const article = getArticle(slug);

  if (!article) {
    return { title: 'المقال غير موجود | marfa.sa' };
  }

  const fm = article.frontmatter;
  const title = fm.title || fm.original_title || 'مقال مالي';
  const description =
    article.rawContent
      .replace(/^#.*$/gm, '')
      .replace(/[*_`#>\[\]|-]/g, '')
      .replace(/\n+/g, ' ')
      .trim()
      .slice(0, 160) || 'تحليل مالي من marfa.sa';

  return {
    title: `${title} | marfa.sa`,
    description,
    openGraph: {
      title: `${title} | marfa.sa`,
      description,
      type: 'article',
      publishedTime: fm.date,
      tags: fm.tags || [],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) notFound();

  const fm = article.frontmatter;

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
            {fm.title || fm.original_title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            {fm.date && <time>{fm.date}</time>}
            {fm.source && (
              <span className="px-2 py-1 bg-white/5 rounded-full text-xs">
                {fm.source}
              </span>
            )}
          </div>
          {fm.tags && fm.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {fm.tags.map((tag: string) => (
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

        {/* Article Content */}
        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Source Link */}
        {fm.source_url && (
          <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
            <a
              href={fm.source_url}
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
