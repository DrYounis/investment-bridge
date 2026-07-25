import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';

export interface GlossaryTerm {
  id: number;
  term_number: number;
  english_term: string;
  arabic_term: string;
  english_def: string;
  arabic_def: string;
  batch_number: number;
  batch_label: string;
  short_desc_en?: string | null;
  short_desc_ar?: string | null;
  example_en?: string | null;
  example_ar?: string | null;
  featured_meeting?: number | null;
  sent_at?: string | null;
}

export async function getAllTerms(supabase: SupabaseClient): Promise<GlossaryTerm[]> {
  const { data, error } = await supabase
    .from('marfa_glossary_terms')
    .select('*')
    .order('term_number', { ascending: true });

  if (error) {
    console.error('GLOSSARY_FETCH_ERROR', error.message);
    return [];
  }

  return (data || []) as GlossaryTerm[];
}
