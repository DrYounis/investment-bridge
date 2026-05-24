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

  // Test 3: try with apikey only, no Authorization header
  let raw2Status = 0;
  let raw2Text = '';
  try {
    const select = 'slug,title';
    const raw2Res = await fetch(
      `${url}/rest/v1/financial_news_articles?select=${select}&limit=5`,
      {
        headers: {
          apikey: anonKey,
          Accept: 'application/json',
        },
      }
    );
    raw2Status = raw2Res.status;
    raw2Text = await raw2Res.text();
  } catch (e: any) {
    raw2Text = e.message;
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
    rawFetchApikeyOnly: {
      status: raw2Status,
      textPreview: raw2Text.slice(0, 500),
    },
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
