-- Migration: financial_news_articles table
-- Recreated from existing schema (original project: tkokgarmxcgvsedtgben)
CREATE TABLE IF NOT EXISTS public.financial_news_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  title text NOT NULL,
  original_title text,
  summary text NOT NULL,
  full_content text,
  source_url text,
  article_date date,
  tags text[] DEFAULT '{}'::text[],
  category text DEFAULT 'financial-news'::text,
  seo_keywords text,
  scraped_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index for slug lookups (article detail pages)
CREATE INDEX IF NOT EXISTS idx_financial_news_slug ON public.financial_news_articles (slug);

-- Index for listing by date
CREATE INDEX IF NOT EXISTS idx_financial_news_date ON public.financial_news_articles (article_date DESC, created_at DESC);

-- Enable RLS (gate write operations to service_role only)
ALTER TABLE public.financial_news_articles ENABLE ROW LEVEL SECURITY;

-- Allow public read access
DROP POLICY IF EXISTS "Allow public read" ON public.financial_news_articles;
CREATE POLICY "Allow public read" ON public.financial_news_articles
  FOR SELECT USING (true);

-- Allow service_role full access
DROP POLICY IF EXISTS "Allow service_role write" ON public.financial_news_articles;
CREATE POLICY "Allow service_role write" ON public.financial_news_articles
  FOR ALL USING (true) WITH CHECK (true);
