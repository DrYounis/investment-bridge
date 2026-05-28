/**
 * Script to:
 * 1. Run the video_url migration
 * 2. Verify articles are visible
 * 3. Execute SQL directly against the production DB
 *
 * Usage: node scripts/run-migration-and-verify.js
 * Requires: .env.local with SUPABASE_SERVICE_ROLE_KEY set
 */

require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

// Extract project ref from URL (e.g., https://wxvkzutexitcllyewbnw.supabase.co)
const projectRef = new URL(SUPABASE_URL).hostname.split('.')[0];
console.log(`Project ref: ${projectRef}`);

// Supabase connection pooler (Transaction mode for DDL)
const pool = new Pool({
  host: `aws-0-eu-central-1.pooler.supabase.com`,
  port: 6543,
  database: 'postgres',
  user: `postgres.${projectRef}`,
  password: SERVICE_ROLE_KEY,
  ssl: { rejectUnauthorized: false },
});

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log('=== STEP 1: Run video_url migration ===\n');

  const migrationSQL = `
    ALTER TABLE public.financial_news_articles
    ADD COLUMN IF NOT EXISTS video_url text;
  `;

  try {
    const result = await pool.query(migrationSQL);
    console.log('✅ Migration applied successfully (or column already exists).');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    // Continue anyway — column may already exist
  }

  console.log('\n=== STEP 2: Verify column exists ===\n');

  try {
    const colCheck = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'financial_news_articles'
        AND column_name = 'video_url';
    `);

    if (colCheck.rows.length > 0) {
      console.log('✅ video_url column exists:');
      console.log(`   Type: ${colCheck.rows[0].data_type}`);
      console.log(`   Nullable: ${colCheck.rows[0].is_nullable}`);
    } else {
      console.log('❌ video_url column does NOT exist!');
    }
  } catch (err) {
    console.error('Error checking column:', err.message);
  }

  console.log('\n=== STEP 3: Verify articles are visible ===\n');

  try {
    // Get total count
    const countResult = await pool.query(
      'SELECT COUNT(*) as total FROM public.financial_news_articles'
    );
    console.log(`Total articles in DB: ${countResult.rows[0].total}`);

    // Get latest 5 articles
    const articles = await pool.query(`
      SELECT id, title, slug, created_at, published, video_url
      FROM public.financial_news_articles
      ORDER BY created_at DESC
      LIMIT 5;
    `);

    console.log('\nLatest 5 articles:');
    console.log('─'.repeat(80));
    for (const a of articles.rows) {
      console.log(`  ID: ${a.id}`);
      console.log(`  Title: ${(a.title || '').substring(0, 80)}`);
      console.log(`  Slug: ${a.slug}`);
      console.log(`  Published: ${a.published}`);
      console.log(`  Created: ${a.created_at}`);
      console.log(`  Has video: ${a.video_url ? '✅ ' + a.video_url.substring(0, 60) : '❌'}`);
      console.log('─'.repeat(80));
    }

    // Check for articles with video_url
    const videoCount = await pool.query(
      `SELECT COUNT(*) as total FROM public.financial_news_articles WHERE video_url IS NOT NULL`
    );
    console.log(`\nArticles with video embeds: ${videoCount.rows[0].total}`);

  } catch (err) {
    console.error('Error verifying articles:', err.message);
  }

  console.log('\n=== STEP 4: Execute custom SQL (if any) ===\n');
  console.log('Connection is ready. Use this pool to run additional SQL queries.');
  console.log('Example: await pool.query("SELECT ...")');

  await pool.end();
  console.log('\n✅ Done. Database connection closed.');
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
