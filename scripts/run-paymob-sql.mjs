// Execute Paymob SQL via Supabase SQL API (HTTPS)
// Run: cd investment-bridge && node --env-file=.env.local scripts/run-paymob-sql.mjs

import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing env vars');
  process.exit(1);
}

async function runSql(query) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'apikey': SUPABASE_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`);
  }
  return res;
}

async function main() {
  const sqlFile = resolve(process.cwd(), '../payment_code example/sql/01_schema_and_seed.sql');
  const sql = readFileSync(sqlFile, 'utf8');

  const statements = sql
    .split(';')
    .map(s => s.replace(/--.*$/gm, '').trim())
    .filter(s => s.length > 0 && !s.match(/^\/\*/))
    .filter(s => !s.startsWith('DO $$')); // Skip DO blocks — api doesn't support them

  console.log(`Executing ${statements.length} statements...`);

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i] + ';';
    try {
      await runSql(stmt);
      console.log(`✅ ${i + 1}/${statements.length}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('already exists') || msg.includes('duplicate')) {
        console.log(`⏭️  ${i + 1}/${statements.length} (already exists)`);
      } else if (msg.includes('404') || msg.includes('Could not find')) {
        console.log(`⚠️  ${i + 1}/${statements.length} (not supported via API — run in SQL Editor)`);
      } else {
        console.error(`❌ ${i + 1}/${statements.length}: ${msg}`);
      }
    }
  }

  // Verify
  const checkRes = await fetch(`${SUPABASE_URL}/rest/v1/products?select=name,price,interval`, {
    headers: { 'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '', 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}` }
  });
  if (checkRes.ok) {
    const prods = await checkRes.json();
    console.log(`\n🛒 Products: ${prods.length} rows`);
    prods.forEach(p => console.log(`   ${p.name} — ${p.price} SAR / ${p.interval}`));
  } else {
    console.log('\n⚠️  Could not verify — run in SQL Editor for full execution');
  }

  // Save migration file
  const dest = resolve(process.cwd(), 'supabase/migrations/20260725_paymob_schema.sql');
  mkdirSync(resolve(process.cwd(), 'supabase/migrations'), { recursive: true });
  writeFileSync(dest, sql);
  console.log(`\n📁 Migration saved: supabase/migrations/20260725_paymob_schema.sql`);
}

main().catch(err => { console.error('FATAL:', err); process.exit(1); });
