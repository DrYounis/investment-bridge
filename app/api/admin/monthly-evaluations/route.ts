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

  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');

  try {
    const svc = createServiceClient();

    if (month) {
      const { data, error } = await svc
        .from('monthly_evaluations')
        .select('*, profiles!inner(full_name, email)')
        .eq('month', month)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('[monthly-evaluations] fetch error', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ evaluations: data });
    }

    // No month param: return all users with their evaluations for context
    const { data: profiles, error: pErr } = await svc
      .from('profiles')
      .select('id, full_name, email')
      .order('created_at', { ascending: true });

    if (pErr) {
      console.error('[monthly-evaluations] profiles error', pErr);
      return NextResponse.json({ error: pErr.message }, { status: 500 });
    }

    return NextResponse.json({ profiles });
  } catch (err) {
    console.error('[monthly-evaluations] GET', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isSuperAdminEmail(user.email)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  let body: { user_id?: string; month?: string; grade?: string; notes?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { user_id, month, grade, notes } = body;
  if (!user_id || !month || !grade) {
    return NextResponse.json({ error: 'user_id, month, and grade are required' }, { status: 400 });
  }

  const validGrades = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'];
  if (!validGrades.includes(grade)) {
    return NextResponse.json({ error: `Grade must be one of: ${validGrades.join(', ')}` }, { status: 400 });
  }

  try {
    const svc = createServiceClient();
    const now = new Date().toISOString();

    const { error } = await svc
      .from('monthly_evaluations')
      .upsert({
        user_id,
        month,
        grade,
        notes: notes?.trim() || null,
        graded_by: user.id,
        updated_at: now,
      }, { onConflict: 'user_id,month' });

    if (error) {
      console.error('[monthly-evaluations] upsert error', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[monthly-evaluations] PUT', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal error' }, { status: 500 });
  }
}
