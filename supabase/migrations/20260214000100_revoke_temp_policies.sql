-- Migration: Revoke Temp Policies
-- Description: Remove "Allow seed" policies that gave public write access

-- Revoke from announcements
DROP POLICY IF EXISTS "Allow seed announcements" ON public.announcements;

-- Revoke from meetings
DROP POLICY IF EXISTS "Allow seed meetings" ON public.meetings;
