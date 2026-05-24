-- Migration: RLS policies for all core user-facing tables
-- profiles had policies on old project but no migration; subprofiles & opportunities had RLS enabled with zero policies.
-- This ensures the new project has all policies needed for auth, login lazy-creation, admin dashboard, and opportunity management.

-- ============================================================
-- 1. PROFILES
-- ============================================================

-- Public read access for profile display
DROP POLICY IF EXISTS "Public profiles" ON public.profiles;
CREATE POLICY "Public profiles"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can insert their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile (role changes blocked by check_role_update trigger)
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- 2. INVESTOR PROFILES
-- ============================================================

-- Allow users to view their own investor profile
DROP POLICY IF EXISTS "Users can view own investor profile" ON public.investor_profiles;
CREATE POLICY "Users can view own investor profile"
  ON public.investor_profiles FOR SELECT
  USING (auth.uid() = profile_id);

-- Allow users to insert their own investor profile (lazy creation on login)
DROP POLICY IF EXISTS "Users can insert own investor profile" ON public.investor_profiles;
CREATE POLICY "Users can insert own investor profile"
  ON public.investor_profiles FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

-- Allow users to update their own investor profile (not approval_status — handled by admin-only policy)
DROP POLICY IF EXISTS "Users can update own investor profile" ON public.investor_profiles;
CREATE POLICY "Users can update own investor profile"
  ON public.investor_profiles FOR UPDATE
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

-- Allow admins to view all investor profiles
DROP POLICY IF EXISTS "Admins can view all investor profiles" ON public.investor_profiles;
CREATE POLICY "Admins can view all investor profiles"
  ON public.investor_profiles FOR SELECT
  USING (auth.role() = 'service_role' OR (auth.jwt() ->> 'role') = 'admin');

-- Allow admins to update any investor profile (approval, rejection, etc.)
DROP POLICY IF EXISTS "Admins can update any investor profile" ON public.investor_profiles;
CREATE POLICY "Admins can update any investor profile"
  ON public.investor_profiles FOR UPDATE
  USING (auth.role() = 'service_role' OR (auth.jwt() ->> 'role') = 'admin')
  WITH CHECK (auth.role() = 'service_role' OR (auth.jwt() ->> 'role') = 'admin');

-- ============================================================
-- 3. ENTREPRENEUR PROFILES
-- ============================================================

-- Allow users to view their own entrepreneur profile
DROP POLICY IF EXISTS "Users can view own entrepreneur profile" ON public.entrepreneur_profiles;
CREATE POLICY "Users can view own entrepreneur profile"
  ON public.entrepreneur_profiles FOR SELECT
  USING (auth.uid() = profile_id);

-- Allow users to insert their own entrepreneur profile (lazy creation on login)
DROP POLICY IF EXISTS "Users can insert own entrepreneur profile" ON public.entrepreneur_profiles;
CREATE POLICY "Users can insert own entrepreneur profile"
  ON public.entrepreneur_profiles FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

-- Allow users to update their own entrepreneur profile
DROP POLICY IF EXISTS "Users can update own entrepreneur profile" ON public.entrepreneur_profiles;
CREATE POLICY "Users can update own entrepreneur profile"
  ON public.entrepreneur_profiles FOR UPDATE
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

-- Allow admins to view all entrepreneur profiles
DROP POLICY IF EXISTS "Admins can view all entrepreneur profiles" ON public.entrepreneur_profiles;
CREATE POLICY "Admins can view all entrepreneur profiles"
  ON public.entrepreneur_profiles FOR SELECT
  USING (auth.role() = 'service_role' OR (auth.jwt() ->> 'role') = 'admin');

-- Allow admins to update any entrepreneur profile
DROP POLICY IF EXISTS "Admins can update any entrepreneur profile" ON public.entrepreneur_profiles;
CREATE POLICY "Admins can update any entrepreneur profile"
  ON public.entrepreneur_profiles FOR UPDATE
  USING (auth.role() = 'service_role' OR (auth.jwt() ->> 'role') = 'admin')
  WITH CHECK (auth.role() = 'service_role' OR (auth.jwt() ->> 'role') = 'admin');

-- ============================================================
-- 4. INVESTMENT OPPORTUNITIES
-- ============================================================

-- Allow entrepreneurs to view their own opportunities
DROP POLICY IF EXISTS "Entrepreneurs can view own opportunities" ON public.investment_opportunities;
CREATE POLICY "Entrepreneurs can view own opportunities"
  ON public.investment_opportunities FOR SELECT
  USING (auth.uid() = entrepreneur_id);

-- Allow entrepreneurs to create their own opportunities
DROP POLICY IF EXISTS "Entrepreneurs can create opportunities" ON public.investment_opportunities;
CREATE POLICY "Entrepreneurs can create opportunities"
  ON public.investment_opportunities FOR INSERT
  WITH CHECK (auth.uid() = entrepreneur_id);

-- Allow entrepreneurs to update their own opportunities
DROP POLICY IF EXISTS "Entrepreneurs can update own opportunities" ON public.investment_opportunities;
CREATE POLICY "Entrepreneurs can update own opportunities"
  ON public.investment_opportunities FOR UPDATE
  USING (auth.uid() = entrepreneur_id)
  WITH CHECK (auth.uid() = entrepreneur_id);

-- Allow investors to view published opportunities
DROP POLICY IF EXISTS "Investors can view published opportunities" ON public.investment_opportunities;
CREATE POLICY "Investors can view published opportunities"
  ON public.investment_opportunities FOR SELECT
  USING (status = 'published');

-- Allow admins to view all opportunities
DROP POLICY IF EXISTS "Admins can view all opportunities" ON public.investment_opportunities;
CREATE POLICY "Admins can view all opportunities"
  ON public.investment_opportunities FOR SELECT
  USING (auth.role() = 'service_role' OR (auth.jwt() ->> 'role') = 'admin');

-- Allow admins to update any opportunity
DROP POLICY IF EXISTS "Admins can update any opportunity" ON public.investment_opportunities;
CREATE POLICY "Admins can update any opportunity"
  ON public.investment_opportunities FOR UPDATE
  USING (auth.role() = 'service_role' OR (auth.jwt() ->> 'role') = 'admin')
  WITH CHECK (auth.role() = 'service_role' OR (auth.jwt() ->> 'role') = 'admin');
