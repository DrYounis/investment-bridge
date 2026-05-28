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
    // Auth: allow Vercel cron (x-vercel-cron header) OR valid token
    const isVercelCron = req.headers.get('x-vercel-cron') !== null;
    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // If no CRON_SECRET is configured, reject all requests
    if (!cronSecret) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Allow Vercel cron OR valid token (query or Bearer header)
    const isTokenValid =
      token === cronSecret ||
      authHeader === `Bearer ${cronSecret}`;

    if (!isVercelCron && !isTokenValid) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const maxArticles = 5;
    const articles = await scrapeArgaamNews(maxArticles);
    let savedCount = 0;

    for (const article of articles) {
      try {
        const summary = await summarizeArticle(article);
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
      } catch {
        // Continue to next article on failure
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        total_scraped: articles.length,
        saved: savedCount,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: 'Cron job failed' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
