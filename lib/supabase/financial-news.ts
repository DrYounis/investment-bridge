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
    .slice(0, 60)
    .normalize('NFC'); // Ensure consistent Unicode normalization across platforms
  const timestamp = Date.now().toString().slice(-6);
  return `${date}-${clean}-${timestamp}`;
}

// ── Read Operations (Public) ───────────────────────────────────────

export async function getArticles(): Promise<ArticleListingItem[]> {
  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();
  const keyPrefix = anonKey.slice(0, 10) + '...';

  // Build PostgREST query directly to bypass any @supabase/supabase-js
  // client-side issues in the Next.js serverless runtime.
  // NOTE: do NOT encodeURIComponent the select string — commas are PostgREST
  // column separators and must remain literal.
  const select = 'slug,title,original_title,source_url,article_date,tags,summary,created_at';
  const query = `${url}/rest/v1/financial_news_articles?select=${select}&order=article_date.desc&order=created_at.desc&limit=50`;

  let data: any[] | null = null;

  try {
    const response = await fetch(query, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        Accept: 'application/json',
      },
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

  if (!data || data.length === 0) {
    return [];
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
  // Guard against URL-encoded slugs (Next.js may pass them encoded)
  const decoded = decodeURIComponent(slug);
  const normalized = decoded.normalize('NFC');

  const headers = {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
    Accept: 'application/json',
  };

  try {
    // Fetch all articles (no slug filter — same pattern as getArticles which works)
    // and filter in JS to avoid PostgREST encoding issues with Arabic slugs.
    const query = `${url}/rest/v1/financial_news_articles?select=*&order=article_date.desc&limit=100`;

    const response = await fetch(query, { headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ getArticleBySlug error:', response.status, errorText.slice(0, 500));
      return null;
    }

    const data: any[] = await response.json();

    // Match by normalized slug — handles NFC vs NFD mismatches
    const match = data.find(
      (row: any) => (row.slug || '').normalize('NFC') === normalized
    );

    if (match) {
      return match as FinancialNewsArticle;
    }

    return null;
  } catch (e: any) {
    console.error('❌ getArticleBySlug exception:', e.message, e.stack?.slice(0, 200));
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
