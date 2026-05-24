import { NextResponse } from 'next/server';
import { getArticles } from '@/lib/supabase/financial-news';
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

  // Test 2: direct raw fetch to PostgREST (bypasses everything)
  let rawStatus = 0;
  let rawText = '';
  let rawError = '';
  try {
    const select = 'slug,title';
    const rawRes = await fetch(
      `${url}/rest/v1/financial_news_articles?select=${select}&limit=5`,
      {
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
          Accept: 'application/json',
        },
      }
    );
    rawStatus = rawRes.status;
    rawText = await rawRes.text();
  } catch (e: any) {
    rawError = e.message;
  }

  return NextResponse.json({
    supabaseUrl: url,
    anonKeyPrefix: keyPrefix,
    // getArticles result
    articleCount: articles?.length ?? 0,
    firstArticle: articles?.[0]?.slug || null,
    error,
    // raw fetch result
    rawFetch: {
      status: rawStatus,
      textPreview: rawText.slice(0, 1000),
      textLength: rawText.length,
      error: rawError || null,
    },
  });
}
