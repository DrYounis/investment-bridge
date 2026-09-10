-- ==========================================
-- Fix: majlis_quiz_answers — add missing contribution_tier + RLS for student submission
-- Run this in Supabase SQL Editor (idempotent — safe to re-run).
--
-- Regression: the tiered-membership feature started writing `contribution_tier`
-- on answer insert. The matching migration (20260808_add_contribution_tiers.sql)
-- added that column to `majlis_messages` but missed `majlis_quiz_answers`, so
-- student submission failed with "تعذّر إرسال الإجابة — حاول مرة أخرى".
-- ==========================================

-- 1. Add missing columns
ALTER TABLE public.majlis_quiz_answers
  ADD COLUMN IF NOT EXISTS contribution_tier text;

ALTER TABLE public.majlis_quiz_answers
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT timezone('utc', now());

-- 2. Row Level Security for answers
--    Students manage their own answer; admins read all (for realtime dashboard).
ALTER TABLE public.majlis_quiz_answers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can view their own answers" ON public.majlis_quiz_answers;
CREATE POLICY "Students can view their own answers"
  ON public.majlis_quiz_answers FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all answers" ON public.majlis_quiz_answers;
CREATE POLICY "Admins can view all answers"
  ON public.majlis_quiz_answers FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles
      WHERE email = ANY(ARRAY['op.younis@gmail.com','mohamedy2003@gmail.com','10.younis@gmail.com','remy.arbaoui@gmail.com'])
    )
  );

DROP POLICY IF EXISTS "Students can insert their own answers" ON public.majlis_quiz_answers;
CREATE POLICY "Students can insert their own answers"
  ON public.majlis_quiz_answers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Students can update their own answers" ON public.majlis_quiz_answers;
CREATE POLICY "Students can update their own answers"
  ON public.majlis_quiz_answers FOR UPDATE
  USING (auth.uid() = user_id);

-- 3. Row Level Security for questions (readable by all authenticated users)
ALTER TABLE public.majlis_quiz_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Questions are viewable by authenticated users" ON public.majlis_quiz_questions;
CREATE POLICY "Questions are viewable by authenticated users"
  ON public.majlis_quiz_questions FOR SELECT
  USING (auth.role() = 'authenticated');
