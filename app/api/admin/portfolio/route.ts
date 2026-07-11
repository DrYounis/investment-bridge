import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

const SUPER_ADMIN_EMAILS = ['op.younis@gmail.com', 'mohamedy2003@gmail.com'];

async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.email && SUPER_ADMIN_EMAILS.includes(user.email);
}

export async function GET(request: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const id = request.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const svc = createServiceClient();
  const { data } = await svc.from('marfa_portfolio').select('access_token').eq('id', id).single();
  if (!data?.access_token) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ url: `https://www.marfa.sa/portfolio/details/${data.access_token}` });
}

export async function POST(request: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const token = [...Array(32)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
  const svc = createServiceClient();
  const { error } = await svc.from('marfa_portfolio').update({ access_token: token }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ url: `https://www.marfa.sa/portfolio/details/${token}` });
}
