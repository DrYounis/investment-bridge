import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { scrapeArgaamNews } from '@/lib/argaam/scraper';
import { summarizeArticle } from '@/lib/argaam/summarizer';
import { sanitizeContent, sanitizeTitle } from '@/lib/sanitize';
import { saveArticle, listArticles, getArticlesCount } from '@/lib/supabase/financial-news';
import { rateLimit, getClientIP } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const ScrapeBodySchema = z.object({
  maxArticles: z.number().int().min(1).max(10).optional().default(5),
});

interface ScrapeResult {
  success: boolean;
  slug?: string;
  title?: string;
  error?: string;
}

export async function GET(): Promise<NextResponse> {
  try {
    const files = await listArticles();
    const total = await getArticlesCount();

    const filesWithMeta = files.map((f) => ({
      filename: f.slug,
      created: f.article_date || f.created_at?.slice(0, 10) || '',
      title: f.title,
    }));

    return NextResponse.json({
      status: 'ready',
      total_articles: total,
      latest_files: filesWithMeta,
    });
  } catch (err) {
    console.error('SCRAPE_STATUS_FAIL', err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: 'Failed to fetch status' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Auth: require CRON_SECRET in Bearer header
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const authHeader = req.headers.get('authorization');
  const expectedAuth = `Bearer ${cronSecret}`;
  if (authHeader !== expectedAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Rate limit: 1 scrape per 30 seconds per IP
  const ip = getClientIP(req);
  const limit = rateLimit(ip, { maxRequests: 1, windowMs: 30_000 });
  if (!limit.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    // Parse and validate body
    let maxArticles = 5;
    try {
      const body = await req.json();
      const parsed = ScrapeBodySchema.safeParse(body);
      if (parsed.success) {
        maxArticles = parsed.data.maxArticles;
      }
    } catch (err) {
      console.error('SCRAPE_BODY_PARSE', err instanceof Error ? err.message : err);
      // No body or invalid JSON — use default
    }

    const articles = await scrapeArgaamNews(maxArticles);

    if (articles.length === 0) {
      return NextResponse.json({
        success: true,
        total_scraped: 0,
        saved: 0,
        failed: 0,
        results: [],
        message: 'No articles found',
      });
    }

    const results: ScrapeResult[] = [];
    let savedCount = 0;
    let failedCount = 0;

    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];

      try {
        const summary = await summarizeArticle(article);

        const saved = await saveArticle({
          title: sanitizeTitle(summary.seo_title),
          original_title: sanitizeTitle(summary.original_title),
          summary: sanitizeContent(summary.seo_summary),
          full_content: sanitizeContent(article.full_content || ''),
          source_url: summary.source_url,
          article_date: summary.article_date,
          tags: summary.tags,
          scraped_at: article.scraped_at,
          video_url: summary.video_url,
        });

        savedCount++;
        results.push({
          success: true,
          slug: saved.slug,
          title: summary.seo_title,
        });
      } catch (err) {
        console.error('SCRAPE_ARTICLE_FAIL', err instanceof Error ? err.message : err);
        failedCount++;
        results.push({
          success: false,
          error: 'Processing failed',
          title: article.title?.slice(0, 60),
        });
      }
    }

    return NextResponse.json({
      success: true,
      total_scraped: articles.length,
      processed: savedCount + failedCount,
      saved: savedCount,
      failed: failedCount,
      results,
    });
  } catch (err) {
    console.error('SCRAPE_TOP_FAIL', err instanceof Error ? err.message : err);
    return NextResponse.json(
      { success: false, error: 'Scraping job failed' },
      { status: 500 }
    );
  }
}
