
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wxvkzutexitcllyewbnw.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4dmt6dXRleGl0Y2xseWV3Ym53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NDg5MjUsImV4cCI6MjA5NTEyNDkyNX0.ao4kNJe7kPOVM8gCjrwAWuSAMkqRYKx62OTSwYA0NSY'

/**
 * Create a Supabase server client for use in Server Components and Server Actions
 * Uses validated environment variables
 */
export async function createClient() {
    const cookieStore = await cookies()

    return createServerClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value, ...options })
                    } catch (error) {
                        // The `set` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value: '', ...options })
                    } catch (error) {
                        // The `delete` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )
}
