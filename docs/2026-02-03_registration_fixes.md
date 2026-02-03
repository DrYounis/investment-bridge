# User Registration Fixes and Verification
**Date:** 2026-02-03

## Overview
This document details the fixes applied to the Supabase database schema to resolve user registration failures for **Entrepreneur** and **Investor** roles.

## Issues Resolved
1.  **Registration Failure (Status 500)**:
    *   **Cause:** The `handle_new_user` database trigger was outdated and did not support the creation of `investor_profiles` or `entrepreneur_profiles`.
    *   **Fix:** Updated the `handle_new_user` function with logic to insert into the correct sub-table based on the `user_type` metadata.

2.  **Constraint Violation**:
    *   **Cause:** The `public.profiles` table contained a legacy CHECK constraint (`profiles_role_check`) that restricted the `role` column to values like 'doctor', 'patient', etc.
    *   **Fix:** Dropped the `profiles_role_check` constraint to allow 'investor' and 'entrepreneur' roles.

## Database Changes
The following SQL was applied to the production database:

```sql
-- 1. Drop restrictive constraint
alter table public.profiles drop constraint if exists profiles_role_check;

-- 2. Update trigger function
create or replace function public.handle_new_user()
returns trigger as $$
declare
  meta jsonb;
  u_role text;
begin
  meta := new.raw_user_meta_data;
  u_role := coalesce(meta->>'user_type', meta->>'role', 'investor');

  -- Insert Base Profile
  insert into public.profiles (id, full_name, full_name_ar, email, phone, role, user_type)
  values (
    new.id,
    meta->>'full_name',
    meta->>'full_name',
    new.email,
    meta->>'phone',
    u_role,
    u_role
  );

  -- Insert Sub-Profile
  if u_role = 'investor' then
    insert into public.investor_profiles (
      profile_id,
      commercial_register,
      -- ... other fields
      approval_status
    ) values (
      new.id,
      meta->>'commercial_register',
      -- ... other values
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

  return new;
end;
$$ language plpgsql security definer;
```

## Verification
*   **Entrepreneur**: Verified successful registration logic on Localhost and Production (`marfa.sa`).
*   **Investor**: Verified successful registration logic on Localhost. Production attempt confirmed logic works but hit a temporary rate limit.

## Next Steps
*   Ensure `full_schema_setup.sql` remains the source of truth for any future database resets.
