import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createServiceClient } from '@/lib/supabase/service';
import { sendBatch } from '@/lib/resend-batch';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function buildReengagementHTML(email: string, segment: string, action: string, lastActive: string): string {
  const subjectLine = segment === 'power_user'
    ? 'نفتقد نشاطك هذا الأسبوع — عد إلى مرفأ'
    : segment === 'learner'
      ? 'لدينا محتوى جديد في مركز المعرفة'
      : 'مرفأ بانتظار عودتك — جرّب أداة مجانية';

  const body = segment === 'power_user'
    ? `<p style="color:#4a5b78;font-size:15px;line-height:1.9;margin:0;">كنت من أنشط أعضاء مرفأ الأسبوع الماضي — لاحظنا غيابك هذا الأسبوع. المجلس الاستشاري ينتظر إجابتك، وأدواتنا الذكية جاهزة لمساعدتك.</p>
       <div style="margin-top:16px;display:flex;flex-direction:column;gap:8px">
         <a href="https://www.marfa.sa/meetings" style="display:block;background:#c9a84c;color:#0a0f1e;padding:12px;border-radius:12px;text-align:center;text-decoration:none;font-weight:bold">🏛️ عد إلى المجلس الاستشاري</a>
         <a href="https://www.marfa.sa/dashboard/hub" style="display:block;background:#faf8f2;color:#0a0f1e;padding:12px;border-radius:12px;text-align:center;text-decoration:none;font-weight:bold;border:1px solid #c9a84c33">📊 لوحة التحكم</a>
       </div>`
    : segment === 'learner'
      ? `<p style="color:#4a5b78;font-size:15px;line-height:1.9;margin:0;">لاحظنا أنك مهتم بمركز المعرفة. لدينا مقالات جديدة في ريادة الأعمال والاستثمار — و٣٠٠ مصطلح تجاري في قاموس مرفأ.</p>
         <div style="margin-top:16px;display:flex;flex-direction:column;gap:8px">
           <a href="https://www.marfa.sa/learn" style="display:block;background:#c9a84c;color:#0a0f1e;padding:12px;border-radius:12px;text-align:center;text-decoration:none;font-weight:bold">📚 تصفح مركز المعرفة</a>
           <a href="https://www.marfa.sa/learn/glossary" style="display:block;background:#faf8f2;color:#0a0f1e;padding:12px;border-radius:12px;text-align:center;text-decoration:none;font-weight:bold;border:1px solid #c9a84c33">📖 قاموس المصطلحات (٣٠٠ مصطلح)</a>
         </div>`
      : `<p style="color:#4a5b78;font-size:15px;line-height:1.9;margin:0;">زرت مرفأ من قبل لكنك لم تكمل رحلتك بعد. جرّب أحد أدواتنا المجانية — مستشار 360° يحلل فكرتك خلال دقائق، أو خطاب المصعد في 20 ثانية.</p>
         <div style="margin-top:16px;display:flex;flex-direction:column;gap:8px">
           <a href="https://www.marfa.sa/advisor" style="display:block;background:#c9a84c;color:#0a0f1e;padding:12px;border-radius:12px;text-align:center;text-decoration:none;font-weight:bold">🧠 جرّب Marfa 360° المستشار</a>
           <a href="https://www.marfa.sa/join" style="display:block;background:#faf8f2;color:#0a0f1e;padding:12px;border-radius:12px;text-align:center;text-decoration:none;font-weight:bold;border:1px solid #c9a84c33">🚀 تعرّف على مرفأ</a>
         </div>`;

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="UTF-8"></head>
<body style="font-family:'Tajawal','Cairo',sans-serif;direction:rtl;background:#faf8f2;padding:30px;margin:0">
<div style="max-width:560px;margin:auto;background:#fff;border:1px solid #c9a84c33;border-radius:24px;overflow:hidden;box-shadow:0 8px 30px rgba(10,15,30,0.06)">

<div style="background:linear-gradient(135deg,#0a0f1e,#0d1628);padding:28px 24px;text-align:center">
  <h1 style="color:#c9a84c;font-size:20px;margin:0 0 4px 0">👋 ${subjectLine}</h1>
  <p style="color:#a0aec0;font-size:12px;margin:0">آخر زيارة: ${lastActive}</p>
</div>

<div style="padding:28px 24px">
  ${body}
  <div style="margin-top:24px;padding-top:16px;border-top:1px solid #c9a84c33;text-align:center">
    <p style="color:#64748b;font-size:10px;margin:0">مرفأ — حيث تَرسو الطموحات | www.marfa.sa</p>
    <p style="color:#8a94a8;font-size:9px;margin:4px 0 0 0">لإلغاء الاشتراك، رد على هذا الإيميل بـ "إلغاء"</p>
  </div>
</div>

</div></body></html>`;
}

function arabicDate(iso: string): string {
  const d = new Date(iso);
  const months = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

function isCronAuthorized(request: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return false;
  return request.headers.get('authorization') === `Bearer ${cronSecret}`;
}

export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Guard: Monday only (after Sunday analysis is fresh)
  if (new Date().getUTCDay() !== 1) {
    return NextResponse.json({ skipped: true, reason: 'Not Monday' });
  }

  try {
    const svc = createServiceClient();

    // Get last week's Monday
    const today = new Date();
    const lastMonday = new Date(today);
    lastMonday.setDate(today.getDate() - ((today.getDay() + 6) % 7) - 7);
    const weekStart = lastMonday.toISOString().split('T')[0];

    // Fetch churned users (high risk) from last week's analysis
    const { data: churned, error: churnErr } = await svc
      .from('user_journey_analysis')
      .select('user_id, email, is_registered, behavior_segment, recommended_action, last_visit')
      .eq('week_start', weekStart)
      .eq('churn_risk', 'high')
      .order('engagement_score', { ascending: true });

    if (churnErr || !churned || churned.length === 0) {
      return NextResponse.json({ message: 'No churned users to re-engage' });
    }

    // Only email registered users (we have their email)
    const toReengage = churned.filter(u => u.is_registered && u.email);

    if (toReengage.length === 0) {
      return NextResponse.json({ message: 'No registered churned users' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Check if they were already re-engaged this month
    const { data: alreadySent } = await svc
      .from('user_journey_analysis')
      .select('user_id')
      .gte('week_start', new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0])
      .not('recommended_action', 'is', null)
      .ilike('recommended_action', '%إعادة تفعيل%');

    const alreadyReengagedIds = new Set((alreadySent || []).map(a => a.user_id));

    let skipped = 0;
    const emails: { from: string; to: string; subject: string; html: string }[] = [];

    for (const user of toReengage) {
      if (alreadyReengagedIds.has(user.user_id)) {
        skipped++;
        continue;
      }

      const lastActive = user.last_visit ? arabicDate(user.last_visit) : 'منذ فترة';
      const segment = user.behavior_segment || 'explorer';
      const action = user.recommended_action || '';

      emails.push({
        from: 'Marfa <noreply@marfa.sa>',
        to: user.email!,
        subject: segment === 'power_user'
          ? 'نفتقد نشاطك هذا الأسبوع — عد إلى مرفأ'
          : 'مرفأ بانتظار عودتك — جرّب أداة مجانية',
        html: buildReengagementHTML(user.email!, segment, action, lastActive),
      });
    }

    const { sent, failed } = await sendBatch(resend, emails);

    return NextResponse.json({
      success: true,
      sent,
      failed,
      skipped,
      totalChurned: churned.length,
      reengageable: toReengage.length,
      weekStart,
    });
  } catch (err: unknown) {
    console.error('[reengagement]', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
