import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { requireSuperAdmin } from '@/lib/auth/requireSuperAdmin';

export const dynamic = 'force-dynamic';

const FILENAME_RE = /^[A-Za-z0-9_\-]+\.pdf$/;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const auth = await requireSuperAdmin();
  if (!auth.authorized) return auth.response;

  const { name } = await params;

  // Path traversal guard
  if (!FILENAME_RE.test(name)) {
    return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
  }

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .storage
      .from('instructor-guides')
      .createSignedUrl(name, 60);

    if (error || !data?.signedUrl) {
      console.error('INSTRUCTOR_SIGNED_URL_FAIL', error?.message);
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    return NextResponse.json({ url: data.signedUrl });
  } catch (err) {
    console.error('INSTRUCTOR_SIGNED_URL_FAIL', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
