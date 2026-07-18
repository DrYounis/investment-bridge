import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createServiceClient } from '@/lib/supabase/service';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'الرجاء تسجيل الدخول أولاً' }, { status: 401 });

  let body: { program?: string; full_name?: string; email?: string; phone?: string; notes?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'بيانات غير صالحة' }, { status: 400 });
  }

  const { program, full_name, email, phone, notes } = body;
  if (!program || !full_name) {
    return NextResponse.json({ error: 'البرنامج والاسم مطلوبان' }, { status: 400 });
  }

  const validPrograms = [
    'vibe-coding',
    'medical-insurance',
    'rcm-advanced',
    'entrepreneurship',
    'ai-professionals',
  ];
  if (!validPrograms.includes(program)) {
    return NextResponse.json({ error: 'برنامج غير صالح' }, { status: 400 });
  }

  try {
    const svc = createServiceClient();

    const { data, error } = await svc
      .from('academy_enrollments')
      .insert({
        program,
        user_id: user.id,
        full_name,
        email: email || user.email,
        phone: phone || null,
        notes: notes || null,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('[academy-enroll] insert error', error);
      return NextResponse.json({ error: 'تعذر التسجيل — حاول مرة أخرى' }, { status: 500 });
    }

    // Notify admin
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const programNames: Record<string, string> = {
        'vibe-coding': 'Vibe Coding',
        'medical-insurance': 'أساسيات التأمين الطبي',
        'rcm-advanced': 'RCM المتقدمة',
        'entrepreneurship': 'أساسيات ريادة الأعمال',
        'ai-professionals': 'الذكاء الاصطناعي للمهنيين',
      };

      await resend.emails.send({
        from: 'Marfa Academy <noreply@marfa.sa>',
        to: 'ceo@marfa.sa',
        subject: `📝 تسجيل جديد في الأكاديمية — ${programNames[program]} | ${full_name}`,
        html: `<div dir="rtl" style="font-family:sans-serif;padding:20px">
          <h2>تسجيل جديد في أكاديمية مرفأ</h2>
          <p><strong>البرنامج:</strong> ${programNames[program]}</p>
          <p><strong>الاسم:</strong> ${full_name}</p>
          <p><strong>البريد:</strong> ${email || user.email}</p>
          <p><strong>الجوال:</strong> ${phone || '—'}</p>
          <p><strong>ملاحظات:</strong> ${notes || '—'}</p>
          <hr>
          <p style="color:#888">الحالة: بانتظار التأكيد والدفع</p>
        </div>`,
      });
    } catch (err) {
      console.error('[academy-enroll] admin notify failed', err);
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (err) {
    console.error('[academy-enroll]', err);
    return NextResponse.json({ error: 'حدث خطأ — حاول مرة أخرى' }, { status: 500 });
  }
}
