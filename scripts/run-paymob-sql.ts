// Execute Paymob SQL schema against Supabase using REST API
// Run: npx tsx scripts/run-paymob-sql.ts

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { config } from 'dotenv';

config({ path: resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing env vars');
  process.exit(1);
}

async function runSql(query: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/sql`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
    },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
  }
  return res;
}

async function main() {
  const sql = readFileSync(
    resolve(process.cwd(), '../payment_code example/sql/01_schema_and_seed.sql'),
    'utf8'
  );

  // Execute individual statements
  const statements = sql
    .split('\n')
    .filter(line => !line.trim().startsWith('--') && line.trim())
    .join('\n')
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  let ok = 0;

  for (const stmt of statements) {
    try {
      await runSql(stmt);
      ok++;
      console.log(`✅ ${ok}/${statements.length}`);
    } catch (err: unknown) {
      const msg = (err as Error).message || '';
      if (msg.includes('already exists') || msg.includes('duplicate') || msg.includes('42701') || msg.includes('42710')) {
        ok++;
        console.log(`⏭️  ${ok}/${statements.length} (skipped)`);
      } else {
        console.error(`❌ ${ok + 1}/${statements.length}: ${msg}`);
      }
    }
  }

  console.log(`\n✅ Done — ${ok}/${statements.length} statements executed`);
}

main().catch(err => {
  console.error('FATAL:', err.message);
  process.exit(1);
});
