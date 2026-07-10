import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseUrl, getSupabaseServiceKey } from './config';

/**
 * Create a Supabase client with service_role privileges.
 * Bypasses RLS — use only for admin operations (scraper, cron, seed scripts).
 * Reads the service key at call time, never at module scope.
 */
export function createServiceClient() {
  return createClient(getSupabaseUrl(), getSupabaseServiceKey());
}
