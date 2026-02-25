-- Migration: Fix Opportunity Security
-- Description: Prevent entrepreneurs from setting status to 'published' (Business Logic Fix)

-- 1. Create function to validate status changes
CREATE OR REPLACE FUNCTION public.validate_opportunity_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if status is being changed to 'published'
  IF (NEW.status = 'published' AND OLD.status != 'published') THEN
    -- Allow change only if user is service_role (admin) or has admin claim
    IF (auth.role() = 'service_role') OR (auth.jwt() ->> 'role' = 'admin') THEN
      RETURN NEW;
    ELSE
      RAISE EXCEPTION 'You are not allowed to publish an opportunity directly. It must be approved by an admin.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create Trigger
DROP TRIGGER IF EXISTS check_opportunity_status ON public.investment_opportunities;

CREATE TRIGGER check_opportunity_status
  BEFORE UPDATE ON public.investment_opportunities
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_opportunity_status();
