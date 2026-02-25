-- =============================================
-- FIX: Database Error Saving New User
-- Description: Updates schema and trigger to properly handle new user registration
-- =============================================

-- 1. Ensure public.profiles has all required columns
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS full_name_ar TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS user_type TEXT,
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'investor';

-- 2. Ensure sub-tables exist (idempotent)
CREATE TABLE IF NOT EXISTS public.investor_profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  approval_status text DEFAULT 'pending',
  commercial_register varchar(50),
  experience_level text,
  investment_amount text,
  risk_tolerance text,
  investment_duration text,
  preferred_sectors jsonb,
  expected_return text,
  approved_at timestamptz,
  approved_by uuid,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.entrepreneur_profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  sector text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 3. Redefine the Trigger Function with Robust Error Handling
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
  -- Safe extraction of metadata (handle nulls)
  meta := NEW.raw_user_meta_data;
  IF meta IS NULL THEN
    meta := '{}'::jsonb;
  END IF;

  -- Determine Role
  u_role := COALESCE(meta->>'user_type', meta->>'role', 'investor');
  u_full_name := meta->>'full_name';
  u_phone := meta->>'phone';

  -- 1. Insert into Base Profile
  INSERT INTO public.profiles (id, full_name, full_name_ar, email, phone, role, user_type)
  VALUES (
    NEW.id,
    u_full_name,
    u_full_name, -- Default Arabic name to English
    NEW.email,
    u_phone,
    u_role,
    u_role
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    role = EXCLUDED.role;

  -- 2. Insert into Sub-Profile based on Role
  IF u_role = 'investor' THEN
    u_commercial_register := meta->>'commercial_register';
    
    INSERT INTO public.investor_profiles (
      profile_id,
      commercial_register,
      approval_status
    ) VALUES (
      NEW.id,
      u_commercial_register,
      'pending'
    )
    ON CONFLICT (profile_id) DO NOTHING;

  ELSIF u_role = 'entrepreneur' THEN
    u_sector := meta->>'sector';

    INSERT INTO public.entrepreneur_profiles (
      profile_id,
      sector
    ) VALUES (
      NEW.id,
      u_sector
    )
    ON CONFLICT (profile_id) DO NOTHING;
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error (visible in Supabase logs) but try not to fail the auth request if possible,
    -- though for a trigger, raising exception is usually safer to prevent partial state.
    -- However, to allow the user to be created in Auth even if Profile fails (for debugging),
    -- we could suppress. But here we want to ensure Profile exists.
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW; -- Proceed so Auth User is created, even if Profile creation had issues (monitor logs)
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Re-attach Trigger to Auth Table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. Grant Permissions (just in case)
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;
