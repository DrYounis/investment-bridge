-- ==========================================
-- Academy Enrollments — أكاديمية مرفأ program registrations
-- ==========================================

CREATE TABLE IF NOT EXISTS public.academy_enrollments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  program text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  notes text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT timezone('utc', now()),
  updated_at timestamptz DEFAULT timezone('utc', now())
);

ALTER TABLE public.academy_enrollments ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can enroll
DROP POLICY IF EXISTS "Users can insert enrollments" ON public.academy_enrollments;
CREATE POLICY "Users can insert enrollments"
  ON public.academy_enrollments FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Users can view their own enrollments
DROP POLICY IF EXISTS "Users can view own enrollments" ON public.academy_enrollments;
CREATE POLICY "Users can view own enrollments"
  ON public.academy_enrollments FOR SELECT
  USING (auth.uid() = user_id);

-- Service role full access
DROP POLICY IF EXISTS "Service role full access" ON public.academy_enrollments;
CREATE POLICY "Service role full access"
  ON public.academy_enrollments FOR ALL
  USING (auth.role() = 'service_role');

-- Admins can view all
DROP POLICY IF EXISTS "Admins can view all enrollments" ON public.academy_enrollments;
CREATE POLICY "Admins can view all enrollments"
  ON public.academy_enrollments FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM profiles
      WHERE email = ANY(ARRAY['op.younis@gmail.com','mohamedy2003@gmail.com','10.younis@gmail.com','remy.arbaoui@gmail.com'])
    )
  );

REVOKE UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.academy_enrollments FROM anon, authenticated;
GRANT SELECT, INSERT ON public.academy_enrollments TO authenticated;
