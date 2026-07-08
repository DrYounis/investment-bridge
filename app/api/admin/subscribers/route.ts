import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

const SUPER_ADMIN_EMAILS = [
  'op.younis@gmail.com',
  'mohamedy2003@gmail.com',
];

export async function GET() {
  // Auth check — must be super admin
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  const isAuthorized = session?.user?.email && SUPER_ADMIN_EMAILS.includes(session.user.email);
  if (!isAuthorized) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }

  const svc = createServiceClient();
  const { data, error } = await svc
    .from('meeting_subscribers')
    .select('email')
    .order('subscribed_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ subscribers: data?.map(s => s.email) || [] });
}
