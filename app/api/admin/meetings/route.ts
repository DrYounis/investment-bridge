import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { createClient } from '@/lib/supabase/server';
import { isSuperAdminEmail } from '@/lib/auth/adminEmails';


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
    .from('meeting_requests')
    .select('id, name, email, company, preferred_time, message, status, created_at')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ requests: [], errors: [error.message] }, { status: 500 });

  return NextResponse.json({ requests: data || [], errors: [] });
}

export async function PATCH(request: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id, status } = await request.json();
  if (!id || !['pending', 'contacted', 'closed'].includes(status)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const svc = createServiceClient();
  const { data, error } = await svc
    .from('meeting_requests')
    .update({ status })
    .eq('id', id)
    .select('id, status')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
