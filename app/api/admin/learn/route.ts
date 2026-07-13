import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { createClient } from '@/lib/supabase/server';
import { getAllArticles, upsertArticle, deleteArticle } from '@/lib/learn/articles';

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
  const articles = await getAllArticles(svc);
  return NextResponse.json({ articles });
}

export async function PATCH(request: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id, updates } = await request.json();
  if (!id || !updates) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  const svc = createServiceClient();
  const ok = await upsertArticle(svc, { id, ...updates, updated_at: new Date().toISOString() } as Record<string, unknown>);
  if (!ok) return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const svc = createServiceClient();
  const ok = await deleteArticle(svc, id);
  if (!ok) return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  return NextResponse.json({ success: true });
}
