import { getSupabaseUrl, getSupabaseAnonKey } from './config';
import { createServiceClient } from './service';

// ── Types ──────────────────────────────────────────────────────────

export interface FinancialNewsArticle {
  id: string;
  slug: string;
  title: string;
  original_title: string | null;
  summary: string;
  full_content: string | null;
  source_url: string | null;
  article_date: string | null;
  tags: string[];
  category: string;
  seo_keywords: string | null;
  scraped_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ArticleListingItem {
  slug: string;
  title: string;
  original_title: string;
  source_url: string;
  date: string;
  tags: string[];
  excerpt: string;
}

// ── Helpers ────────────────────────────────────────────────────────

function generateSlug(title: string, date: string): string {
  const clean = title
    .replace(/[^\u0600-\u06FF\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase()
    .slice(0, 60);
  const timestamp = Date.now().toString().slice(-6);
  return `${date}-${clean}-${timestamp}`;
}

// ── Read Operations (Public) ───────────────────────────────────────

export async function getArticles(): Promise<ArticleListingItem[]> {
  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();
  const keyPrefix = anonKey.slice(0, 10) + '...';
  console.log('🔍 getArticles: url=', url, 'key_prefix=', keyPrefix);

  // Build PostgREST query directly to bypass any @supabase/supabase-js
  // client-side issues in the Next.js serverless runtime.
  const select = 'slug,title,original_title,source_url,article_date,tags,summary,created_at';
  const query = `${url}/rest/v1/financial_news_articles?select=${encodeURIComponent(select)}&order=article_date.desc&order=created_at.desc&limit=50`;

  let data: any[] | null = null;

  try {
    const response = await fetch(query, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        Accept: 'application/json',
      },
      // Next.js extends fetch with this option; ensures fresh data
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ getArticles fetch error:', response.status, errorText.slice(0, 500));
      return [];
    }

    data = await response.json();
  } catch (e: any) {
    console.error('❌ getArticles EXCEPTION:', e.message, e.stack);
    return [];
  }

  console.log('✅ getArticles: got', data?.length ?? 0, 'rows');

  if (!data || data.length === 0) {
    console.warn('⚠️ getArticles: data is empty or null, raw type:', typeof data, 'isArray:', Array.isArray(data));
  }

  return (data || []).map((row: any) => ({
    slug: row.slug,
    title: row.title,
    original_title: row.original_title || '',
    source_url: row.source_url || '',
    date: row.article_date || row.created_at?.slice(0, 10) || '',
    tags: row.tags || [],
    excerpt: (row.summary || '').slice(0, 160) || 'اقرأ التحليل الكامل على marfa.sa',
  }));
}

export async function getArticleBySlug(
  slug: string
): Promise<FinancialNewsArticle | null> {
  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();
  const query = `${url}/rest/v1/financial_news_articles?select=*&slug=eq.${encodeURIComponent(slug)}`;

  try {
    const response = await fetch(query, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        Accept: 'application/vnd.pgrst.object+json', // Return single object, not array
      },
      cache: 'no-store',
    });

    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

// ── Write Operations (Service Role) ────────────────────────────────

export async function saveArticle(article: {
  title: string;
  original_title: string;
  summary: string;
  full_content?: string;
  source_url: string;
  article_date: string;
  tags?: string[];
  scraped_at: string;
}): Promise<{ slug: string }> {
  const supabase = createServiceClient();

  const slug = generateSlug(article.original_title || article.title, article.article_date);

  const { error } = await supabase.from('financial_news_articles').insert({
    slug,
    title: article.title,
    original_title: article.original_title,
    summary: article.summary,
    full_content: article.full_content || null,
    source_url: article.source_url,
    article_date: article.article_date,
    tags: article.tags || ['استثمار', 'الاقتصاد السعودي', 'أسواق مالية', 'أخبار مالية'],
    category: 'financial-news',
    seo_keywords: 'الاستثمار السعودي، السوق المالية، الاقتصاد السعودي',
    scraped_at: article.scraped_at,
  });

  if (error) {
    console.error('❌ Failed to save article:', error);
    throw new Error(`Database insert failed: ${error.message}`);
  }

  return { slug };
}

export async function listArticles(): Promise<
  { slug: string; created_at: string; title: string; original_title: string; source_url: string; article_date: string }[]
> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from('financial_news_articles')
    .select('slug, created_at, title, original_title, source_url, article_date')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('❌ Failed to list articles:', error);
    return [];
  }

  return (data || []).map((row) => ({
    slug: row.slug,
    created_at: row.created_at,
    title: row.title,
    original_title: row.original_title || '',
    source_url: row.source_url || '',
    article_date: row.article_date || '',
  }));
}

export async function getArticlesCount(): Promise<number> {
  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();
  const query = `${url}/rest/v1/financial_news_articles?select=id&limit=0`;

  try {
    const response = await fetch(query, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        Accept: 'application/json',
        Prefer: 'count=exact',
      },
      cache: 'no-store',
    });

    if (!response.ok) return 0;

    // PostgREST returns count in content-range header: "0-0/40"
    const contentRange = response.headers.get('content-range');
    if (contentRange) {
      const match = contentRange.match(/\/(\d+)$/);
      if (match) return parseInt(match[1], 10);
    }
    return 0;
  } catch {
    return 0;
  }
}
