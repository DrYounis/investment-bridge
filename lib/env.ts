/**
 * Runtime Environment Validation
 * Validates required environment variables at application startup
 */

import { z } from 'zod';

const envSchema = z.object({
  // Supabase (required)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Must be a valid URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(10, 'Invalid Supabase anon key'),
  
  // Supabase Service Role (optional - only needed for admin features)
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(10, 'Invalid Supabase service role key').optional(),

  // Strava (optional)
  STRAVA_CLIENT_ID: z.string().optional(),
  STRAVA_CLIENT_SECRET: z.string().optional(),
  NEXT_PUBLIC_STRAVA_REDIRECT_URI: z.string().url().optional(),

  // Resend Email (optional - only needed for email features)
  RESEND_API_KEY: z.string().min(10, 'Invalid Resend API key').optional(),
  ADMIN_EMAIL: z.string().email('Invalid admin email').optional(),

  // Optional: Sentry
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),

  // Optional: Rate Limiting
  RATE_LIMIT_ENABLED: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validate all required environment variables
 * @throws Error if validation fails
 */
export function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const error = result.error;
    const issues = error.issues || [];
    const errors = issues.map((err: any) =>
      `${err.path.join('.')}: ${err.message}`
    ).join('\n  - ');

    throw new Error(
      `❌ Environment validation failed:\n  - ${errors}\n\n` +
      `Please check your .env.local file and ensure all required variables are set.`
    );
  }

  return result.data;
}

/**
 * Get validated environment variables
 * Only use this in server-side code
 */
export function getEnv(): Env {
  // Cache validation result
  if (!(globalThis as any).__validatedEnv) {
    (globalThis as any).__validatedEnv = validateEnv();
  }
  return (globalThis as any).__validatedEnv;
}

/**
 * Check if running in production
 */
export const isProd = process.env.NODE_ENV === 'production';

/**
 * Check if running in development
 */
export const isDev = process.env.NODE_ENV === 'development';
