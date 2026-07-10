import { createClient } from '@/lib/supabase/server';

const SUPER_ADMIN_EMAILS = [
  process.env.SUPER_ADMIN_EMAIL || 'mohamedy2003@gmail.com',
  'op.younis@gmail.com',
].filter(Boolean);

/**
 * Server-side admin role check.
 * Returns the user if authorized, or throws an appropriate response.
 * Use in server components and API routes.
 */
export async function requireAdmin(
  mode: 'page' | 'api' = 'api'
): Promise<{ id: string; email: string }> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    if (mode === 'page') {
      throw new Response(null, {
        status: 302,
        headers: { Location: '/login' },
      });
    }
    throw new Response(JSON.stringify({ error: 'غير مصرح' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const isAdmin = SUPER_ADMIN_EMAILS.includes(user.email || '');
  if (!isAdmin) {
    if (mode === 'page') {
      throw new Response(null, {
        status: 302,
        headers: { Location: '/dashboard' },
      });
    }
    throw new Response(JSON.stringify({ error: 'غير مصرح — صلاحيات إدارية مطلوبة' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return { id: user.id, email: user.email! };
}
