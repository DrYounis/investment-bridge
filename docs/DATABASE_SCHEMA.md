# Database Schema Documentation

**Investment Bridge Platform** - Supabase Database Schema

Last Updated: March 2026

---

## Overview

This document describes the database schema for the Investment Bridge platform, a Next.js + Supabase application that connects investors with entrepreneurs in Saudi Arabia.

### Database Provider
- **Platform**: Supabase (PostgreSQL)
- **RLS Enabled**: Yes (Row Level Security on all tables)

---

## Entity Relationship Diagram

```
┌─────────────────────┐
│   auth.users        │ (Supabase Auth)
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    profiles         │
└──────────┬──────────┘
           │
     ┌─────┴─────┬──────────────┐
     ▼           ▼              ▼
┌─────────┐ ┌──────────┐  ┌──────────────────┐
│investor │ │entrepre- │  │strava_connections│
│_profiles│ │neur_     │  └──────────────────┘
└─────────┘ │profiles  │
     │      └────┬─────┘
     │           │
     │      ┌────┴────────┐
     │      │questionnaire│
     │      │_responses   │
     │      └─────────────┘
     │
     ▼
┌─────────────────────┐
│investor_requests    │
└─────────────────────┘

┌─────────────────────┐
│investment_          │
│opportunities        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│investor_            │
│interactions         │
└─────────────────────┘
```

---

## Core Tables

### 1. `profiles`

Main user profile table linked to Supabase Auth.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, FK → auth.users | User ID from Supabase Auth |
| `full_name` | TEXT | | Full name (English) |
| `full_name_ar` | TEXT | | Full name (Arabic) |
| `role` | TEXT | DEFAULT 'investor' | User role: investor, entrepreneur, admin |
| `email` | TEXT | | User email address |
| `phone` | TEXT | | Phone number |
| `user_type` | TEXT | | Additional user type classification |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT now() | Last update timestamp |

**RLS Policies:**
- Users can view their own profile
- Public profiles visible based on role
- Admins can view all profiles

---

### 2. `investor_profiles`

Extended profile data for verified investors.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Unique identifier |
| `profile_id` | UUID | FK → profiles, UNIQUE | Reference to main profile |
| `approval_status` | TEXT | CHECK (pending/approved/rejected) | Admin approval status |
| `commercial_register` | VARCHAR(50) | | Commercial registration number |
| `experience_level` | TEXT | | Investment experience level |
| `investment_amount` | TEXT | | Preferred investment range |
| `risk_tolerance` | TEXT | | Risk tolerance level |
| `investment_duration` | TEXT | | Preferred investment duration |
| `preferred_sectors` | JSONB | | Preferred investment sectors |
| `expected_return` | TEXT | | Expected ROI percentage |
| `approved_at` | TIMESTAMPTZ | | Approval timestamp |
| `approved_by` | UUID | FK → profiles | Admin who approved |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Creation timestamp |

**RLS Policies:**
- Investors can view their own profile
- Admins can view and update all profiles

---

### 3. `entrepreneur_profiles`

Extended profile data for entrepreneurs.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Unique identifier |
| `profile_id` | UUID | FK → profiles, UNIQUE | Reference to main profile |
| `sector` | TEXT | | Business sector |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Creation timestamp |

**RLS Policies:**
- Entrepreneurs can view their own profile
- Admins can view all profiles

---

### 4. `investment_opportunities`

Investment opportunities posted by entrepreneurs.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Unique identifier |
| `entrepreneur_id` | UUID | FK → profiles | Posting entrepreneur |
| `title` | TEXT | NOT NULL | Opportunity title |
| `sector` | TEXT | | Business sector |
| `location` | TEXT | | Geographic location |
| `status` | TEXT | CHECK (draft/submitted/under_review/published/funded/closed) | Current status |
| `summary` | TEXT | | Brief summary |
| `detailed_description` | TEXT | | Full description |
| `target_amount` | NUMERIC | | Target funding amount |
| `raised_amount` | NUMERIC | DEFAULT 0 | Amount raised so far |
| `roi_percentage` | NUMERIC | | Expected ROI percentage |
| `payback_period` | TEXT | | Investment payback period |
| `questionnaire_data` | JSONB | | Assessment questionnaire responses |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Creation timestamp |
| `published_at` | TIMESTAMPTZ | | Publication timestamp |

**RLS Policies:**
- Entrepreneurs can manage their own opportunities
- Investors can view published opportunities
- Admins can view and update all

---

### 5. `questionnaire_responses`

Responses to the onboarding questionnaire.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Unique identifier |
| `profile_id` | UUID | FK → profiles | User who responded |
| `responses` | JSONB | NOT NULL | Questionnaire responses |
| `project_summary` | TEXT | | Generated project summary |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Response timestamp |

**RLS Policies:**
- Users can view their own responses
- Admins can view all responses

---

### 6. `investor_interactions`

Tracks investor interactions with opportunities.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Unique identifier |
| `investor_id` | UUID | FK → profiles | Investor |
| `project_id` | UUID | FK → investment_opportunities | Opportunity |
| `unlocked_at` | TIMESTAMPTZ | DEFAULT now() | When interaction was created |
| `agreement_signed` | BOOLEAN | DEFAULT false | NDA/agreement status |
| `decision` | interaction_status | DEFAULT 'pending' | ENUM: pending/connected/passed/expired |
| `decision_at` | TIMESTAMPTZ | | Decision timestamp |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Creation timestamp |

**Unique Constraint:** (investor_id, project_id)

**RLS Policies:**
- Investors can view their own interactions
- Entrepreneurs can view interactions for their projects
- Admins can view all interactions

---

### 7. `investor_requests`

Requests from investors to connect with opportunities.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Unique identifier |
| `investor_id` | UUID | FK → profiles | Requesting investor |
| `project_name` | TEXT | NOT NULL | Project name |
| `project_url` | TEXT | NOT NULL | Project URL/reference |
| `status` | TEXT | DEFAULT 'pending' | pending/under_review/contacted/closed |
| `requested_at` | TIMESTAMPTZ | DEFAULT now() | Request timestamp |
| `notes` | TEXT | | Admin notes |

**Indexes:**
- `idx_investor_requests_investor_id` on (investor_id)
- `idx_investor_requests_status` on (status)

**RLS Policies:**
- Investors can create and view their own requests
- Admins can view and update all requests

---

### 8. `strava_connections`

Strava API connections for marathon/fitness tracking.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Unique identifier |
| `user_id` | UUID | FK → auth.users | User ID |
| `athlete_id` | BIGINT | NOT NULL, UNIQUE | Strava athlete ID |
| `access_token` | TEXT | NOT NULL | OAuth access token |
| `refresh_token` | TEXT | NOT NULL | OAuth refresh token |
| `expires_at` | BIGINT | NOT NULL | Token expiration timestamp |
| `athlete_name` | TEXT | | Athlete display name |
| `athlete_profile_url` | TEXT | | Profile image URL |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Connection timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT now() | Last update timestamp |

**Unique Constraints:** (user_id), (athlete_id)

**Indexes:**
- `idx_strava_connections_user_id` on (user_id)
- `idx_strava_connections_athlete_id` on (athlete_id)

**Triggers:**
- `update_strava_connections_updated_at` - Auto-updates updated_at

**RLS Policies:**
- Users can only access their own connections

---

## Custom Types

### `interaction_status` (ENUM)

```sql
CREATE TYPE interaction_status AS ENUM (
  'pending',
  'connected',
  'passed',
  'expired'
);
```

---

## Security Considerations

### Row Level Security (RLS)

All tables have RLS enabled. Key principles:

1. **User Isolation**: Users can only access their own data
2. **Role-Based Access**: Admins have elevated privileges
3. **Public Data**: Only specific fields are publicly accessible

### Sensitive Data

- **Tokens**: Strava tokens stored encrypted at rest (Supabase Vault recommended)
- **PII**: Email, phone protected by RLS
- **Financial Data**: Investment amounts visible only to authorized users

---

## Migration History

| Migration | Date | Description |
|-----------|------|-------------|
| `20260203211500` | 2026-02-03 | Cleanup unused tables |
| `20260203215500` | 2026-02-03 | Allow admin role |
| `20260206154500` | 2026-02-06 | Realtime tables setup |
| `20260209220000` | 2026-02-09 | Seed meetings & announcements |
| `20260211000000` | 2026-02-11 | Create strava_connections |
| `20260214000000` | 2026-02-14 | Fix profiles security |
| `20260214000150` | 2026-02-14 | Create missing tables |
| `20260215000000` | 2026-02-15 | Create investor_requests |

---

## Useful Queries

### Get investor with their profile

```sql
SELECT 
  p.*,
  ip.approval_status,
  ip.preferred_sectors
FROM profiles p
LEFT JOIN investor_profiles ip ON p.id = ip.profile_id
WHERE p.role = 'investor';
```

### Get published opportunities with entrepreneur info

```sql
SELECT 
  io.*,
  p.full_name,
  p.full_name_ar
FROM investment_opportunities io
JOIN profiles p ON io.entrepreneur_id = p.id
WHERE io.status = 'published';
```

### Get investor interactions with project details

```sql
SELECT 
  ii.*,
  io.title,
  io.sector
FROM investor_interactions ii
JOIN investment_opportunities io ON ii.project_id = io.id
WHERE ii.investor_id = $1;
```

---

## Contact

For database questions or schema change requests, contact the development team.
