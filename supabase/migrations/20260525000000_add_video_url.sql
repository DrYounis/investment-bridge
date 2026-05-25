-- Migration: Add video_url column to financial_news_articles
-- Enables YouTube video embeds within financial news articles
ALTER TABLE public.financial_news_articles
  ADD COLUMN IF NOT EXISTS video_url text;
