import { createBrowserClient } from '@supabase/ssr';
import { getSupabaseUrl, getSupabaseAnonKey } from './config';

/**
 * Create a Supabase browser client for Client Components.
 * NEXT_PUBLIC_ vars are inlined at build time for the browser bundle,
 * but we still use the config getters for consistency and validation.
 */
export function createClient() {
  return createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey());
}
