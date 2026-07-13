import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { requireSuperAdmin } from '@/lib/auth/requireSuperAdmin';

export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await requireSuperAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .storage
      .from('instructor-guides')
      .list();

    if (error) {
      console.error('INSTRUCTOR_LIST_FAIL', error.message);
      return NextResponse.json({ error: 'Storage error' }, { status: 500 });
    }

    const files = (data || []).map((f) => ({
      name: f.name,
      size: f.metadata?.size ?? 0,
      updated_at: f.updated_at,
    }));

    return NextResponse.json({ files });
  } catch (err) {
    console.error('INSTRUCTOR_LIST_FAIL', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
