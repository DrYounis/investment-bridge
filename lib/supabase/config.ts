/**
 * Centralized Supabase Configuration
 *
 * Single source of truth for Supabase environment variables.
 * All client factories import from here — no scattered env reads, no hardcoded fallbacks.
 *
 * RUNTIME-SAFE: All getter functions read process.env at call time,
 * not at module scope. This is critical for Next.js serverless deployments
 * where env vars are injected at request time, not build time.
 */

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
        `Set it in .env.local (local dev) or Vercel dashboard (production).`
    );
  }
  return value;
}

// ── Supabase Project ────────────────────────────────────────────────

export function getSupabaseUrl(): string {
  // MUST use dot notation — Next.js inlines NEXT_PUBLIC_ vars at build time
  // via string replacement. Bracket notation (process.env[key]) is NOT replaced.
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!value) {
    throw new Error(
      `Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL\n` +
        `Set it in .env.local (local dev) or Vercel dashboard (production).`
    );
  }
  return value;
}

export function getSupabaseAnonKey(): string {
  const value = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!value) {
    throw new Error(
      `Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY\n` +
        `Set it in .env.local (local dev) or Vercel dashboard (production).`
    );
  }
  return value;
}

export function getSupabaseServiceKey(): string {
  return requireEnv('SUPABASE_SERVICE_ROLE_KEY');
}
