-- ==========================================
-- Teacher Enrollments — Vibe Coding Arabic program students
-- ==========================================

CREATE TABLE IF NOT EXISTS public.teacher_enrollments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text,
  phone text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT timezone('utc', now()),
  UNIQUE(user_id)
);

ALTER TABLE public.teacher_enrollments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own enrollment" ON public.teacher_enrollments;
CREATE POLICY "Users can view own enrollment"
  ON public.teacher_enrollments FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role full access" ON public.teacher_enrollments;
CREATE POLICY "Service role full access"
  ON public.teacher_enrollments FOR ALL
  USING (auth.role() = 'service_role');

REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.teacher_enrollments FROM anon, authenticated;
GRANT SELECT ON public.teacher_enrollments TO authenticated;
