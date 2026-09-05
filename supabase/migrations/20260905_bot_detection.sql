-- Bot/anomaly detection column on page_views.
-- Flagged by the /api/track heuristic for scripted traffic that spoofs a
-- normal browser user-agent (rolling-window burst or /login|/register entry).
ALTER TABLE public.page_views
  ADD COLUMN IF NOT EXISTS is_likely_bot boolean NOT NULL DEFAULT false;
