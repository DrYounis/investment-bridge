-- Event tracking columns on page_views.
-- Events (CTA views/clicks, funnel steps) are stored in the same table so the
-- weekly analytics cron aggregates them alongside page views.
ALTER TABLE public.page_views
  ADD COLUMN IF NOT EXISTS event_name text,
  ADD COLUMN IF NOT EXISTS event_data jsonb,
  ADD COLUMN IF NOT EXISTS variant text;
