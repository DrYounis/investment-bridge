import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { getSupabaseUrl, getSupabaseAnonKey } from './config';

/**
 * Create a Supabase browser client for Client Components.
 * Uses the standard @supabase/supabase-js client (localStorage-based)
 * instead of @supabase/ssr to avoid cookie/SSR issues in browser contexts.
 */
export function createClient() {
  return createSupabaseClient(getSupabaseUrl(), getSupabaseAnonKey());
}
