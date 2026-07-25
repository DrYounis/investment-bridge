-- User journey analysis table — weekly per-user behavior tracking
-- Feeds development priorities from actual user behavior patterns

CREATE TABLE IF NOT EXISTS public.user_journey_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,                -- visitor_hash (anonymous) or profile.id (registered)
  email TEXT,                           -- only for registered users
  is_registered BOOLEAN DEFAULT FALSE,
  week_start DATE NOT NULL,             -- Monday of the analysis week
  total_visits INTEGER DEFAULT 0,
  pages_visited JSONB DEFAULT '[]'::jsonb,  -- [{path: string, count: int}]
  days_active INTEGER DEFAULT 0,
  first_visit TIMESTAMPTZ,
  last_visit TIMESTAMPTZ,
  quiz_meeting INTEGER,                 -- which meeting they answered
  quiz_score INTEGER,                   -- 1-5 if graded
  engagement_score INTEGER DEFAULT 0,   -- 0-100
  churn_risk TEXT,                      -- 'new', 'low', 'medium', 'high'
  behavior_segment TEXT,                -- 'explorer', 'learner', 'quiz_taker', 'power_user', 'dropped_off'
  recommended_action TEXT,
  insights_json JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for weekly queries
CREATE INDEX IF NOT EXISTS idx_journey_week ON public.user_journey_analysis (week_start, user_id);
CREATE INDEX IF NOT EXISTS idx_journey_segment ON public.user_journey_analysis (week_start, behavior_segment);
CREATE INDEX IF NOT EXISTS idx_journey_user ON public.user_journey_analysis (user_id, week_start);

-- RLS: service_role only (analytics data, never exposed to clients)
ALTER TABLE public.user_journey_analysis ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.user_journey_analysis IS 'Weekly per-user behavior analysis — computes engagement, churn risk, and dev recommendations from page_views + quiz + profile data';
