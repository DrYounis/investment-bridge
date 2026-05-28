import { createClient } from './client';

/**
 * Singleton Supabase browser client for Client Components.
 * Import as: import { supabase } from '@/lib/supabase/browser'
 */
export const supabase = createClient();
