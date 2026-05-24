/**
 * One-shot script: strip JavaScript garbage from existing articles.
 * Run with: npx tsx scripts/clean_js_from_articles.ts
 */
import 'dotenv/config';
import { sanitizeContent } from '../lib/sanitize';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function main() {
  // Fetch all articles
  const res = await fetch(
    `${URL}/rest/v1/financial_news_articles?select=id,slug,title,summary,full_content`,
    {
      headers: {
        apikey: KEY,
        Authorization: `Bearer ${KEY}`,
        Accept: 'application/json',
      },
    }
  );

  if (!res.ok) {
    console.error('Fetch failed:', res.status, await res.text());
    process.exit(1);
  }

  const articles: any[] = await res.json();
  console.log(`Fetched ${articles.length} articles`);

  let cleaned = 0;
  let skipped = 0;

  for (const article of articles) {
    const newSummary = sanitizeContent(article.summary || '');
    const newFull = sanitizeContent(article.full_content || '');

    const summaryChanged = newSummary !== (article.summary || '');
    const fullChanged = newFull !== (article.full_content || '');

    if (!summaryChanged && !fullChanged) {
      skipped++;
      continue;
    }

    // Update via PATCH
    const patchRes = await fetch(
      `${URL}/rest/v1/financial_news_articles?id=eq.${article.id}`,
      {
        method: 'PATCH',
        headers: {
          apikey: KEY,
          Authorization: `Bearer ${KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: newSummary,
          full_content: newFull || null,
        }),
      }
    );

    if (patchRes.ok) {
      cleaned++;
      console.log(`✅ Cleaned: ${article.slug?.slice(0, 60)}`);
    } else {
      console.error(`❌ Failed: ${article.slug?.slice(0, 60)} — ${patchRes.status}`);
    }
  }

  console.log(`\nDone. Cleaned: ${cleaned}, Skipped (already clean): ${skipped}`);
}

main().catch(console.error);
