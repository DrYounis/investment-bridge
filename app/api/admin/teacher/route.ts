import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { createClient } from '@/lib/supabase/server';
import { isSuperAdminEmail } from '@/lib/auth/adminEmails';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isSuperAdminEmail(user.email)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const svc = createServiceClient();

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  // Return enrollments
  if (type === 'enrollments') {
    const { data, error } = await svc
      .from('teacher_enrollments')
      .select('id, user_id, full_name, email, phone, status, created_at')
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ enrollments: data });
  }

  // Return lessons
  const { data, error } = await svc
    .from('teacher_lessons')
    .select('*')
    .order('day', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ lessons: data });
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (user.email !== '10.younis@gmail.com') return NextResponse.json({ error: 'Only the course teacher can edit' }, { status: 403 });

  let body: { day?: number; title?: string; icon?: string; content?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const { day, title, icon, content } = body;
  if (!day || day < 1 || day > 10) return NextResponse.json({ error: 'day 1-10 required' }, { status: 400 });
  if (!title?.trim()) return NextResponse.json({ error: 'Title required' }, { status: 400 });

  try {
    const svc = createServiceClient();
    const now = new Date().toISOString();
    const { error } = await svc
      .from('teacher_lessons')
      .upsert({
        day,
        title: title.trim(),
        icon: icon || '📝',
        content: content || '',
        updated_at: now,
      }, { onConflict: 'day' });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[teacher-admin]', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
