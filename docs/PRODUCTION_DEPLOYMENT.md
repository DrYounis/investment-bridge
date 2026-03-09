# Production Deployment Guide

**Investment Bridge Platform** - Production Environment Setup

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Vercel Deployment](#vercel-deployment)
4. [Supabase Production Setup](#supabase-production-setup)
5. [Monitoring & Alerts](#monitoring--alerts)
6. [Post-Deployment Checklist](#post-deployment-checklist)

---

## Prerequisites

Before deploying to production, ensure you have:

- [ ] **Vercel Account** with project created
- [ ] **Supabase Project** (production instance)
- [ ] **Domain** configured in Vercel
- [ ] **Strava API Application** created
- [ ] **Resend Account** with verified domain
- [ ] **Sentry Project** (optional, for error monitoring)

---

## Environment Variables

### Required Variables

Set these in **Vercel Project Settings → Environment Variables**:

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role (secret) | Supabase Dashboard → Settings → API |
| `STRAVA_CLIENT_ID` | Strava API client ID | https://www.strava.com/settings/api |
| `STRAVA_CLIENT_SECRET` | Strava API client secret | https://www.strava.com/settings/api |
| `NEXT_PUBLIC_STRAVA_REDIRECT_URI` | Strava callback URL | Your production domain |
| `RESEND_API_KEY` | Resend email API key | https://resend.com/api-keys |
| `ADMIN_EMAIL` | Admin notification email | Your admin email |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN for error monitoring | - |
| `SENTRY_ORG` | Sentry organization slug | - |
| `SENTRY_PROJECT` | Sentry project name | - |
| `RATE_LIMIT_ENABLED` | Enable rate limiting | `true` |

### Setting Variables in Vercel

```bash
# Or use the Vercel CLI
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add STRAVA_CLIENT_ID production
vercel env add STRAVA_CLIENT_SECRET production
vercel env add NEXT_PUBLIC_STRAVA_REDIRECT_URI production
vercel env add RESEND_API_KEY production
vercel env add ADMIN_EMAIL production
```

---

## Vercel Deployment

### 1. Connect Repository

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link
```

### 2. Deploy

```bash
# Deploy to production
vercel --prod
```

### 3. Configure Build Settings

In `vercel.json` (already configured):

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

### 4. Domain Setup

1. Go to Vercel Dashboard → Your Project
2. Navigate to **Settings → Domains**
3. Add your custom domain (e.g., `marfa.sa`)
4. Update DNS records as instructed

---

## Supabase Production Setup

### 1. Run Migrations

Apply all migrations in order:

```bash
# In Supabase Dashboard → SQL Editor
# Run each migration file in /supabase/migrations/
```

**Migration Order:**
1. `20260203211500_cleanup_unused_tables.sql`
2. `20260203215500_allow_admin_role.sql`
3. `20260206154500_realtime_tables.sql`
4. `20260209220000_seed_meetings_announcements.sql`
5. `20260211000000_create_strava_connections.sql`
6. `20260214000000_fix_profiles_security.sql`
7. `20260214000150_create_missing_tables.sql`
8. `20260215000000_create_investor_requests.sql`
9. `20260215000100_fix_investor_requests_fk.sql`

### 2. Create Admin User

```sql
-- After deploying, create admin user
-- Run in Supabase SQL Editor or via script

-- First, sign up a user normally, then:
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-admin-email@example.com';
```

### 3. Configure Auth Settings

In Supabase Dashboard → Authentication → URL Configuration:

- **Site URL**: `https://yourdomain.com`
- **Redirect URLs**: 
  - `https://yourdomain.com/auth/callback`
  - `https://yourdomain.com/dashboard/*`

---

## Strava API Setup

### 1. Create Application

1. Go to https://www.strava.com/settings/api
2. Click **Create Application**
3. Fill in:
   - **Application Name**: Investment Bridge
   - **Category**: Other
   - **Website**: `https://yourdomain.com`
   - **Authorization Callback Domain**: `yourdomain.com`

### 2. Update Credentials

Copy the **Client ID** and **Client Secret** to Vercel environment variables.

---

## Resend Email Setup

### 1. Verify Domain

1. Go to https://resend.com/domains
2. Add your domain
3. Add DNS records (SPF, DKIM)
4. Wait for verification

### 2. Create API Key

1. Go to https://resend.com/api-keys
2. Create new API key
3. Copy to Vercel environment variables

---

## Monitoring & Alerts

### Health Check Endpoint

The application includes a health check endpoint:

```
GET https://yourdomain.com/api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-03-08T12:00:00.000Z",
  "version": "0.1.0",
  "checks": {
    "supabase": { "status": "ok", "responseTime": 45 },
    "environment": { "status": "ok", "missingVars": [] }
  },
  "uptime": 12345.67
}
```

### Uptime Monitoring

Set up monitoring with:

1. **UptimeRobot** (free): https://uptimerobot.com/
2. **Pingdom** (paid): https://www.pingdom.com/
3. **Checkly** (API monitoring): https://www.checklyhq.com/

Monitor:
- `/api/health` every 5 minutes
- Homepage `/` every 5 minutes
- Set up SMS/email alerts

### Sentry Error Monitoring

1. Create project at https://sentry.io/
2. Add DSN to environment variables
3. Errors will be automatically tracked

---

## Post-Deployment Checklist

### Immediate Tests

- [ ] Homepage loads correctly
- [ ] Login/Registration works
- [ ] Dashboard accessible for both roles
- [ ] Meeting scheduler sends emails
- [ ] Strava connection works (if applicable)
- [ ] Health check returns 200

### Security Verification

- [ ] RLS policies are active
- [ ] Environment variables are set correctly
- [ ] No sensitive data exposed in client bundle
- [ ] Rate limiting is working

### Performance

- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 5s

### SEO

- [ ] Meta tags are correct
- [ ] Open Graph images generate
- [ ] Sitemap is accessible

---

## Rollback Procedure

If deployment fails:

```bash
# Rollback to previous deployment
vercel rollback [deployment-url]
```

Or in Vercel Dashboard:
1. Go to Deployments
2. Find last working deployment
3. Click **Promote to Production**

---

## Support

For deployment issues:

1. Check Vercel logs: `vercel logs`
2. Check Supabase logs: Dashboard → Logs
3. Review Sentry errors (if configured)

---

## Environment Comparison

| Setting | Development | Production |
|---------|-------------|------------|
| Supabase URL | Local/Dev project | Production project |
| Strava Redirect | `localhost:3000` | `yourdomain.com` |
| Rate Limiting | Disabled | Enabled |
| Sentry | Disabled | Enabled |
| Debug Mode | Enabled | Disabled |

---

## Contact

For production access or emergencies, contact the development team.
