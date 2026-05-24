import { NextResponse } from 'next/server';
import { getArticles, getArticleBySlug } from '@/lib/supabase/financial-news';
import { getSupabaseUrl, getSupabaseAnonKey } from '@/lib/supabase/config';

export async function GET() {
  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();
  const keyPrefix = anonKey.slice(0, 10) + '...';

  // Test 1: getArticles (our refactored function)
  let articles: Awaited<ReturnType<typeof getArticles>> | undefined;
  let error: string | null = null;
  try {
    articles = await getArticles();
  } catch (e: any) {
    error = e.message + '\n' + (e.stack || '');
  }

  // Test 2: getArticleBySlug with first article's slug
  let slugTest: any = null;
  try {
    const firstSlug = articles?.[0]?.slug;
    if (firstSlug) {
      slugTest = await getArticleBySlug(firstSlug);
    }
  } catch (e: any) {
    slugTest = { _exception: e.message };
  }

  return NextResponse.json({
    supabaseUrl: url,
    anonKeyPrefix: keyPrefix,
    articleCount: articles?.length ?? 0,
    firstArticle: articles?.[0]?.slug || null,
    error,
    // Does getArticleBySlug work?
    slugTest: slugTest
      ? { found: true, title: slugTest.title?.slice(0, 60), slug: slugTest.slug?.slice(0, 60) }
      : { found: false },
  });
}
