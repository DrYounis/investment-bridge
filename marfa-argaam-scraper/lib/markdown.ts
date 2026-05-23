import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { RawArticle } from './scraper';
import type { SummarizedArticle } from './summarizer';

// ── Types ──────────────────────────────────────────────────────────

export interface MarkdownResult {
  filename: string;
  filepath: string;
  title: string;
}

// ── Constants ──────────────────────────────────────────────────────

const CONTENT_DIR = path.join(process.cwd(), 'content', 'news', 'argaam');

// ── Helpers ────────────────────────────────────────────────────────

/**
 * Clean a title to be filesystem-safe.
 * Keeps Arabic, English letters, and numbers. Replaces spaces with hyphens.
 */
function cleanTitle(title: string): string {
  return title
    .replace(/[^\u0600-\u06FF\w\s-]/g, '') // keep Arabic, word chars, spaces, hyphens
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase()
    .slice(0, 80);
}

/**
 * Generate unique filename from article title and date.
 */
export function generateUniqueFilename(title: string, date: string): string {
  const clean = cleanTitle(title || 'news');
  const timestamp = Date.now().toString().slice(-6);
  return `${date}-${clean}-${timestamp}.md`;
}

/**
 * Build the full markdown content with frontmatter.
 */
export function generateMarkdownContent(
  article: RawArticle,
  summary: SummarizedArticle
): string {
  const riyadhTimestamp = new Date().toLocaleString('ar-SA', {
    timeZone: 'Asia/Riyadh',
  });

  const frontmatterData = {
    title: summary.seo_title,
    original_title: summary.original_title,
    source: 'Argaam',
    source_url: summary.source_url,
    date: summary.article_date,
    scraped_at: article.scraped_at,
    tags: summary.tags,
    category: 'financial-news',
    seo_keywords: 'الاستثمار السعودي، السوق المالية، الاقتصاد السعودي',
  };

  const frontmatter = matter.stringify('', frontmatterData);
  // Remove the trailing newline that matter adds to empty content
  const fm = frontmatter.trim();

  const body = `
# ${summary.seo_title}

${summary.seo_summary}

---

## المصدر الأصلي

**العنوان:** ${summary.original_title}

**المصدر:** [أرقام - Argaam](${summary.source_url})

**تاريخ النشر:** ${summary.article_date}

---

## المحتوى الكامل

${article.full_content || article.summary}

---

*تم إنشاء هذا الملخص تلقائياً بواسطة نظام marfa.sa لتجميع الأخبار المالية السعودية*

*آخر تحديث: ${riyadhTimestamp}*
`;

  return fm + '\n' + body;
}

/**
 * Save article + summary as a markdown file.
 */
export async function saveToMarkdown(
  article: RawArticle,
  summary: SummarizedArticle
): Promise<MarkdownResult> {
  // Ensure directory exists
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
    console.log(`📁 Created directory: ${CONTENT_DIR}`);
  }

  const filename = generateUniqueFilename(article.title, article.date);
  const filepath = path.join(CONTENT_DIR, filename);
  const content = generateMarkdownContent(article, summary);

  fs.writeFileSync(filepath, content, 'utf-8');

  console.log(`💾 Saved: ${filename}`);

  return {
    filename,
    filepath,
    title: summary.seo_title,
  };
}

/**
 * List all saved markdown files in the content directory.
 */
export function listMarkdownFiles(): { filename: string; created: string; size: number }[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md'));

  return files
    .map((filename) => {
      const filepath = path.join(CONTENT_DIR, filename);
      const stats = fs.statSync(filepath);
      return {
        filename,
        created: stats.birthtime.toISOString(),
        size: stats.size,
      };
    })
    .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
}

/**
 * Read frontmatter from a markdown file.
 */
export function readMarkdownFrontmatter(
  filename: string
): { title?: string; date?: string; original_title?: string; source_url?: string } | null {
  try {
    const filepath = path.join(CONTENT_DIR, filename);
    if (!fs.existsSync(filepath)) return null;
    const raw = fs.readFileSync(filepath, 'utf-8');
    const parsed = matter(raw);
    return parsed.data as Record<string, string>;
  } catch {
    return null;
  }
}
