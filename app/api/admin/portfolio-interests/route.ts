import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { createClient } from '@/lib/supabase/server';
import { isSuperAdminEmail } from '@/lib/auth/adminEmails';

async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return isSuperAdminEmail(user?.email);
}

export async function GET() {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const svc = createServiceClient();
  const { data, error } = await svc
    .from('portfolio_interest_requests')
    .select('id, portfolio_id, investor_email, message, status, created_at, marfa_portfolio!inner(name_ar)')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const interests = (data || []).map((r: Record<string, unknown>) => ({ ...r, project_name: (r as { marfa_portfolio?: { name_ar?: string } }).marfa_portfolio?.name_ar }));
  return NextResponse.json({ interests });
}

export async function PATCH(request: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id, status } = await request.json();
  if (!id || !['new', 'contacted', 'closed'].includes(status)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const svc = createServiceClient();
  const { data, error } = await svc
    .from('portfolio_interest_requests')
    .update({ status })
    .eq('id', id)
    .select('id, status')
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
