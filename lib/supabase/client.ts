
import { createBrowserClient } from '@supabase/ssr'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tkokgarmxcgvsedtgben.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrb2tnYXJteGNndnNlZHRnYmVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4NTU1NjcsImV4cCI6MjA4NTQzMTU2N30.vr_eNpSUfSwODDt8t9EFQlN1rKwiIRhCj0JBsSrnwnE'

export function createClient() {
    return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}
