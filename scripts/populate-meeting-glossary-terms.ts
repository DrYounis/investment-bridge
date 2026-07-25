/**
 * Populate meeting_glossary_terms junction table by matching glossary
 * terms against each meeting's glossaryKeywords.
 *
 * Usage: npx tsx scripts/populate-meeting-glossary-terms.ts
 *
 * Re-run whenever glossaryKeywords in scheduleData change or new terms are added.
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'node:path';
import { SCHEDULE_DATA } from '../app/components/marfa/scheduleData';

config({ path: resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function main() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const svc = createClient(SUPABASE_URL, SUPABASE_KEY);

  // 1. Fetch all glossary terms
  const { data: allTerms, error: termErr } = await svc
    .from('marfa_glossary_terms')
    .select('term_number, arabic_term, english_term, arabic_def')
    .order('term_number', { ascending: true });

  if (termErr || !allTerms) {
    console.error('Failed to fetch glossary terms:', termErr?.message);
    process.exit(1);
  }

  console.log(`📚 Loaded ${allTerms.length} glossary terms\n`);

  // 2. Clear existing junction table
  const { error: delErr } = await svc
    .from('meeting_glossary_terms')
    .delete()
    .neq('meeting_number', 0); // delete all

  if (delErr) {
    console.error('Failed to clear junction table:', delErr.message);
    process.exit(1);
  }

  // 3. Match each meeting against all terms
  const rows: { meeting_number: number; term_number: number; relevance_score: number }[] = [];
  const meetingStats: { meeting: number; count: number; topTerms: string[] }[] = [];

  for (let m = 1; m <= 14; m++) {
    const entry = SCHEDULE_DATA[m - 1];
    const keywords = entry?.glossaryKeywords;

    if (!keywords || keywords.length === 0) {
      console.log(`⏭️  Meeting ${m}: no keywords — skipping`);
      continue;
    }

    const scored: { term_number: number; arabic_term: string; score: number }[] = [];

    for (const t of allTerms) {
      const haystack = `${t.arabic_term} ${t.arabic_def} ${t.english_term}`;
      let score = 0;
      for (const kw of keywords) {
        if (haystack.includes(kw)) score++;
      }
      if (score > 0) {
        scored.push({ term_number: t.term_number, arabic_term: t.arabic_term, score });
      }
    }

    scored.sort((a, b) => b.score - a.score);

    for (const s of scored) {
      rows.push({
        meeting_number: m,
        term_number: s.term_number,
        relevance_score: s.score,
      });
    }

    const topNames = scored.slice(0, 3).map(s => s.arabic_term);
    meetingStats.push({ meeting: m, count: scored.length, topTerms: topNames });
    console.log(`📋 Meeting ${m} (${entry.topic}): ${scored.length} terms matched — top: ${topNames.join('، ')}`);
  }

  // 4. Batch insert
  if (rows.length === 0) {
    console.log('\n⚠️  No terms matched any meeting. Check glossaryKeywords.');
    process.exit(0);
  }

  // Insert in batches of 100
  for (let i = 0; i < rows.length; i += 100) {
    const batch = rows.slice(i, i + 100);
    const { error } = await svc.from('meeting_glossary_terms').upsert(batch, {
      onConflict: 'meeting_number, term_number',
    });
    if (error) {
      console.error(`Batch insert error (offset ${i}):`, error.message);
    }
  }

  console.log(`\n✅ Done! ${rows.length} term-meeting links created across 14 meetings.`);

  // 5. Summary
  console.log('\n📊 Meeting → Terms count:');
  for (const s of meetingStats) {
    console.log(`  Meeting ${s.meeting}: ${s.count} terms`);
  }
}

main().catch(console.error);
