-- COPY THIS and run in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/wxvkzutexitcllyewbnw/sql/new

CREATE TABLE IF NOT EXISTS public.advisor_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  idea TEXT NOT NULL,
  phase TEXT NOT NULL,
  analyses JSONB,
  canvas_data JSONB,
  plan_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.advisor_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users see own sessions"
  ON public.advisor_sessions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
