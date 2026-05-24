# Investment Bridge (مرفأ)

Next.js platform for startup scoring, tender aggregation, and financial news — built for the Saudi market.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS 4
- **Deployment:** Vercel (auto-deploys from `main`)
- **Auth:** Supabase Auth
- **CI:** GitHub Actions (test + build)

## Getting Started

```bash
cp .env.example .env.local    # fill in your Supabase keys
npm install
npm run dev                    # http://localhost:3000
```

## Environment Variables

All env vars live in `.env.local` (local) and Vercel dashboard (production).

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | `https://<ref>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Public anon key — **plain text** in Vercel, never Secret |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Service role key — can be Secret in Vercel |
| `ANTHROPIC_API_KEY` | ❌ | Claude API for AI article summarization |
| `CRON_SECRET` | ❌ | Token for `/api/cron/daily` endpoint |
| `RESEND_API_KEY` | ❌ | Email notifications |
| `STRAVA_CLIENT_ID` / `STRAVA_CLIENT_SECRET` | ❌ | Strava integration |

> ⚠️ **Vercel critical:** `NEXT_PUBLIC_*` vars must be **plain text** (not Secret). If marked Secret, the browser receives `undefined` and the site crashes.

## Supabase Architecture

### Client Factories (single source of truth)

| File | Client Type | Auth Level | Use For |
|---|---|---|---|
| `lib/supabase/config.ts` | **Config only** | — | Centralized env var getters (no hardcoded fallbacks) |
| `lib/supabase/server.ts` | `createServerClient` (ssr) | Anon (user sessions) | Server Components, Server Actions, API routes |
| `lib/supabase/client.ts` | `createBrowserClient` (ssr) | Anon (user sessions) | Client Components (`'use client'`) |
| `lib/supabase/service.ts` | `createClient` (supabase-js) | **Service Role** (bypasses RLS) | Scraper, cron jobs, seed scripts |
| `lib/supabase/middleware.ts` | `createServerClient` (ssr) | Anon (user sessions) | Next.js middleware (session refresh) |

### Key Rules

1. **Never read env vars at module scope** — Next.js inlines them at build time. Always use the getter functions from `lib/supabase/config.ts`.
2. **No hardcoded URLs or keys** — everything comes from env vars. If a required var is missing, the app throws a clear error message at runtime.
3. **Server Components use `@/lib/supabase/server`** — `await createClient()` returns a cookie-aware client.
4. **Client Components use `@/lib/supabase/client`** — `createClient()` returns a browser client.
5. **Admin operations use `@/lib/supabase/service`** — `createServiceClient()` returns a service-role client that bypasses RLS.

### Database Migrations

All schema changes are tracked in `supabase/migrations/` as SQL files. Apply them via Supabase dashboard SQL Editor:

1. Go to https://supabase.com/dashboard/project/<ref>/sql/new
2. Paste and run the migration SQL

Key tables: `profiles`, `tenders`, `financial_news_articles`, `meetings`, `announcements`, `news_feed`, `marfa_ideas`, `strava_connections`, `investor_requests`

## Deployment

Vercel auto-deploys when you push to `main`. GitHub Actions runs tests and build.

```bash
git add .
git commit -m "descriptive message"
git push origin main
```

### Updating Env Vars in Production

1. Go to Vercel → Project Settings → Environment Variables
2. Edit the variable — ensure Production scope is checked
3. Redeploy (or push to `main`)

## Cron Jobs

| Path | Schedule | Purpose |
|---|---|---|
| `/api/cron/daily?token=<CRON_SECRET>` | Daily 6:00 AM | Scrape + save financial news from Argaam |

## Troubleshooting

### "TypeError: fetch failed" when saving scraped articles

→ Supabase project URL doesn't resolve. Check `NEXT_PUBLIC_SUPABASE_URL` in Vercel. May need to migrate to a new project — see **Migration Checklist** below.

### "Invalid API key"

→ `SUPABASE_SERVICE_ROLE_KEY` (or `NEXT_PUBLIC_SUPABASE_ANON_KEY`) doesn't match the project at `NEXT_PUBLIC_SUPABASE_URL`. Update the key in Vercel.

### "Could not find the table"

→ The table doesn't exist on the target Supabase project. Run the migration SQL in Supabase dashboard.

### Public `/financial-news` shows empty after scraping

→ The page reads from Supabase. If `NEXT_PUBLIC_SUPABASE_ANON_KEY` is wrong or marked Secret in Vercel, queries silently fail. Verify the key is plain text in Vercel.

### "MIDDLEWARE_INVOCATION_TIMEOUT" (504)

→ Public paths don't need auth checks. The middleware skips Supabase for public paths defined in `lib/supabase/middleware.ts`.

## Migration Checklist (New Supabase Project)

If you need to switch to a new Supabase project:

1. **Create the new project** at https://supabase.com/dashboard
2. **Get API keys** from Project Settings → API
3. **Update `.env.local`** — all three Supabase vars
4. **Update Vercel env vars** — all three, production scope, `NEXT_PUBLIC_*` as plain text
5. **Create tables** via Supabase SQL Editor — run migrations from `supabase/migrations/`
6. **Push to `main`** — Vercel auto-deploys

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm test` | Run Jest tests |
| `scripts/verify_security.js` | Test RLS policies |
| `scripts/test_helper.js` | Debug auth/login |
| `fix_prod_admin.js` | Fix admin user in production |
| `insert_prod_profile.js` | Create profiles manually |

All scripts read env vars from `.env.local` via `dotenv` — no hardcoded keys.
