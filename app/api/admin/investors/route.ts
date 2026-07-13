import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { createClient } from '@/lib/supabase/server';

const SUPER_ADMIN_EMAILS = ['op.younis@gmail.com', 'mohamedy2003@gmail.com', '10.younis@gmail.com'];
if (process.env.SUPER_ADMIN_EMAIL) SUPER_ADMIN_EMAILS.push(...process.env.SUPER_ADMIN_EMAIL.split(',').map(e => e.trim()));

async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.email && SUPER_ADMIN_EMAILS.includes(user.email);
}

export async function GET() {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const svc = createServiceClient();
  const { data, error } = await svc
    .from('investor_profiles')
    .select('profile_id, approval_status, company, phone, created_at, profiles:profile_id(full_name, email)')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ investors: [], errors: [error.message] }, { status: 500 });

  const investors = (data || []).map((r: Record<string, unknown>) => {
    const profile = (r.profiles as { full_name?: string; email?: string }) || {};
    return {
      profile_id: r.profile_id,
      full_name: profile.full_name || '',
      email: profile.email || '',
      approval_status: r.approval_status || 'pending',
      company: r.company || '',
      phone: r.phone || '',
      created_at: r.created_at || '',
    };
  });

  return NextResponse.json({ investors, errors: [] });
}

export async function PATCH(request: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { profile_id, approval_status } = await request.json();
  if (!profile_id || !['approved', 'rejected', 'pending'].includes(approval_status)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const svc = createServiceClient();
  const { data, error } = await svc
    .from('investor_profiles')
    .update({ approval_status })
    .eq('profile_id', profile_id)
    .select('profile_id, approval_status')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
