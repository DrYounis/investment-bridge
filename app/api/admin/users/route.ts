import { NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { isSuperAdminEmail } from '@/lib/auth/adminEmails';
import { createHash } from 'node:crypto';

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
      .select('id, full_name, email, user_type, created_at, phone')
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

    // 5. Auth sign-in data (best-effort)
    const authSignIns: Record<string, string | null> = {};
    try {
      const { data: authData } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
      if (authData?.users) {
        for (const u of authData.users) {
          authSignIns[u.id] = u.last_sign_in_at || null;
        }
      }
    } catch (e) {
      console.error('ADMIN_USERS_AUTH', e instanceof Error ? e.message : String(e));
    }

    // 6. Activity from page_views (best-effort)
    const pageActivity: Record<string, { lastVisit: string; visitDays: number }> = {};
    try {
      const ninetyDaysAgo = new Date(Date.now() - 90 * 86400000).toISOString();
      const { data: pvRows } = await supabaseAdmin
        .from('page_views')
        .select('user_hash, created_at')
        .not('user_hash', 'is', null)
        .gte('created_at', ninetyDaysAgo);

      if (pvRows) {
        // Aggregate per user_hash
        const agg = new Map<string, { maxDate: string; dates: Set<string> }>();
        for (const row of pvRows) {
          const existing = agg.get(row.user_hash);
          const d = row.created_at.split('T')[0];
          if (existing) {
            if (row.created_at > existing.maxDate) existing.maxDate = row.created_at;
            existing.dates.add(d);
          } else {
            agg.set(row.user_hash, { maxDate: row.created_at, dates: new Set([d]) });
          }
        }

        // Map profile id → SHA256 hash
        for (const p of profiles || []) {
          const hash = createHash('sha256').update(p.id).digest('hex');
          const activity = agg.get(hash);
          if (activity) {
            pageActivity[p.id] = {
              lastVisit: activity.maxDate,
              visitDays: activity.dates.size,
            };
          }
        }
      }
    } catch (e) {
      console.error('ADMIN_USERS_ACTIVITY', e instanceof Error ? e.message : String(e));
    }

    // 7. Map
    const users = (profiles || []).map((p) => {
      const activity = pageActivity[p.id];
      const lastSignIn = authSignIns[p.id] || null;
      const lastVisit = activity?.lastVisit || lastSignIn || null;
      const visitCount = activity?.visitDays || 0;

      return {
        id: p.id,
        full_name: p.full_name || '',
        email: p.email || '',
        user_type: p.user_type || 'entrepreneur',
        created_at: p.created_at || '',
        phone: p.phone || null,
        approval_status:
          p.user_type === 'investor' ? investorStatuses[p.id] || null : null,
        last_sign_in_at: lastSignIn,
        last_visit: lastVisit,
        visit_count: visitCount,
      };
    });

    return NextResponse.json({ users, errors: [] });
  } catch (err) {
    return NextResponse.json(
      { users: [], errors: [err instanceof Error ? err.message : String(err)] },
      { status: 500 }
    );
  }
}
