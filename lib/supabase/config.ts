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
  return requireEnv('NEXT_PUBLIC_SUPABASE_URL');
}

export function getSupabaseAnonKey(): string {
  return requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export function getSupabaseServiceKey(): string {
  return requireEnv('SUPABASE_SERVICE_ROLE_KEY');
}
