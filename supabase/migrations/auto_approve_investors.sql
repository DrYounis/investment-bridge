-- Auto-approve all new investors (remove admin review requirement)
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/wxvkzutexitcllyewbnw/sql/new

-- 1. Update the signup trigger to set approval_status = 'approved' for all new investors
CREATE OR REPLACE FUNCTION public.on_auth_user_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_name text;
  v_email text;
  v_phone text;
  v_role text;
  v_commercial_register text;
BEGIN
  v_name := NEW.raw_user_meta_data ->> 'full_name';
  v_email := NEW.email;
  v_phone := NEW.raw_user_meta_data ->> 'phone';
  -- FIX: Never read user_type from metadata — privilege escalation vector.
  v_role := 'entrepreneur';
  v_commercial_register := NEW.raw_user_meta_data ->> 'commercial_register';

  -- Insert into profiles
  INSERT INTO public.profiles (id, full_name, email, phone, role, user_type)
  VALUES (NEW.id, v_name, v_email, v_phone, v_role, v_role)
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      email = EXCLUDED.email,
      phone = EXCLUDED.phone,
      role = EXCLUDED.role,
      user_type = EXCLUDED.user_type;

  -- Auto-approve investors (was 'pending')
  IF v_role = 'investor' THEN
    INSERT INTO public.investor_profiles (profile_id, commercial_register, approval_status)
    VALUES (NEW.id, v_commercial_register, 'approved')
    ON CONFLICT (profile_id) DO NOTHING;
  END IF;

  -- Entrepreneurs
  IF v_role = 'entrepreneur' THEN
    INSERT INTO public.entrepreneur_profiles (profile_id)
    VALUES (NEW.id)
    ON CONFLICT (profile_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- 2. Update ALL existing pending investors to approved
UPDATE public.investor_profiles
SET approval_status = 'approved'
WHERE approval_status = 'pending';

-- 3. Verify
SELECT 
  p.full_name,
  p.email,
  ip.approval_status,
  ip.created_at
FROM public.investor_profiles ip
JOIN public.profiles p ON p.id = ip.profile_id
ORDER BY ip.created_at DESC
LIMIT 20;
