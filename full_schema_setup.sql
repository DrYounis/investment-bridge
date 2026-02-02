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

create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

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

create policy "Users can manage their own responses"
  on questionnaire_responses for all
  using ( auth.uid() = profile_id );

-- 4. Create INVESTOR INTERACTIONS table (For Shark Tank Flow)
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
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email, coalesce(new.raw_user_meta_data->>'role', 'investor'));
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists to avoid duplication errors on re-run
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
