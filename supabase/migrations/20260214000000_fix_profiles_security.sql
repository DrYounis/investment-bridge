-- Migration: Fix Profiles Security
-- Description: Prevent users from updating their own role (Privilege Escalation Fix)

-- 1. Create function to check role changes
CREATE OR REPLACE FUNCTION public.prevent_role_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if role is being changed
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    -- Allow change only if user is service_role (admin) or has admin claim
    IF (auth.role() = 'service_role') OR (auth.jwt() ->> 'role' = 'admin') THEN
      RETURN NEW;
    ELSE
      RAISE EXCEPTION 'You are not allowed to change your role.';
    END IF;
  END IF;
  
  -- Allow other changes
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create Trigger
DROP TRIGGER IF EXISTS check_role_update ON public.profiles;

CREATE TRIGGER check_role_update
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_update();
