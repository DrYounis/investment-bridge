-- Migration: majlis attendance tracking + student numbers
-- Run manually in Supabase SQL Editor (do not run this file via CLI).
-- Idempotent — safe to re-run.

-- 1. Add student_number to profiles (registration seniority, oldest = 1)
alter table public.profiles add column if not exists student_number integer unique;

-- 2. Backfill existing profiles by created_at ascending
with numbered as (
  select id, row_number() over (order by created_at asc) as rn
  from public.profiles
  where student_number is null
)
update public.profiles p
set student_number = numbered.rn
from numbered
where p.id = numbered.id;

-- 3. Sequence + trigger to auto-assign on new signups
create sequence if not exists public.student_number_seq;
select setval('public.student_number_seq', (select coalesce(max(student_number), 0) from public.profiles));

create or replace function public.assign_student_number() returns trigger as $$
begin
  if new.student_number is null then new.student_number := nextval('public.student_number_seq'); end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_assign_student_number on public.profiles;
create trigger trg_assign_student_number
  before insert on public.profiles
  for each row execute function public.assign_student_number();

-- 4. Attendance table — service-role only, no RLS policies
create table if not exists public.majlis_attendance (
  id uuid default gen_random_uuid() primary key,
  meeting_number smallint not null check (meeting_number between 1 and 27),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  attended_at timestamptz default timezone('utc', now()),
  recorded_by uuid references public.profiles(id),
  unique(meeting_number, profile_id)
);
alter table public.majlis_attendance enable row level security;

create index if not exists idx_attendance_meeting on public.majlis_attendance(meeting_number);
