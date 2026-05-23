import { scrapeArgaamNews } from '@/lib/argaam/scraper';
import { summarizeArticle } from '@/lib/argaam/summarizer';
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
    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      console.warn('⚠️ CRON_SECRET not configured — allowing trigger without token');
    } else if (token !== cronSecret) {
      console.error('❌ Unauthorized cron trigger — invalid token');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('\n⏰ ── Scheduled Scrape Triggered ──\n');

    const maxArticles = 5;
    const articles = await scrapeArgaamNews(maxArticles);
    let savedCount = 0;

    for (const article of articles) {
      try {
        const summary = await summarizeArticle(article);
        await saveArticle({
          title: summary.seo_title,
          original_title: summary.original_title,
          summary: summary.seo_summary,
          full_content: article.full_content,
          source_url: summary.source_url,
          article_date: summary.article_date,
          tags: summary.tags,
          scraped_at: article.scraped_at,
        });
        savedCount++;
      } catch (err) {
        console.error(`❌ Cron: failed to process article:`, err);
      }
    }

    console.log(`\n✅ ── Cron Complete: ${savedCount}/${articles.length} saved ──\n`);

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
  } catch (err) {
    console.error('❌ Cron job error:', err);
    return new Response(
      JSON.stringify({ error: 'Cron job failed', details: String(err) }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
