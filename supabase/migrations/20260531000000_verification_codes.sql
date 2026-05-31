-- OTP verification codes for passwordless auth via Resend
CREATE TABLE IF NOT EXISTS public.verification_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '10 minutes'),
  used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast lookup by email + code
CREATE INDEX IF NOT EXISTS idx_verification_codes_email_code
  ON public.verification_codes (email, code);

-- Only the service role can insert/update (edge functions use service key)
ALTER TABLE public.verification_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role manages verification codes" ON public.verification_codes;
CREATE POLICY "Service role manages verification codes"
  ON public.verification_codes
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
