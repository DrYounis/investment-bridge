-- ============================================================
-- مرفأ — Assessment Migration
-- Run this in your Supabase SQL Editor
-- https://supabase.com/dashboard/project/wxvkzutexitcllyewbnw/sql/new
-- ============================================================

-- 1. Profiles table (create if not exists, extend if it does)
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  full_name    text,
  company      text,
  email        text,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- Add columns if profiles already exists but lacks these fields
alter table public.profiles add column if not exists full_name  text;
alter table public.profiles add column if not exists company    text;
alter table public.profiles add column if not exists email      text;
alter table public.profiles add column if not exists updated_at timestamptz default now();

-- 2. Assessments table
create table if not exists public.assessments (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,

  -- Basic info
  full_name     text,
  company       text,
  email         text,
  idea_title    text,

  -- SWOT: Strengths
  s_core_advantage  text,
  s_resources       text,
  s_track_record    text,

  -- SWOT: Weaknesses
  w_gaps            text,
  w_bottlenecks     text,
  w_feedback        text,

  -- SWOT: Opportunities
  o_market_gap      text,
  o_timing          text,
  o_expansion       text,

  -- SWOT: Threats
  t_competition     text,
  t_risks           text,
  t_dependencies    text,

  -- Meta
  status        text default 'pending',   -- pending | reviewed | approved | rejected
  notes         text,                     -- internal marfa team notes
  submitted_at  timestamptz default now(),
  reviewed_at   timestamptz,
  created_at    timestamptz default now()
);

-- 3. Row Level Security
alter table public.profiles    enable row level security;
alter table public.assessments enable row level security;

-- Profiles: users can read/write their own row
drop policy if exists "profiles: own read" on public.profiles;
create policy "profiles: own read"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles: own update" on public.profiles;
create policy "profiles: own update"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "profiles: own insert" on public.profiles;
create policy "profiles: own insert"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Assessments: users can read/write their own assessments
drop policy if exists "assessments: own read" on public.assessments;
create policy "assessments: own read"
  on public.assessments for select
  using (auth.uid() = user_id);

drop policy if exists "assessments: own insert" on public.assessments;
create policy "assessments: own insert"
  on public.assessments for insert
  with check (auth.uid() = user_id);

drop policy if exists "assessments: own update" on public.assessments;
create policy "assessments: own update"
  on public.assessments for update
  using (auth.uid() = user_id);

-- 4. Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. Index for fast user lookups
create index if not exists assessments_user_id_idx on public.assessments(user_id);
create index if not exists assessments_submitted_at_idx on public.assessments(submitted_at desc);
