import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';

export async function GET() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('meeting_subscribers')
    .select('email')
    .order('subscribed_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ subscribers: data?.map(s => s.email) || [] });
}
