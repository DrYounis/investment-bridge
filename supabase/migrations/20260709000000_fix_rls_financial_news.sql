-- Fix: financial_news_articles RLS — the "Allow service_role write" policy
-- was missing the TO service_role clause, so it allowed ALL roles (anon, authenticated)
-- to INSERT/UPDATE/DELETE. This migration drops and recreates it properly.
DROP POLICY IF EXISTS "Allow service_role write" ON public.financial_news_articles;
CREATE POLICY "Allow service_role write" ON public.financial_news_articles
  FOR ALL TO service_role USING (true) WITH CHECK (true);
