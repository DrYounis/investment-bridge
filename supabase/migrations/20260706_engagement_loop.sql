-- 1. Readiness scores (one row per entrepreneur, recomputed on demand)
create table if not exists readiness_scores (
  user_id uuid primary key references auth.users(id) on delete cascade,
  total_score int not null default 0 check (total_score between 0 and 100),
  grade text not null default 'D' check (grade in ('A','B','C','D')),
  team_score int not null default 0 check (team_score between 0 and 25),
  financials_score int not null default 0 check (financials_score between 0 and 25),
  pitch_score int not null default 0 check (pitch_score between 0 and 25),
  traction_score int not null default 0 check (traction_score between 0 and 25),
  last_ai_audit_id uuid,
  updated_at timestamptz not null default now()
);

-- 2. AI pitch audits (history of Claude critiques)
create table if not exists pitch_audits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pitch_text text,
  strengths jsonb not null default '[]'::jsonb,
  gaps jsonb not null default '[]'::jsonb,
  investor_questions jsonb not null default '[]'::jsonb,
  suggested_scores jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- 3. Investor signals (anonymized activity shown to entrepreneurs)
create table if not exists investor_signals (
  id uuid primary key default gen_random_uuid(),
  entrepreneur_id uuid not null references auth.users(id) on delete cascade,
  investor_id uuid references auth.users(id) on delete set null,
  signal_type text not null check (signal_type in ('profile_view','deck_download','interest','sector_view')),
  sector text,
  created_at timestamptz not null default now()
);
create index if not exists idx_investor_signals_entrepreneur on investor_signals(entrepreneur_id, created_at desc);

-- 4. Deal rooms (MVP)
create table if not exists deal_rooms (
  id uuid primary key default gen_random_uuid(),
  entrepreneur_id uuid not null references auth.users(id) on delete cascade,
  investor_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','active','closed')),
  nda_acknowledged_by_investor boolean not null default false,
  nda_acknowledged_by_entrepreneur boolean not null default false,
  created_at timestamptz not null default now(),
  unique (entrepreneur_id, investor_id)
);

create table if not exists deal_room_messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references deal_rooms(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_deal_room_messages_room on deal_room_messages(room_id, created_at);

-- 5. Weekly digest opt-in flag on profiles
alter table profiles add column if not exists weekly_digest_enabled boolean not null default true;

-- 6. Financial projections flag on profiles (for readiness scoring)
alter table profiles add column if not exists has_financial_projections boolean not null default false;

-- RLS
alter table readiness_scores enable row level security;
alter table pitch_audits enable row level security;
alter table investor_signals enable row level security;
alter table deal_rooms enable row level security;
alter table deal_room_messages enable row level security;

create policy "own readiness" on readiness_scores for select using (auth.uid() = user_id);
create policy "own audits" on pitch_audits for select using (auth.uid() = user_id);
create policy "own audits insert" on pitch_audits for insert with check (auth.uid() = user_id);
create policy "own signals" on investor_signals for select using (auth.uid() = entrepreneur_id);
create policy "signal insert by investor" on investor_signals for insert with check (auth.uid() = investor_id);
create policy "room participants read" on deal_rooms for select using (auth.uid() in (entrepreneur_id, investor_id));
create policy "room participants update" on deal_rooms for update using (auth.uid() in (entrepreneur_id, investor_id));
create policy "room create by investor" on deal_rooms for insert with check (auth.uid() = investor_id);
create policy "room messages read" on deal_room_messages for select using (
  exists (select 1 from deal_rooms r where r.id = room_id and auth.uid() in (r.entrepreneur_id, r.investor_id))
);
create policy "room messages send" on deal_room_messages for insert with check (
  auth.uid() = sender_id and exists (
    select 1 from deal_rooms r where r.id = room_id and r.status = 'active' and auth.uid() in (r.entrepreneur_id, r.investor_id)
  )
);
