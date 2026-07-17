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
  const meetingStr = searchParams.get('meeting');
  const meeting = parseInt(meetingStr || '', 10);
  if (isNaN(meeting) || meeting < 1 || meeting > 14) {
    return NextResponse.json({ error: 'Meeting must be 1–14' }, { status: 400 });
  }

  try {
    const svc = createServiceClient();

    const { data: question, error: qErr } = await svc
      .from('majlis_quiz_questions')
      .select('*')
      .eq('meeting_number', meeting)
      .maybeSingle();

    if (qErr) {
      console.error('[majlis-quiz] question fetch error', qErr);
      return NextResponse.json({ error: qErr.message }, { status: 500 });
    }

    const { data: answers, error: aErr } = await svc
      .from('majlis_quiz_answers')
      .select('*')
      .eq('meeting_number', meeting)
      .order('created_at', { ascending: true });

    if (aErr) {
      console.error('[majlis-quiz] answers fetch error', aErr);
      return NextResponse.json({ error: aErr.message }, { status: 500 });
    }

    return NextResponse.json({ question, answers });
  } catch (err) {
    console.error('[majlis-quiz] GET', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isSuperAdminEmail(user.email)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  let body: { meeting_number?: unknown; question?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { meeting_number, question } = body;
  if (typeof meeting_number !== 'number' || meeting_number < 1 || meeting_number > 14) {
    return NextResponse.json({ error: 'meeting_number must be a number 1–14' }, { status: 400 });
  }
  if (typeof question !== 'string' || question.trim().length === 0) {
    return NextResponse.json({ error: 'Question is required' }, { status: 400 });
  }
  if (question.length > 1000) {
    return NextResponse.json({ error: 'Question must be ≤ 1000 characters' }, { status: 400 });
  }

  try {
    const svc = createServiceClient();
    const now = new Date().toISOString();
    const { error } = await svc
      .from('majlis_quiz_questions')
      .upsert({ meeting_number, question: question.trim(), updated_at: now }, { onConflict: 'meeting_number' });

    if (error) {
      console.error('[majlis-quiz] upsert error', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[majlis-quiz] PUT', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isSuperAdminEmail(user.email)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  let body: { answer_id?: unknown; score?: unknown; feedback?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { answer_id, score, feedback } = body;

  if (typeof answer_id !== 'string' || !answer_id) {
    return NextResponse.json({ error: 'answer_id is required' }, { status: 400 });
  }
  if (typeof score !== 'number' || !Number.isInteger(score) || score < 1 || score > 5) {
    return NextResponse.json({ error: 'Score must be an integer 1–5' }, { status: 400 });
  }
  if (feedback !== undefined && feedback !== null) {
    if (typeof feedback !== 'string') {
      return NextResponse.json({ error: 'Feedback must be a string' }, { status: 400 });
    }
    if (feedback.length > 2000) {
      return NextResponse.json({ error: 'Feedback must be ≤ 2000 characters' }, { status: 400 });
    }
  }

  try {
    const svc = createServiceClient();
    const now = new Date().toISOString();
    const update: Record<string, unknown> = {
      score,
      graded_at: now,
      updated_at: now,
    };
    if (feedback !== undefined && feedback !== null) {
      update.feedback = feedback.trim();
    }

    const { error } = await svc
      .from('majlis_quiz_answers')
      .update(update)
      .eq('id', answer_id);

    if (error) {
      console.error('[majlis-quiz] patch error', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[majlis-quiz] PATCH', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal error' }, { status: 500 });
  }
}
