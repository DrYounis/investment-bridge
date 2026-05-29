-- COPY THIS SQL and run it in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/wxvkzutexitcllyewbnw/sql/new

CREATE TABLE IF NOT EXISTS public.executive_summaries (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  sector TEXT NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}',
  pitch TEXT NOT NULL,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.executive_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own summaries"
  ON public.executive_summaries
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Anyone can insert summaries"
  ON public.executive_summaries
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Admins can read all summaries"
  ON public.executive_summaries
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));
