import { NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { isSuperAdminEmail } from '@/lib/auth/adminEmails';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Verify session
    const supabaseServer = await createServerClient();
    const { data: { user }, error: userError } = await supabaseServer.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Verify super admin email
    const envEmails = (process.env.SUPER_ADMIN_EMAIL || '').split(',').map(e => e.trim()).filter(Boolean);
    if (!isSuperAdminEmail(user.email, envEmails)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 3. Fetch all profiles via service role
    const supabaseAdmin = createServiceClient();
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, email, user_type, created_at')
      .order('created_at', { ascending: false });

    if (profilesError) {
      return NextResponse.json(
        { users: [], errors: [profilesError.message] },
        { status: 500 }
      );
    }

    // 4. Fetch investor approval statuses (best-effort)
    const investorStatuses: Record<string, string> = {};
    try {
      const { data: investors } = await supabaseAdmin
        .from('investor_profiles')
        .select('user_id, approval_status');
      if (investors) {
        for (const inv of investors) {
          investorStatuses[inv.user_id] = inv.approval_status;
        }
      }
    } catch {
      // investor_profiles table may not exist — degrade gracefully
    }

    // 5. Map
    const users = (profiles || []).map((p) => ({
      id: p.id,
      full_name: p.full_name || '',
      email: p.email || '',
      user_type: p.user_type || 'entrepreneur',
      created_at: p.created_at || '',
      approval_status:
        p.user_type === 'investor' ? investorStatuses[p.id] || null : null,
    }));

    return NextResponse.json({ users, errors: [] });
  } catch (err) {
    return NextResponse.json(
      { users: [], errors: [err instanceof Error ? err.message : String(err)] },
      { status: 500 }
    );
  }
}
