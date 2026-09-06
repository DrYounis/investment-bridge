import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { createClient } from '@/lib/supabase/server';
import { isSuperAdminEmail } from '@/lib/auth/adminEmails';
import { TOTAL_MEETINGS } from '@/app/components/marfa/scheduleData';

export const dynamic = 'force-dynamic';

function validateMeeting(meeting: unknown): meeting is number {
  return typeof meeting === 'number' && Number.isInteger(meeting) && meeting >= 1 && meeting <= TOTAL_MEETINGS;
}

function validateStudentNumber(n: unknown): n is number {
  return typeof n === 'number' && Number.isInteger(n) && n >= 1;
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isSuperAdminEmail(user.email)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const meetingStr = searchParams.get('meeting');
  const meeting = parseInt(meetingStr || '', 10);
  if (!validateMeeting(meeting)) {
    return NextResponse.json({ error: `Meeting must be 1–${TOTAL_MEETINGS}` }, { status: 400 });
  }

  try {
    const svc = createServiceClient();

    const { data, error } = await svc
      .from('majlis_attendance')
      .select('id, meeting_number, profile_id, attended_at, recorded_by, profiles!profile_id(full_name, student_number)')
      .eq('meeting_number', meeting)
      .order('attended_at', { ascending: true });

    if (error) {
      console.error('[attendance] fetch error', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ attendees: data });
  } catch (err) {
    console.error('[attendance] GET', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isSuperAdminEmail(user.email)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  let body: { meeting_number?: unknown; student_number?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { meeting_number, student_number } = body;
  if (!validateMeeting(meeting_number)) {
    return NextResponse.json({ error: `meeting_number must be an integer 1–${TOTAL_MEETINGS}` }, { status: 400 });
  }
  if (!validateStudentNumber(student_number)) {
    return NextResponse.json({ error: 'student_number must be a positive integer' }, { status: 400 });
  }

  try {
    const svc = createServiceClient();

    const { data: profile, error: pErr } = await svc
      .from('profiles')
      .select('id, full_name, student_number')
      .eq('student_number', student_number)
      .maybeSingle();

    if (pErr) {
      console.error('[attendance] profile lookup error', pErr);
      return NextResponse.json({ error: pErr.message }, { status: 500 });
    }
    if (!profile) {
      return NextResponse.json({ error: 'لا يوجد طالب بهذا الرقم' }, { status: 404 });
    }

    const { error: insErr } = await svc
      .from('majlis_attendance')
      .upsert({ meeting_number, profile_id: profile.id, recorded_by: user.id }, { onConflict: 'meeting_number,profile_id' });

    if (insErr) {
      console.error('[attendance] upsert error', insErr);
      return NextResponse.json({ error: insErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, full_name: profile.full_name, student_number: profile.student_number });
  } catch (err) {
    console.error('[attendance] POST', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isSuperAdminEmail(user.email)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  let body: { meeting_number?: unknown; student_number?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { meeting_number, student_number } = body;
  if (!validateMeeting(meeting_number)) {
    return NextResponse.json({ error: `meeting_number must be an integer 1–${TOTAL_MEETINGS}` }, { status: 400 });
  }
  if (!validateStudentNumber(student_number)) {
    return NextResponse.json({ error: 'student_number must be a positive integer' }, { status: 400 });
  }

  try {
    const svc = createServiceClient();

    const { data: profile, error: pErr } = await svc
      .from('profiles')
      .select('id')
      .eq('student_number', student_number)
      .maybeSingle();

    if (pErr) {
      console.error('[attendance] profile lookup error', pErr);
      return NextResponse.json({ error: pErr.message }, { status: 500 });
    }
    if (!profile) {
      return NextResponse.json({ error: 'لا يوجد طالب بهذا الرقم' }, { status: 404 });
    }

    const { error: delErr } = await svc
      .from('majlis_attendance')
      .delete()
      .eq('meeting_number', meeting_number)
      .eq('profile_id', profile.id);

    if (delErr) {
      console.error('[attendance] delete error', delErr);
      return NextResponse.json({ error: delErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[attendance] DELETE', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal error' }, { status: 500 });
  }
}
