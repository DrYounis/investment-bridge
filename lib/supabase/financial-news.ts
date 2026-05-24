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
  console.log('🔍 getArticles: url=', url, 'key_prefix=', keyPrefix);

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

  // Normalize to NFC — macOS vs Linux can produce different Unicode forms
  const normalized = slug.normalize('NFC');
  const query = `${url}/rest/v1/financial_news_articles?select=*&slug=eq.${encodeURIComponent(normalized)}`;

  console.log('🔍 gABS slug_end=', normalized.slice(-20), 'query_len=', query.length);

  const headers = {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
    Accept: 'application/json',
  };

  try {
    const response = await fetch(query, { headers });

    console.log('🔍 gABS status=', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ getArticleBySlug error:', response.status, errorText.slice(0, 500));
      return null;
    }

    const data = await response.json();
    console.log('🔍 gABS arr_len=', Array.isArray(data) ? data.length : 'non-array');

    if (Array.isArray(data) && data.length > 0) {
      return data[0] as FinancialNewsArticle;
    }

    // ── Diagnostic fallback: scan all slugs with NFC normalization on both sides ──
    console.log('🔍 gABS fallback: scanning all slugs...');
    const allRes = await fetch(
      `${url}/rest/v1/financial_news_articles?select=id,slug&limit=100`,
      { headers }
    );
    if (allRes.ok) {
      const allRows: any[] = await allRes.json();
      // Normalize BOTH sides for comparison — DB may have NFD, URL gives NFC
      const match = allRows.find((r: any) =>
        (r.slug || '').normalize('NFC') === normalized
      );
      if (match) {
        console.log('🔍 gABS fallback: FOUND! id=', match.id?.slice(0, 8), 'slug_end=', (match.slug || '').slice(-30));
        // Re-fetch by `id` (UUID, no encoding issues) instead of slug
        const retryQuery = `${url}/rest/v1/financial_news_articles?select=*&id=eq.${encodeURIComponent(match.id)}`;
        const retryRes = await fetch(retryQuery, { headers });
        if (retryRes.ok) {
          const retryData = await retryRes.json();
          if (Array.isArray(retryData) && retryData.length > 0) {
            console.log('🔍 gABS fallback: retry by id SUCCESS');
            return retryData[0] as FinancialNewsArticle;
          }
        }
        console.log('🔍 gABS fallback: match found but retry by id FAILED');
      } else {
        console.log('🔍 gABS fallback: slug NOT in DB. Sample:', allRows.slice(0, 3).map((r: any) => (r.slug || '').slice(-25)));
      }
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
