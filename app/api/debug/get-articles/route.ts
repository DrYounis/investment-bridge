import { NextResponse } from 'next/server';
import { getArticles } from '@/lib/supabase/financial-news';
import { getSupabaseUrl, getSupabaseAnonKey } from '@/lib/supabase/config';

export async function GET() {
  const url = getSupabaseUrl();
  const keyPrefix = getSupabaseAnonKey().slice(0, 10) + '...';

  let articles;
  let error: string | null = null;
  try {
    articles = await getArticles();
  } catch (e: any) {
    error = e.message + '\n' + (e.stack || '');
  }

  return NextResponse.json({
    supabaseUrl: url,
    anonKeyPrefix: keyPrefix,
    articleCount: articles?.length ?? 0,
    firstArticle: articles?.[0]?.slug || null,
    error,
  });
}
