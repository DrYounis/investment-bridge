import { scrapeArgaamNews } from '../lib/argaam/scraper';
import { summarizeArticle } from '../lib/argaam/summarizer';
import { sanitizeContent, sanitizeTitle } from '../lib/sanitize';
import { getSupabaseUrl, getSupabaseServiceKey } from '../lib/supabase/config';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u0621-\u064A\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .slice(0, 80) + '-' + Date.now().toString(36);
}

async function main() {
  console.log('\n🚀 Scraping Argaam for marfa.sa...\n');
  const start = Date.now();
  const articles = await scrapeArgaamNews(10);

  if (articles.length === 0) {
    console.log('⚠️ No articles found.');
    return;
  }

  const supabaseUrl = getSupabaseUrl();
  const serviceKey = getSupabaseServiceKey();

  let saved = 0;
  for (let i = 0; i < articles.length; i++) {
    const a = articles[i];
    console.log(`📰 [${i + 1}/${articles.length}] ${a.title.slice(0, 60)}...`);
    try {
      const summary = await summarizeArticle(a);
      const slug = slugify(sanitizeTitle(summary.seo_title));

      const res = await fetch(`${supabaseUrl}/rest/v1/financial_news_articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${serviceKey}`,
          'apikey': serviceKey,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          slug,
          title: sanitizeTitle(summary.seo_title),
          original_title: sanitizeTitle(summary.original_title),
          summary: sanitizeContent(summary.seo_summary),
          full_content: sanitizeContent(a.full_content || ''),
          source_url: summary.source_url,
          article_date: summary.article_date,
          tags: summary.tags,
          category: 'financial-news',
          scraped_at: a.scraped_at,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error(`   ❌ ${res.status}: ${err.message || res.statusText}`);
      } else {
        saved++;
        console.log('   ✅ saved');
      }
    } catch (err: any) {
      console.error(`   ❌ ${err.message}`);
    }
  }
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n✅ Done in ${elapsed}s — ${saved}/${articles.length} saved\n`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
