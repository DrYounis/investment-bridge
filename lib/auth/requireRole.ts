import 'server-only';
import { createClient } from '@/lib/supabase/server';

/**
 * Server-side role gate for page components.
 * Checks auth + optional user_type match.
 *
 * Usage in a server component:
 *   const user = await requireRole(['entrepreneur']);
 *   // If we reach here, user is authenticated AND has user_type 'entrepreneur'
 *
 * @param allowedTypes  If provided, user must have one of these in profiles.user_type
 * @returns             { id, email } — the authenticated user
 * @throws              Response (302 redirect) on auth failure or role mismatch
 */
export async function requireRole(
  allowedTypes?: string[]
): Promise<{ id: string; email: string }> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Response(null, {
      status: 302,
      headers: { Location: '/login' },
    });
  }

  if (allowedTypes && allowedTypes.length > 0) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', user.id)
      .single();

    const userType = profile?.user_type;
    if (!userType || !allowedTypes.includes(userType)) {
      throw new Response(null, {
        status: 302,
        headers: { Location: '/dashboard' },
      });
    }
  }

  return { id: user.id, email: user.email! };
}
