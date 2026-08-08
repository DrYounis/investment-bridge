-- Phase 1: Add contribution columns to profiles
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/wxvkzutexitcllyewbnw/sql/new)
-- Each statement is runnable independently.

-- 1. profiles: contribution tier + amount
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS contribution_tier text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS contribution_amount numeric;

-- Verify
SELECT 'profiles columns' AS step, column_name, data_type FROM information_schema.columns WHERE table_name = 'profiles' AND column_name IN ('contribution_tier', 'contribution_amount');

-- 2. subscriptions: amount recorded
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS amount numeric;

-- Verify
SELECT 'subscriptions columns' AS step, column_name, data_type FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'amount';

-- 3. majlis_messages: denormalized tier for realtime display
ALTER TABLE public.majlis_messages ADD COLUMN IF NOT EXISTS contribution_tier text;

-- Verify
SELECT 'majlis_messages columns' AS step, column_name, data_type FROM information_schema.columns WHERE table_name = 'majlis_messages' AND column_name = 'contribution_tier';
