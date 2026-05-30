-- =============================================
-- FIX: Replace outdated handle_new_user() trigger
-- The current trigger only inserts id, email, full_name.
-- This version saves phone, user_type, role, and creates sub-profiles.
-- Run this in: https://supabase.com/dashboard/project/wxvkzutexitcllyewbnw/sql/new
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  meta jsonb;
  u_role text;
  u_full_name text;
  u_phone text;
  u_commercial_register text;
  u_sector text;
BEGIN
  meta := NEW.raw_user_meta_data;
  IF meta IS NULL THEN
    meta := '{}'::jsonb;
  END IF;

  u_role := COALESCE(meta->>'user_type', meta->>'role', 'investor');
  u_full_name := meta->>'full_name';
  u_phone := meta->>'phone';

  INSERT INTO public.profiles (id, full_name, full_name_ar, email, phone, role, user_type)
  VALUES (
    NEW.id,
    u_full_name,
    u_full_name,
    NEW.email,
    u_phone,
    u_role,
    u_role
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    role = EXCLUDED.role,
    user_type = EXCLUDED.user_type;

  IF u_role = 'investor' THEN
    u_commercial_register := meta->>'commercial_register';
    INSERT INTO public.investor_profiles (profile_id, commercial_register, approval_status)
    VALUES (NEW.id, u_commercial_register, 'pending')
    ON CONFLICT (profile_id) DO NOTHING;
  ELSIF u_role = 'entrepreneur' THEN
    u_sector := meta->>'sector';
    INSERT INTO public.entrepreneur_profiles (profile_id, sector)
    VALUES (NEW.id, u_sector)
    ON CONFLICT (profile_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
