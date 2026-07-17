-- ==========================================
-- Monthly Evaluations — advisory majlis grades per user per month
-- ==========================================

CREATE TABLE IF NOT EXISTS public.monthly_evaluations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  month text NOT NULL CHECK (month ~ '^\d{4}-\d{2}$'),
  grade text NOT NULL,
  notes text,
  graded_by uuid REFERENCES public.profiles(id),
  created_at timestamptz DEFAULT timezone('utc', now()),
  updated_at timestamptz DEFAULT timezone('utc', now()),
  UNIQUE(user_id, month)
);

ALTER TABLE public.monthly_evaluations ENABLE ROW LEVEL SECURITY;

-- Everyone can see their own evaluation
DROP POLICY IF EXISTS "Users can view own evaluations" ON public.monthly_evaluations;
CREATE POLICY "Users can view own evaluations"
  ON public.monthly_evaluations FOR SELECT
  USING (auth.uid() = user_id);

-- Service role bypass (for admin API)
DROP POLICY IF EXISTS "Service role full access" ON public.monthly_evaluations;
CREATE POLICY "Service role full access"
  ON public.monthly_evaluations FOR ALL
  USING (auth.role() = 'service_role');

-- Admin users can view all (via authenticated role + email check)
DROP POLICY IF EXISTS "Admins can view all evaluations" ON public.monthly_evaluations;
CREATE POLICY "Admins can view all evaluations"
  ON public.monthly_evaluations FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM profiles
      WHERE email = ANY(ARRAY['op.younis@gmail.com','mohamedy2003@gmail.com','10.younis@gmail.com','remy.arbaoui@gmail.com'])
    )
  );

-- Revoke broad grants
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.monthly_evaluations FROM anon, authenticated;
GRANT SELECT ON public.monthly_evaluations TO anon, authenticated;
