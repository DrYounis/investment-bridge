import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

// One-shot temp token — delete this route after the send.
const TEMP_TOKEN = '3c7702c9-6d05-49ff-98ce-190826de4c9c';

export async function GET(request: NextRequest) {
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${TEMP_TOKEN}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const svc = createServiceClient();
    const { data: profiles, error } = await svc
      .from('profiles')
      .select('student_number, email, full_name')
      .gte('student_number', 2)
      .order('student_number', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const results: { number: number; email: string; ok: boolean; error?: string }[] = [];

    for (const p of profiles || []) {
      if (!p.email) continue;
      const name = p.full_name || 'مشارك';
      try {
        const { error: sendErr } = await resend.emails.send({
          from: 'Marfa <noreply@marfa.sa>',
          to: p.email,
          subject: 'رقمك الفريد للحضور — مجلس مرفأ',
          html: `<div dir="rtl" style="font-family: Tahoma, Arial, sans-serif; line-height: 1.8; color: #0a0f1e;">
  <p>مرحباً ${name}،</p>
  <p>يسعدنا إعلامك برقمك الفريد الخاص بالحضور في مجلس مرفأ:</p>
  <p style="font-size: 32px; font-weight: bold; color: #c9a84c; text-align: center; margin: 16px 0;">${p.student_number}</p>
  <p>احتفظ به، وستستخدمه عند تسجيل حضورك في كل لقاء.</p>
  <p>مع أطيب التحيات،<br>مجلس مرفأ — marfa.sa</p>
</div>`,
        });
        results.push({ number: p.student_number, email: p.email, ok: !sendErr, error: sendErr?.message });
      } catch (e) {
        results.push({ number: p.student_number, email: p.email, ok: false, error: e instanceof Error ? e.message : String(e) });
      }
    }

    const sent = results.filter((r) => r.ok).length;
    return NextResponse.json({ sent, total: results.length, results });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal error' }, { status: 500 });
  }
}
