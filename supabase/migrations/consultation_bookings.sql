-- Consultation bookings table — stores consultation requests before they're confirmed

CREATE TABLE IF NOT EXISTS public.consultation_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  notes TEXT DEFAULT '',
  is_first_time BOOLEAN DEFAULT TRUE,
  price INTEGER NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 75,
  status TEXT DEFAULT 'pending',  -- pending, confirmed, completed, cancelled
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.consultation_bookings ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.consultation_bookings IS 'Consultation booking requests — one-on-one advisory sessions';
