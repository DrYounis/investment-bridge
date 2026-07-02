-- meeting_subscribers: auto-populated on every login, used for weekly meeting notifications
CREATE TABLE IF NOT EXISTS public.meeting_subscribers (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL DEFAULT 'login', -- 'login', 'manual', 'initial_seed'
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS: only super admin can read/manage
ALTER TABLE public.meeting_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins can read subscribers"
  ON public.meeting_subscribers FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles
      WHERE email IN ('op.younis@gmail.com', 'mohamedy2003@gmail.com')
    )
  );

CREATE POLICY "Super admins can insert subscribers"
  ON public.meeting_subscribers FOR INSERT
  WITH CHECK (true); -- allow insert from server-side (service_role)

CREATE POLICY "Super admins can delete subscribers"
  ON public.meeting_subscribers FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles
      WHERE email IN ('op.younis@gmail.com', 'mohamedy2003@gmail.com')
    )
  );

-- Seed the initial 6 emails
INSERT INTO public.meeting_subscribers (email, source) VALUES
  ('Ahmedabdelzaher1395@gmail.com', 'initial_seed'),
  ('jalalmohammed227@gmail.com', 'initial_seed'),
  ('Dr_kh6006@hotmail.com', 'initial_seed'),
  ('Mohamed.raslan56@yahoo.com', 'initial_seed'),
  ('Mohamedbioumy32@yahoo.com', 'initial_seed'),
  ('Aymanbounty@gmail.com', 'initial_seed')
ON CONFLICT (email) DO NOTHING;
