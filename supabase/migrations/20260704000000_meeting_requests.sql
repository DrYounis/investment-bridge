-- meeting_requests: investor meeting request form submissions from /meetings page
CREATE TABLE IF NOT EXISTS public.meeting_requests (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  preferred_time TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS: allow inserts from anyone (public form), reads only by service_role
ALTER TABLE public.meeting_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert meeting requests"
  ON public.meeting_requests FOR INSERT
  WITH CHECK (true);
