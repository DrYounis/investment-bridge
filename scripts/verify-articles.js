/**
 * Verify articles and check if video_url column exists using Supabase REST API.
 * Note: DDL migrations must be run via the Supabase Dashboard SQL Editor.
 *
 * Usage: node scripts/verify-articles.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing required env vars');
  process.exit(1);
}

const projectRef = new URL(SUPABASE_URL).hostname.split('.')[0];
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log(`Project: ${projectRef}`);
  console.log(`SQL Editor: https://supabase.com/dashboard/project/${projectRef}/sql/new\n`);

  // === Check if video_url column exists ===
  console.log('=== Checking video_url column ===\n');
  try {
    const { data, error } = await supabase
      .from('financial_news_articles')
      .select('id, title, video_url')
      .limit(1);

    if (error) {
      if (error.message && error.message.includes('video_url')) {
        console.log('❌ video_url column does NOT exist yet.');
        console.log('   Run this SQL in the dashboard:');
        console.log('   ALTER TABLE public.financial_news_articles ADD COLUMN IF NOT EXISTS video_url text;\n');
      } else {
        console.log('⚠️  Unexpected error:', error.message);
      }
    } else {
      console.log('✅ video_url column exists (query succeeded).');
    }
  } catch (err) {
    console.log('❌ Error checking column:', err.message);
  }

  // === Verify articles ===
  console.log('\n=== Articles in database ===\n');
  try {
    // Total count
    const { count, error: countErr } = await supabase
      .from('financial_news_articles')
      .select('*', { count: 'exact', head: true });

    if (countErr) {
      console.log('❌ Could not count articles:', countErr.message);
    } else {
      console.log(`Total articles: ${count}`);
    }

    // Latest 5 articles
    const { data: articles, error: listErr } = await supabase
      .from('financial_news_articles')
      .select('id, title, slug, created_at, published, video_url')
      .order('created_at', { ascending: false })
      .limit(5);

    if (listErr) {
      console.log('❌ Could not list articles:', listErr.message);
    } else if (!articles || articles.length === 0) {
      console.log('⚠️  No articles found in the database.');
    } else {
      console.log(`\nLatest ${articles.length} articles:`);
      console.log('─'.repeat(80));
      for (const a of articles) {
        console.log(`  Slug:      ${a.slug}`);
        console.log(`  Title:     ${(a.title || '').substring(0, 80)}`);
        console.log(`  Published: ${a.published}`);
        console.log(`  Created:   ${a.created_at}`);
        console.log(`  Video:     ${a.video_url ? a.video_url.substring(0, 70) : 'none'}`);
        console.log('─'.repeat(80));
      }

      // Count articles with video
      const videoArticles = articles.filter(a => a.video_url);
      console.log(`\nArticles with video embeds (in sample): ${videoArticles.length}/${articles.length}`);
      if (videoArticles.length > 0) {
        console.log('✅ Video embedding is working!');
      }
    }
  } catch (err) {
    console.log('❌ Error:', err.message);
  }

  // === Test the public endpoint ===
  console.log('\n=== Public page accessibility ===');
  console.log(`  /financial-news → https://marfa.sa/financial-news`);
  console.log(`  (Check this URL in your browser)`);
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
