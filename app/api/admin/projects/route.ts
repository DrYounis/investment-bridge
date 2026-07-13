import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { createClient } from '@/lib/supabase/server';
import { isSuperAdminEmail } from '@/lib/auth/adminEmails';


const ALLOWED_FIELDS = ['name_ar','name_en','is_active','is_featured','display_order','sector_ar','stage_ar','teaser_ar'];

async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const envEmails = (process.env.SUPER_ADMIN_EMAIL || '').split(',').map(e => e.trim()).filter(Boolean);
  return isSuperAdminEmail(user?.email, envEmails);
}

export async function GET() {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const svc = createServiceClient();
  const { data, error } = await svc
    .from('marfa_portfolio')
    .select('id, slug, name_ar, name_en, icon, sector_ar, stage_ar, teaser_ar, is_featured, is_active, display_order, is_platform_originated')
    .order('display_order');

  if (error) return NextResponse.json({ projects: [], errors: [error.message] }, { status: 500 });
  return NextResponse.json({ projects: data || [], errors: [] });
}

export async function PATCH(request: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id, updates } = await request.json();
  if (!id || !updates) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

  const filtered: Record<string, unknown> = {};
  for (const key of Object.keys(updates)) {
    if (ALLOWED_FIELDS.includes(key)) filtered[key] = updates[key];
  }
  if (Object.keys(filtered).length === 0) return NextResponse.json({ error: 'No valid fields' }, { status: 400 });

  const svc = createServiceClient();
  const { data, error } = await svc.from('marfa_portfolio').update(filtered).eq('id', id).select('id').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
