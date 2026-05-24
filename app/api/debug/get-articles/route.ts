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

  // Test 3: getArticleBySlug with first article's slug
  let slugStatus = 0;
  let slugResult: any = null;
  try {
    const firstSlug = articles?.[0]?.slug;
    if (firstSlug) {
      const slugQuery = `${url}/rest/v1/financial_news_articles?select=slug,title&slug=eq.${encodeURIComponent(firstSlug)}`;
      const slugRes = await fetch(slugQuery, {
        headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}`, Accept: 'application/json' },
      });
      slugStatus = slugRes.status;
      const slugData = await slugRes.json();
      slugResult = {
        status: slugStatus,
        found: Array.isArray(slugData) ? slugData.length : 'not-array',
        firstTitle: Array.isArray(slugData) ? slugData[0]?.title?.slice(0, 60) : null,
      };
    } else {
      slugResult = { error: 'no first article slug available' };
    }
  } catch (e: any) {
    slugResult = { error: e.message };
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
    // by-slug fetch test
    slugFetch: slugResult,
    // key diagnostics
    keyDiagnostics: {
      length: anonKey.length,
      startsWith: anonKey.slice(0, 20),
      endsWith: anonKey.slice(-10),
      hasWhitespace: anonKey.trim().length !== anonKey.length,
      isJWT: anonKey.startsWith('eyJ'),
    },
  });
}
