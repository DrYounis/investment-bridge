import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { randomBytes } from 'crypto';
import { isSuperAdminEmail } from '@/lib/auth/adminEmails';
const ALLOWED_FIELDS = ['name_ar','name_en','icon','sector_ar','stage_ar','teaser_ar','is_featured','is_active','display_order','live_url','overview_ar','problem_ar','solution_ar','features_ar','status_ar','business_model_ar','why_now_ar'];

async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return isSuperAdminEmail(user?.email);
}

// GET /api/admin/portfolio?id=... — copy secret link
// GET /api/admin/portfolio/list — list all projects (no access_token)
export async function GET(request: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const id = request.nextUrl.searchParams.get('id');
  if (id) {
    const svc = createServiceClient();
    const { data } = await svc.from('marfa_portfolio').select('access_token').eq('id', id).single();
    if (!data?.access_token) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ url: `https://www.marfa.sa/portfolio/details/${data.access_token}` });
  }
  // List all projects
  const svc = createServiceClient();
  const { data, error } = await svc.from('marfa_portfolio').select(ALLOWED_FIELDS.map(f => f).join(',') + ',id,slug').order('display_order');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ projects: data });
}

// POST /api/admin/portfolio — regenerate token
// PATCH /api/admin/portfolio/list — update project fields
export async function POST(request: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const token = randomBytes(16).toString('hex');
  const svc = createServiceClient();
  const { error } = await svc.from('marfa_portfolio').update({ access_token: token }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ url: `https://www.marfa.sa/portfolio/details/${token}` });
}

export async function PATCH(request: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id, updates } = await request.json();
  if (!id || !updates) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  const filtered: Record<string, unknown> = {};
  for (const key of Object.keys(updates)) {
    if (ALLOWED_FIELDS.includes(key)) filtered[key] = updates[key];
  }
  const svc = createServiceClient();
  const { error } = await svc.from('marfa_portfolio').update(filtered).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
