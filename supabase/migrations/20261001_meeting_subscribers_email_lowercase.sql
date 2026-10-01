-- Enforce case-insensitive uniqueness on meeting_subscribers.email.
--
-- All app insert paths already lowercase the email (subscribe, admin notifications,
-- verify-otp), and existing mixed-case rows were normalized to lowercase on
-- 2026-10-01. This index is defense-in-depth so a case-variant write (e.g. a direct
-- DB edit or a future path) can never create a duplicate row again.
--
-- The original case-sensitive UNIQUE constraint on email is left in place so the
-- app's `onConflict: 'email'` upserts keep working.

-- 1. Normalize any remaining mixed-case emails (idempotent).
UPDATE public.meeting_subscribers
  SET email = lower(email)
  WHERE email <> lower(email);

-- 2. Unique index on the normalized email (defense in depth).
CREATE UNIQUE INDEX IF NOT EXISTS meeting_subscribers_email_lower_key
  ON public.meeting_subscribers (lower(email));
