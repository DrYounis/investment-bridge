-- Fix Foreign Key to point to profiles instead of auth.users to allow joins
BEGIN;

ALTER TABLE public.investor_requests 
DROP CONSTRAINT IF EXISTS investor_requests_investor_id_fkey;

ALTER TABLE public.investor_requests
ADD CONSTRAINT investor_requests_investor_id_fkey
FOREIGN KEY (investor_id)
REFERENCES public.profiles(id)
ON DELETE CASCADE;

COMMIT;
