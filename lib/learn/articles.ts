import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import { TOPICS } from './taxonomy';

export interface KnowledgeArticle {
  id: string;
  slug: string;
  title_ar: string;
  category: string;
  summary_ar: string;
  content_ar: string;
  reading_minutes: number;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export async function getPublishedArticles(supabase: SupabaseClient, category?: string) {
  let q = supabase
    .from('marfa_knowledge_articles')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (category) q = q.eq('category', category);
  const { data } = await q;
  return (data || []) as KnowledgeArticle[];
}

export async function getArticleBySlug(supabase: SupabaseClient, slug: string) {
  const { data } = await supabase
    .from('marfa_knowledge_articles')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  return (data || null) as KnowledgeArticle | null;
}

export async function getRelatedArticles(supabase: SupabaseClient, category: string, excludeSlug: string) {
  const { data } = await supabase
    .from('marfa_knowledge_articles')
    .select('id, slug, title_ar, category, summary_ar, reading_minutes')
    .eq('category', category)
    .eq('status', 'published')
    .neq('slug', excludeSlug)
    .limit(3)
    .order('created_at', { ascending: false });
  return (data || []) as KnowledgeArticle[];
}

export async function getAllArticles(supabase: SupabaseClient) {
  const { data } = await supabase
    .from('marfa_knowledge_articles')
    .select('*')
    .order('created_at', { ascending: false });
  return (data || []) as KnowledgeArticle[];
}

export async function upsertArticle(supabase: SupabaseClient, article: Partial<KnowledgeArticle>) {
  const { error } = await supabase
    .from('marfa_knowledge_articles')
    .upsert(article, { onConflict: 'slug' });
  return !error;
}

export async function deleteArticle(supabase: SupabaseClient, id: string) {
  const { error } = await supabase.from('marfa_knowledge_articles').delete().eq('id', id);
  return !error;
}

export async function getArticleById(supabase: SupabaseClient, id: string) {
  const { data } = await supabase
    .from('marfa_knowledge_articles')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  return (data || null) as KnowledgeArticle | null;
}

export async function getPublishedSlugs(supabase: SupabaseClient) {
  const { data } = await supabase
    .from('marfa_knowledge_articles')
    .select('slug, category')
    .eq('status', 'published');
  return (data || []) as { slug: string; category: string }[];
}
