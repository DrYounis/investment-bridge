/**
 * Run the glossary featured fields migration.
 * Usage: npx tsx scripts/run-glossary-migration.ts
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { config } from 'dotenv';
import { resolve } from 'node:path';

config({ path: resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function main() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing env vars');
    process.exit(1);
  }

  const svc = createClient(SUPABASE_URL, SUPABASE_KEY);
  const sql = readFileSync(
    join(process.cwd(), 'supabase/migrations/add_glossary_featured_fields.sql'),
    'utf-8'
  );

  // Execute each statement separately (split on semicolons)
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  for (const stmt of statements) {
    const { error } = await svc.rpc('exec_sql', { query: stmt + ';' });
    if (error) {
      // Try via REST if RPC doesn't work — individual ALTER TABLE statements
      console.log(`Statement: ${stmt.substring(0, 80)}…`);
      console.error(`  Error: ${error.message}`);
    } else {
      console.log(`✅ ${stmt.substring(0, 80)}…`);
    }
  }

  console.log('Migration complete. Verify in Supabase dashboard.');
}

main().catch(console.error);
