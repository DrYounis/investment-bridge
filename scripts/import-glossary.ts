/**
 * Parse 300_business_terms_bilingual.md and upsert into marfa_glossary_terms.
 *
 * Usage: npx tsx scripts/import-glossary.ts
 * Requires: SUPABASE_SERVICE_ROLE_KEY in .env.local
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { config } from 'dotenv';
import { resolve } from 'node:path';

// Load .env.local before reading env vars
config({ path: resolve(process.cwd(), '.env.local') });

// Read env vars directly — no Next.js lib imports (avoids server-only crash)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function createServiceClient() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
  }
  return createClient(SUPABASE_URL, SUPABASE_KEY);
}

interface GlossaryTerm {
  term_number: number;
  english_term: string;
  arabic_term: string;
  english_def: string;
  arabic_def: string;
  batch_number: number;
  batch_label: string;
}

function parseTerms(markdown: string): GlossaryTerm[] {
  const lines = markdown.split('\n');
  const terms: GlossaryTerm[] = [];

  let currentBatch = 0;
  let currentBatchLabel = '';
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Batch header: ## Batch X of 30 — Label (N–M)
    const batchMatch = line.match(/^## Batch (\d+) of 30 — (.+?) \(\d+–\d+\)$/);
    if (batchMatch) {
      currentBatch = parseInt(batchMatch[1], 10);
      currentBatchLabel = batchMatch[2].trim();
      i++;
      continue;
    }

    // Term header: ### N. English Term | Arabic Term
    const termMatch = line.match(/^### (\d+)\. (.+?) \| (.+)$/);
    if (termMatch && currentBatch > 0) {
      const termNumber = parseInt(termMatch[1], 10);
      const englishTerm = termMatch[2].trim();
      const arabicTerm = termMatch[3].trim();

      // Move past blank line
      i++;
      while (i < lines.length && lines[i].trim() === '') i++;

      // Read EN definition: starts with **EN:**, continues until blank line or **AR:**
      let englishDef = '';
      if (i < lines.length && lines[i].startsWith('**EN:**')) {
        englishDef = lines[i].replace(/^\*\*EN:\*\*\s*/, '').trim();
        i++;
        while (i < lines.length && lines[i].trim() !== '' && !lines[i].startsWith('**AR:**')) {
          englishDef += ' ' + lines[i].trim();
          i++;
        }
      }

      // Skip blank lines between EN and AR
      while (i < lines.length && lines[i].trim() === '') i++;

      // Read AR definition: starts with **AR:**, continues until blank line or ---
      let arabicDef = '';
      if (i < lines.length && lines[i].startsWith('**AR:**')) {
        arabicDef = lines[i].replace(/^\*\*AR:\*\*\s*/, '').trim();
        i++;
        while (i < lines.length && lines[i].trim() !== '' && !lines[i].startsWith('---') && !lines[i].startsWith('### ') && !lines[i].startsWith('## ')) {
          arabicDef += ' ' + lines[i].trim();
          i++;
        }
      }

      terms.push({
        term_number: termNumber,
        english_term: englishTerm,
        arabic_term: arabicTerm,
        english_def: englishDef,
        arabic_def: arabicDef,
        batch_number: currentBatch,
        batch_label: currentBatchLabel,
      });

      // Skip trailing --- and audit notes until next entry
      while (i < lines.length && lines[i].trim() !== '' && !lines[i].startsWith('### ') && !lines[i].startsWith('## ')) i++;
      while (i < lines.length && lines[i].trim() === '') i++;

      continue;
    }

    i++;
  }

  return terms;
}

async function main() {
  const filePath = join(process.cwd(), '300_business_terms_bilingual.md');
  const markdown = readFileSync(filePath, 'utf-8');
  const terms = parseTerms(markdown);

  console.log(`Parsed ${terms.length} terms from file.`);

  if (terms.length < 300) {
    console.error(`Expected 300 terms, got ${terms.length}. Aborting.`);
    process.exit(1);
  }

  const svc = createServiceClient();

  // Upsert in batches of 50
  const BATCH_SIZE = 50;
  for (let start = 0; start < terms.length; start += BATCH_SIZE) {
    const chunk = terms.slice(start, start + BATCH_SIZE);
    const { error } = await svc.from('marfa_glossary_terms').upsert(chunk, {
      onConflict: 'term_number',
      ignoreDuplicates: false,
    });

    if (error) {
      console.error(`Batch ${start / BATCH_SIZE + 1} failed:`, error.message);
      process.exit(1);
    }

    console.log(`Upserted terms ${chunk[0].term_number}–${chunk[chunk.length - 1].term_number}`);
  }

  console.log('Done. All 300 terms imported.');
}

main().catch((err) => {
  console.error('Import failed:', err);
  process.exit(1);
});
