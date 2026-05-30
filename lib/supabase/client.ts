import { createBrowserClient } from '@supabase/ssr';
import { getSupabaseUrl, getSupabaseAnonKey } from './config';

/**
 * Create a Supabase browser client for Client Components.
 * Uses @supabase/ssr createBrowserClient — this is REQUIRED for cookie-based
 * session management so the server-side middleware can see the auth session.
 */
export function createClient() {
  return createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey());
}
