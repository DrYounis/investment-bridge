-- Fix: meeting_subscribers INSERT policy was WITH CHECK (true) for ALL roles,
-- allowing anonymous users to insert emails via the anon key.
-- This migration adds the TO service_role clause so only server-side code can insert.
DROP POLICY IF EXISTS "Super admins can insert subscribers" ON public.meeting_subscribers;
CREATE POLICY "Super admins can insert subscribers"
  ON public.meeting_subscribers FOR INSERT TO service_role
  WITH CHECK (true);
