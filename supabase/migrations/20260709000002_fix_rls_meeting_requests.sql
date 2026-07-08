-- Fix: meeting_requests had only an INSERT policy. No SELECT/UPDATE policies
-- meant even admins couldn't read submissions via RLS (service_role bypasses RLS,
-- but authenticated clients get empty results). This adds SELECT + UPDATE policies
-- for super admins (identified by email).
DROP POLICY IF EXISTS "Super admins can read requests" ON public.meeting_requests;
CREATE POLICY "Super admins can read requests"
  ON public.meeting_requests FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles
      WHERE email IN ('op.younis@gmail.com', 'mohamedy2003@gmail.com')
    )
  );

DROP POLICY IF EXISTS "Super admins can update requests" ON public.meeting_requests;
CREATE POLICY "Super admins can update requests"
  ON public.meeting_requests FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles
      WHERE email IN ('op.younis@gmail.com', 'mohamedy2003@gmail.com')
    )
  );
