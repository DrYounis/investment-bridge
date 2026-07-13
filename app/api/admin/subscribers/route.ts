import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isSuperAdminEmail } from '@/lib/auth/adminEmails';
import { createServiceClient } from '@/lib/supabase/service';

export async function GET() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const isAuthorized = isSuperAdminEmail(session?.user?.email);
  if (!isAuthorized) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }

  const svc = createServiceClient();
  const { data, error } = await svc
    .from('meeting_subscribers')
    .select('email, source, subscribed_at')
    .order('subscribed_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ subscribers: data || [] });
}
