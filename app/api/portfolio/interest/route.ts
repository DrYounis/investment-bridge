import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createServiceClient } from '@/lib/supabase/service';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/requireAdmin';

const SUPER_ADMIN_EMAILS = [
  'op.younis@gmail.com',
  'mohamedy2003@gmail.com',
].filter(Boolean);

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const body = await request.json();
    const { portfolio_id, message } = body;

    if (!portfolio_id) {
      return NextResponse.json({ error: 'معرّف المشروع مطلوب' }, { status: 400 });
    }

    const svc = createServiceClient();

    // Validate project exists and is active
    const { data: project } = await svc
      .from('marfa_portfolio')
      .select('id, name_ar, is_active')
      .eq('id', portfolio_id)
      .single();

    if (!project || !project.is_active) {
      return NextResponse.json({ error: 'المشروع غير متاح' }, { status: 404 });
    }

    // Duplicate check
    const { data: existing } = await svc
      .from('portfolio_interest_requests')
      .select('id')
      .eq('investor_id', user.id)
      .eq('portfolio_id', portfolio_id)
      .eq('status', 'new')
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ duplicate: true, id: existing.id });
    }

    // Sanitize message
    const safeMessage = typeof message === 'string' ? message.trim().slice(0, 500) : undefined;

    // Insert
    const { data: inserted, error: insertError } = await svc
      .from('portfolio_interest_requests')
      .insert({
        portfolio_id,
        investor_id: user.id,
        investor_email: user.email || '',
        message: safeMessage || null,
        status: 'new',
      })
      .select('id')
      .single();

    if (insertError) {
      return NextResponse.json({ error: 'فشل حفظ الطلب' }, { status: 500 });
    }

    // Send Resend email — fire and forget
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'Marfa <noreply@marfa.sa>',
        to: SUPER_ADMIN_EMAILS[0],
        subject: `طلب اهتمام جديد — ${project.name_ar}`,
        html: `<div dir="rtl" style="font-family:Tajawal,sans-serif">
          <h2 style="color:#c9a84c">طلب اهتمام جديد</h2>
          <p><strong>المشروع:</strong> ${project.name_ar}</p>
          <p><strong>المستثمر:</strong> ${user.email}</p>
          <p><strong>الرسالة:</strong> ${safeMessage || '—'}</p>
          <p><strong>التوقيت:</strong> ${new Date().toLocaleString('ar-SA')}</p>
        </div>`,
      });
    } catch { /* email failure must not fail request */ }

    return NextResponse.json({ success: true, id: inserted?.id });
  } catch {
    return NextResponse.json({ error: 'حدث خطأ غير متوقع' }, { status: 500 });
  }
}
