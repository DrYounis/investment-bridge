export async function GET(req: Request): Promise<Response> {
  return handleCronTrigger(req);
}

export async function POST(req: Request): Promise<Response> {
  return handleCronTrigger(req);
}

async function handleCronTrigger(req: Request): Promise<Response> {
  try {
    // Validate secret token
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

    // Dynamically import the scraping logic (only runs on server)
    const { scrapeArgaamNews } = await import('@/lib/scraper');
    const { summarizeArticle } = await import('@/lib/summarizer');
    const { saveToMarkdown } = await import('@/lib/markdown');

    const maxArticles = 5;
    const articles = await scrapeArgaamNews(maxArticles);
    let savedCount = 0;

    for (const article of articles) {
      try {
        const summary = await summarizeArticle(article);
        await saveToMarkdown(article, summary);
        savedCount++;
      } catch (err) {
        console.error(`❌ Cron: failed to process article:`, err);
      }
    }

    console.log(`\n✅ ── Cron Complete: ${savedCount}/${articles.length} saved ──\n`);

    const result = {
      success: true,
      total_scraped: articles.length,
      saved: savedCount,
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
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
