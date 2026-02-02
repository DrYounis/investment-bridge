-- ==========================================
-- Full Schema Setup for Investment Bridge (مرفأ)
-- ==========================================

-- 1. Create PROFILES table (extends Supabase Auth)
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

-- Enable RLS for profiles
alter table public.profiles enable row level security;

drop policy if exists "Public profiles are viewable by everyone" on profiles;
drop policy if exists "Users can insert their own profile" on profiles;
drop policy if exists "Users can update own profile" on profiles;

create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- 1A. Create INVESTOR PROFILES table
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

drop policy if exists "Investors can insert their own profile details" on investor_profiles;
drop policy if exists "Investors can view their own profile details" on investor_profiles;
drop policy if exists "Investors can update their own profile details" on investor_profiles;

create policy "Investors can insert their own profile details"
  on investor_profiles for insert
  with check ( auth.uid() = profile_id );

create policy "Investors can view their own profile details"
  on investor_profiles for select
  using ( auth.uid() = profile_id );

create policy "Investors can update their own profile details"
  on investor_profiles for update
  using ( auth.uid() = profile_id );

-- 1B. Create ENTREPRENEUR PROFILES table
create table if not exists public.entrepreneur_profiles (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null unique,
  sector text,
  created_at timestamptz default now() not null
);

alter table public.entrepreneur_profiles enable row level security;

drop policy if exists "Entrepreneurs can insert own profile" on entrepreneur_profiles;
drop policy if exists "Entrepreneurs can view own profile" on entrepreneur_profiles;
drop policy if exists "Entrepreneurs can update own profile" on entrepreneur_profiles;

create policy "Entrepreneurs can insert own profile"
  on entrepreneur_profiles for insert
  with check ( auth.uid() = profile_id );

create policy "Entrepreneurs can view own profile"
  on entrepreneur_profiles for select
  using ( auth.uid() = profile_id );

create policy "Entrepreneurs can update own profile"
  on entrepreneur_profiles for update
  using ( auth.uid() = profile_id );

-- 2. Create INVESTMENT OPPORTUNITIES table
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

-- Enable RLS for opportunities
alter table public.investment_opportunities enable row level security;

drop policy if exists "Published opportunities are viewable by everyone" on investment_opportunities;
drop policy if exists "Entrepreneurs can manage their own opportunities" on investment_opportunities;

create policy "Published opportunities are viewable by everyone"
  on investment_opportunities for select
  using ( status = 'published' );

create policy "Entrepreneurs can manage their own opportunities"
  on investment_opportunities for all
  using ( auth.uid() = entrepreneur_id );

-- 3. Create QUESTIONNAIRE RESPONSES table
create table if not exists public.questionnaire_responses (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  responses jsonb not null,
  project_summary text,
  created_at timestamptz default timezone('utc', now())
);

-- Enable RLS for questionnaire
alter table public.questionnaire_responses enable row level security;

drop policy if exists "Users can manage their own responses" on questionnaire_responses;

create policy "Users can manage their own responses"
  on questionnaire_responses for all
  using ( auth.uid() = profile_id );

-- 4. Create INVESTOR INTERACTIONS table (For Shark Tank Flow)
drop type if exists interaction_status cascade;

create type interaction_status as enum ('pending', 'connected', 'passed', 'expired');

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

-- Enable RLS for interactions
alter table public.investor_interactions enable row level security;

drop policy if exists "Investors can view their own interactions" on investor_interactions;
drop policy if exists "Investors can insert their own interactions" on investor_interactions;
drop policy if exists "Investors can update their own interactions" on investor_interactions;

create policy "Investors can view their own interactions"
  on investor_interactions for select
  using (auth.uid() = investor_id);

create policy "Investors can insert their own interactions"
  on investor_interactions for insert
  with check (auth.uid() = investor_id);

create policy "Investors can update their own interactions"
  on investor_interactions for update
  using (auth.uid() = investor_id);

-- 5. Trigger to automatically create profile on sign up
-- 5. Trigger to automatically create profile and sub-profiles on sign up
create or replace function public.handle_new_user()
returns trigger as $$
declare
  meta jsonb;
  u_role text;
begin
  meta := new.raw_user_meta_data;
  -- Determine role, defaulting to investor
  u_role := coalesce(meta->>'user_type', meta->>'role', 'investor');

  -- 1. Insert into base PROFILES
  insert into public.profiles (id, full_name, full_name_ar, email, phone, role, user_type)
  values (
    new.id,
    meta->>'full_name',
    meta->>'full_name', -- Default Arabic name to same as English if not provided
    new.email,
    meta->>'phone',
    u_role,
    u_role
  );

  -- 2. Insert into sub-profiles based on role
  if u_role = 'investor' then
    insert into public.investor_profiles (
      profile_id,
      commercial_register,
      experience_level,
      investment_amount,
      risk_tolerance,
      investment_duration,
      expected_return,
      preferred_sectors,
      approval_status
    ) values (
      new.id,
      meta->>'commercial_register',
      meta->>'experience_level',
      meta->>'investment_amount',
      meta->>'risk_tolerance',
      meta->>'investment_duration',
      meta->>'expected_return',
      case 
        when meta->>'preferred_sectors' is not null then (meta->>'preferred_sectors')::jsonb 
        else null 
      end,
      'pending'
    );
  elsif u_role = 'entrepreneur' then
    insert into public.entrepreneur_profiles (
      profile_id,
      sector
    ) values (
      new.id,
      meta->>'sector'
    );
  end if;

  -- 3. Insert QUESTIONNAIRE RESPONSES if provided
  if meta ? 'questionnaire_responses' then
    insert into public.questionnaire_responses (
      profile_id,
      responses,
      project_summary
    ) values (
      new.id,
      (meta->>'questionnaire_responses')::jsonb,
      meta->>'project_summary'
    );
  end if;

  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists to avoid duplication errors on re-run
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
