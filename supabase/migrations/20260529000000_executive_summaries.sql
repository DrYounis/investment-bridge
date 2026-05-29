-- Create executive_summaries table for the Executive Summary Generator tool
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

-- Enable RLS
ALTER TABLE public.executive_summaries ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert their own summaries
CREATE POLICY "Users can insert their own summaries"
  ON public.executive_summaries
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Allow anonymous insert (for unauthenticated users who fill contact form)
CREATE POLICY "Anyone can insert summaries"
  ON public.executive_summaries
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only admins can read summaries
CREATE POLICY "Admins can read all summaries"
  ON public.executive_summaries
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));
