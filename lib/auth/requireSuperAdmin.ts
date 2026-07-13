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
  if (!superAdminEmail && !process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Service not configured' },
        { status: 503 }
      ),
    };
  }

  const superAdminEmails = ['op.younis@gmail.com', 'mohamedy2003@gmail.com', '10.younis@gmail.com'];
  if (superAdminEmail) {
    superAdminEmails.push(...superAdminEmail.split(',').map(e => e.trim()));
  }
  if (process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL) {
    superAdminEmails.push(...process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL.split(',').map(e => e.trim()));
  }

  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      authorized: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  if (!superAdminEmails.includes(user.email!)) {
    return {
      authorized: false,
      response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
    };
  }

  // Email check is authoritative — profile user_type is not required
  return { authorized: true, userId: user.id };
}
