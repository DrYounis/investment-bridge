import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Server-side super-admin auth gate.
 * Rejects with 401/403 — call at the top of every instructor API route.
 *
 * Checks BOTH:
 *   1. user.email === process.env.SUPER_ADMIN_EMAIL
 *   2. profiles.user_type === 'super_admin' for that user id
 *
 * Uses server-side env var (SUPER_ADMIN_EMAIL), never NEXT_PUBLIC_.
 */
export async function requireSuperAdmin(): Promise<
  | { authorized: true; userId: string }
  | { authorized: false; response: NextResponse }
> {
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
  if (!superAdminEmail) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Service not configured' },
        { status: 503 }
      ),
    };
  }

  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      authorized: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  if (user.email !== superAdminEmail) {
    return {
      authorized: false,
      response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
    };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('user_type')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile || profile.user_type !== 'super_admin') {
    return {
      authorized: false,
      response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
    };
  }

  return { authorized: true, userId: user.id };
}
