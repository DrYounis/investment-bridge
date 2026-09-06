// Backfill founding students' attendance for meetings 1–11 (historical).
// Service-role only, no email, standalone + idempotent (upsert).
// Run with: npx --yes tsx scripts/backfill-founding-attendance.ts

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'node:path';
import { getMeetingDate } from '../app/components/marfa/scheduleData';

config({ path: resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const svc = createClient(SUPABASE_URL, SUPABASE_KEY);

// Actual attendees of meetings 1–11 (confirmed 2026-09-06).
const TARGET_STUDENTS = [2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 16];
const FIRST_MEETING = 1;
const LAST_MEETING = 11; // meeting 12 (Sep 11) has not occurred yet

async function main() {
  // 1. Fetch founding students
  const { data: profiles, error } = await svc
    .from('profiles')
    .select('id, student_number, full_name')
    .in('student_number', TARGET_STUDENTS)
    .order('student_number', { ascending: true });

  if (error) {
    console.error('profiles fetch error:', error.message);
    process.exit(1);
  }

  const found = new Set((profiles || []).map((p) => p.student_number));
  const missing = TARGET_STUDENTS.filter((n) => !found.has(n));

  if (missing.length > 0) {
    console.error(`Stopping — missing student_number(s): ${missing.join(', ')} (found ${profiles?.length || 0}/${TARGET_STUDENTS.length}).`);
    process.exit(1);
  }

  console.log(`Found ${profiles!.length} attendees (student_number ${TARGET_STUDENTS.join(',')}).`);

  // 2. Backfill meetings 1–11
  const summary: { student_number: number; full_name: string | null; inserted: number; errors: string[] }[] = [];

  for (const p of profiles!) {
    let inserted = 0;
    const errors: string[] = [];
    for (let meeting = FIRST_MEETING; meeting <= LAST_MEETING; meeting++) {
      const attended_at = getMeetingDate(meeting - 1).toISOString();
      const { error: insErr } = await svc
        .from('majlis_attendance')
        .upsert(
          { meeting_number: meeting, profile_id: p.id, attended_at, recorded_by: null },
          { onConflict: 'meeting_number,profile_id' }
        );
      if (insErr) {
        errors.push(`meeting ${meeting}: ${insErr.message}`);
      } else {
        inserted++;
      }
    }
    summary.push({ student_number: p.student_number, full_name: p.full_name, inserted, errors });
  }

  // 3. Summary table
  console.log('\n=== Backfill summary ===');
  const totalInserted = summary.reduce((s, r) => s + r.inserted, 0);
  for (const r of summary) {
    const status = r.errors.length === 0 ? 'OK' : `ERRORS (${r.errors.length})`;
    console.log(`  #${r.student_number} | ${r.full_name || '(no name)'} | ${r.inserted} inserted | ${status}`);
    for (const e of r.errors) console.log(`      ${e}`);
  }
  const expected = TARGET_STUDENTS.length * (LAST_MEETING - FIRST_MEETING + 1);
  console.log(`\nTotal upserted: ${totalInserted} (expected ${expected}).`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
