import { NextRequest, NextResponse } from 'next/server';
import { scrapeArgaamNews } from '@/lib/argaam/scraper';
import { summarizeArticle } from '@/lib/argaam/summarizer';
import { saveArticle, listArticles, getArticlesCount } from '@/lib/supabase/financial-news';

export const dynamic = 'force-dynamic';

interface ScrapeResult {
  success: boolean;
  slug?: string;
  title?: string;
  original_title?: string;
  source_url?: string;
  error?: string;
}

export async function GET(_req: NextRequest): Promise<NextResponse> {
  try {
    const files = await listArticles();
    const total = await getArticlesCount();

    const filesWithMeta = files.map((f) => ({
      filename: f.slug,
      created: f.article_date || f.created_at?.slice(0, 10) || '',
      title: f.title,
      original_title: f.original_title,
      source_url: f.source_url,
    }));

    return NextResponse.json({
      status: 'ready',
      total_articles: total,
      content_dir: 'Supabase: financial_news_articles',
      latest_files: filesWithMeta,
      api_key_configured: !!process.env.ANTHROPIC_API_KEY,
      cron_secret_configured: !!process.env.CRON_SECRET,
    });
  } catch (err) {
    console.error('❌ Status check error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch status', details: String(err) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  console.log('\n🚀 ── Financial News Scrape Job Started ──\n');

  try {
    let maxArticles = 5;

    try {
      const body = await req.json();
      if (body.maxArticles !== undefined) {
        maxArticles = Math.min(Math.max(1, parseInt(String(body.maxArticles), 10)), 10);
      }
    } catch {
      // No body or invalid JSON — use default
    }

    console.log(`📋 Target: ${maxArticles} articles\n`);

    console.log('🔍 Step 1/3: Scraping financial news...');
    const articles = await scrapeArgaamNews(maxArticles);
    console.log(`   Scraped ${articles.length} articles\n`);

    if (articles.length === 0) {
      return NextResponse.json({
        success: true,
        total_scraped: 0,
        processed: 0,
        saved: 0,
        failed: 0,
        results: [],
        message: 'No articles found — Argaam may require JavaScript rendering. Try again later.',
      });
    }

    const results: ScrapeResult[] = [];
    let savedCount = 0;
    let failedCount = 0;

    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      console.log(`\n📰 [${i + 1}/${articles.length}] Processing: ${article.title.slice(0, 60)}...`);

      try {
        console.log('   🤖 Step 2/3: Summarizing...');
        const summary = await summarizeArticle(article);

        console.log('   💾 Step 3/3: Saving to Supabase...');
        const saved = await saveArticle({
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
        results.push({
          success: true,
          slug: saved.slug,
          title: summary.seo_title,
          original_title: article.title,
          source_url: article.url,
        });
      } catch (err) {
        failedCount++;
        const errMsg = String(err);
        console.error(`   ❌ Failed:`, errMsg);
        results.push({
          success: false,
          error: errMsg,
          title: `❌ ${errMsg.slice(0, 80)}`,
          original_title: article.title,
          source_url: article.url,
        });
      }
    }

    console.log(`\n✅ ── Job Complete: ${savedCount} saved, ${failedCount} failed ──\n`);

    return NextResponse.json({
      success: true,
      total_scraped: articles.length,
      processed: savedCount + failedCount,
      saved: savedCount,
      failed: failedCount,
      results,
    });
  } catch (err) {
    console.error('❌ Scrape job error:', err);
    return NextResponse.json(
      { success: false, error: 'Scraping job failed', details: String(err) },
      { status: 500 }
    );
  }
}
