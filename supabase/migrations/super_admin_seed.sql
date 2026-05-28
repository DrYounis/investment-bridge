-- Super Admin setup for marfa.sa
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/wxvkzutexitcllyewbnw/sql/new

-- 1. Add 'super_admin' to the user_type check constraint if not already there
-- First check if constraint exists and needs updating
DO $$
BEGIN
  -- Drop and recreate the constraint to include super_admin
  ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_type_check;
  ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_type_check
    CHECK (user_type IN ('investor', 'entrepreneur', 'admin', 'super_admin'));
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Constraint update skipped: %', SQLERRM;
END $$;

-- 2. Promote mohamedy2003@gmail.com to SUPER_ADMIN
-- Find the auth.users id for this email and update profiles
DO $$
DECLARE
  target_id uuid;
BEGIN
  SELECT id INTO target_id FROM auth.users WHERE email = 'mohamedy2003@gmail.com';
  
  IF target_id IS NOT NULL THEN
    -- Update profiles table
    UPDATE public.profiles 
    SET user_type = 'super_admin', role = 'super_admin'
    WHERE id = target_id;
    
    -- Also ensure investor_profiles exists and is approved
    INSERT INTO public.investor_profiles (profile_id, approval_status)
    VALUES (target_id, 'approved')
    ON CONFLICT (profile_id) DO UPDATE SET approval_status = 'approved';
    
    RAISE NOTICE '✅ mohamedy2003@gmail.com promoted to SUPER_ADMIN (id: %)', target_id;
  ELSE
    RAISE NOTICE '❌ User mohamedy2003@gmail.com not found in auth.users — register first at /register';
  END IF;
END $$;

-- 3. Verify
SELECT p.full_name, p.email, p.user_type, p.role, ip.approval_status
FROM public.profiles p
LEFT JOIN public.investor_profiles ip ON ip.profile_id = p.id
WHERE p.email = 'mohamedy2003@gmail.com';
