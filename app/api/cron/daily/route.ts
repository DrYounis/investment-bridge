import { scrapeArgaamNews } from '@/lib/argaam/scraper';
import { summarizeArticle } from '@/lib/argaam/summarizer';
import { sanitizeContent, sanitizeTitle } from '@/lib/sanitize';
import { saveArticle } from '@/lib/supabase/financial-news';

export const dynamic = 'force-dynamic';

export async function GET(req: Request): Promise<Response> {
  return handleCronTrigger(req);
}

export async function POST(req: Request): Promise<Response> {
  return handleCronTrigger(req);
}

async function handleCronTrigger(req: Request): Promise<Response> {
  try {
    // Auth: Bearer token only
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const isAuthorized = authHeader === `Bearer ${cronSecret}`;
    if (!isAuthorized) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const maxArticles = 5;
    const articles = await scrapeArgaamNews(maxArticles);
    let savedCount = 0;
    const errors: { article: string; stage: string; message: string }[] = [];

    for (const article of articles) {
      try {
        const summary = await summarizeArticle(article);
        try {
          await saveArticle({
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
        } catch (err) {
          errors.push({
            article: (summary.original_title || article.title || '').slice(0, 60),
            stage: 'save',
            message: err instanceof Error ? err.message : String(err),
          });
        }
      } catch (err) {
        errors.push({
          article: (article.title || '').slice(0, 60),
          stage: 'summarize',
          message: err instanceof Error ? err.message : String(err),
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        total_scraped: articles.length,
        saved: savedCount,
        failed: errors.length,
        errors,
        timestamp: new Date().toISOString(),
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: 'Cron job failed',
        message: err instanceof Error ? err.message : String(err),
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
