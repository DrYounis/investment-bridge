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

CREATE INDEX IF NOT EXISTS idx_financial_news_slug ON public.financial_news_articles (slug);

CREATE INDEX IF NOT EXISTS idx_financial_news_date ON public.financial_news_articles (article_date DESC, created_at DESC);

ALTER TABLE public.financial_news_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON public.financial_news_articles FOR SELECT USING (true);

CREATE POLICY "Allow service_role write" ON public.financial_news_articles FOR ALL USING (true) WITH CHECK (true);
