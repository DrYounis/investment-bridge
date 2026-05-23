#!/usr/bin/env node

/**
 * Manual scrape CLI tool.
 *
 * Usage:
 *   npm run scrape -- --max=5
 *   npx tsx scripts/manual-scrape.ts --max=10
 *
 * Environment:
 *   Requires ANTHROPIC_API_KEY in .env.local
 */

import { scrapeArgaamNews } from '../lib/scraper';
import { summarizeArticle } from '../lib/summarizer';
import { saveToMarkdown } from '../lib/markdown';

async function main(): Promise<void> {
  // Parse --max argument
  const maxArg = process.argv.find((arg) => arg.startsWith('--max='));
  const maxArticles = maxArg ? parseInt(maxArg.split('=')[1], 10) : 5;

  console.log(`\n🚀 Manual Argaam Scraper`);
  console.log(`📋 Target: up to ${maxArticles} articles\n`);

  const startTime = Date.now();

  // Step 1: Scrape
  console.log('🔍 Step 1/3: Scraping Argaam...');
  const articles = await scrapeArgaamNews(maxArticles);

  if (articles.length === 0) {
    console.log('⚠️ No articles found.');
    process.exit(0);
  }

  // Step 2 & 3: Summarize + Save
  let saved = 0;
  let failed = 0;

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    console.log(`\n📰 [${i + 1}/${articles.length}] "${article.title.slice(0, 60)}..."`);

    try {
      const summary = await summarizeArticle(article);
      const result = await saveToMarkdown(article, summary);
      console.log(`   ✅ Saved: ${result.filename}`);
      saved++;
    } catch (err) {
      console.error(`   ❌ Failed:`, err);
      failed++;
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n✅ Done in ${elapsed}s — ${saved} saved, ${failed} failed\n`);
}

main().catch((err) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
