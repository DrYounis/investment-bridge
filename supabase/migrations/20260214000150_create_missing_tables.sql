-- Migration: Create Missing Tables (Safe/Idempotent)
-- Includes: profiles, investor_profiles, entrepreneur_profiles, investment_opportunities, questionnaire_responses, investor_interactions

-- 1. PROFILES
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  full_name_ar text,
  role text default 'investor',
  email text,
  phone text,
  user_type text,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

alter table public.profiles enable row level security;

-- 2. INVESTOR PROFILES
create table if not exists public.investor_profiles (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null unique,
  approval_status text default 'pending' check (approval_status in ('pending', 'approved', 'rejected')),
  commercial_register varchar(50),
  experience_level text,
  investment_amount text,
  risk_tolerance text,
  investment_duration text,
  preferred_sectors jsonb,
  expected_return text,
  approved_at timestamptz,
  approved_by uuid,
  created_at timestamptz default now() not null
);

alter table public.investor_profiles enable row level security;

-- 3. ENTREPRENEUR PROFILES
create table if not exists public.entrepreneur_profiles (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null unique,
  sector text,
  created_at timestamptz default now() not null
);

alter table public.entrepreneur_profiles enable row level security;

-- 4. INVESTMENT OPPORTUNITIES
create table if not exists public.investment_opportunities (
  id uuid default gen_random_uuid() primary key,
  entrepreneur_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  sector text,
  location text,
  status text default 'draft' check (status in ('draft', 'submitted', 'under_review', 'published', 'funded', 'closed')),
  summary text,
  detailed_description text,
  target_amount numeric,
  raised_amount numeric default 0,
  roi_percentage numeric,
  payback_period text,
  questionnaire_data jsonb,
  created_at timestamptz default timezone('utc', now()),
  published_at timestamptz
);

alter table public.investment_opportunities enable row level security;

-- 5. QUESTIONNAIRE RESPONSES
create table if not exists public.questionnaire_responses (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  responses jsonb not null,
  project_summary text,
  created_at timestamptz default timezone('utc', now())
);

alter table public.questionnaire_responses enable row level security;

-- 6. INVESTOR INTERACTIONS
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'interaction_status') THEN 
    CREATE TYPE interaction_status AS ENUM ('pending', 'connected', 'passed', 'expired'); 
  END IF; 
END $$;

create table if not exists public.investor_interactions (
  id uuid default gen_random_uuid() primary key,
  investor_id uuid references public.profiles(id) on delete cascade not null,
  project_id uuid references public.investment_opportunities(id) on delete cascade not null,
  unlocked_at timestamptz default timezone('utc', now()) not null,
  agreement_signed boolean default false not null,
  decision interaction_status default 'pending',
  decision_at timestamptz,
  created_at timestamptz default timezone('utc', now()),
  unique(investor_id, project_id)
);

alter table public.investor_interactions enable row level security;
