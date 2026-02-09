-- ==========================================
-- Real-time Features Schema (News, Meetings, Announcements)
-- ==========================================

-- 1. NEWS FEED Table
create table if not exists public.news_feed (
  id uuid default gen_random_uuid() primary key,
  source text not null check (source in ('local', 'global', 'hail')),
  category text,
  text text not null,
  link text,
  created_at timestamptz default timezone('utc', now())
);

-- Enable RLS for news_feed
alter table public.news_feed enable row level security;

-- Policies for news_feed
drop policy if exists "News items are viewable by everyone" on news_feed;
create policy "News items are viewable by everyone"
  on news_feed for select
  using ( true );

drop policy if exists "Only admins can manage news items" on news_feed;
create policy "Only admins can manage news items"
  on news_feed for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- 2. MEETINGS Table
create table if not exists public.meetings (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  scheduled_at timestamptz not null,
  investor_id uuid references public.profiles(id),
  entrepreneur_id uuid references public.profiles(id),
  status text default 'scheduled' check (status in ('scheduled', 'ongoing', 'completed', 'cancelled')),
  meeting_link text,
  created_at timestamptz default timezone('utc', now())
);

-- Enable RLS for meetings
alter table public.meetings enable row level security;

-- Policies for meetings
drop policy if exists "Users can view their own meetings" on meetings;
create policy "Users can view their own meetings"
  on meetings for select
  using (
    auth.uid() = investor_id OR 
    auth.uid() = entrepreneur_id OR 
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- 3. ANNOUNCEMENTS Table (Academy & System)
create table if not exists public.announcements (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text,
  type text default 'general' check (type in ('general', 'academy', 'system')),
  target_role text check (target_role in ('investor', 'entrepreneur', 'all')),
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz default timezone('utc', now())
);

-- Enable RLS for announcements
alter table public.announcements enable row level security;

-- Policies for announcements
drop policy if exists "Announcements are viewable by target roles" on announcements;
create policy "Announcements are viewable by target roles"
  on announcements for select
  using (
    target_role = 'all' OR 
    exists (
      select 1 from public.profiles 
      where profiles.id = auth.uid() 
      and (profiles.role = announcements.target_role OR profiles.role = 'admin')
    )
  );

-- Enable Real-time for these tables
begin;
  -- Remove existing if any to avoid duplicates
  alter publication supabase_realtime disable table public.news_feed, public.meetings, public.announcements;
  -- Append to publication
  alter publication supabase_realtime add table public.news_feed;
  alter publication supabase_realtime add table public.meetings;
  alter publication supabase_realtime add table public.announcements;
commit;

-- Insert INITIAL MOCK DATA for news_feed
insert into public.news_feed (source, category, text, link) values
('local', 'السوق السعودي', 'تاسي يغلق على ارتفاع 1.2% بدعم من قطاع البنوك وتحسن السيولة.', 'https://argaam.com'),
('global', 'مصطلح استثماري', 'ما هو ''رأس المال الجريء'' (VC)؟ وكيف يختلف عن الأسهم التقليدية؟', 'https://investopedia.com'),
('hail', 'فرص حائل', 'إطلاق موسم حائل السياحي يفتح فرصاً جديدة لقطاع الضيافة والمخيمات.', '#'),
('local', 'لوائح', 'وزارة الاستثمار: تحديثات جديدة تسهل دخول المستثمر الأجنبي في القطاع الصحي.', '#');
