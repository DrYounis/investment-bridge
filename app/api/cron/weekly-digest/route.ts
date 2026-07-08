import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createServiceClient } from '@/lib/supabase/service'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

function buildDigestHTML(email: string, name: string, data: {
  views: number
  downloads: number
  interests: number
  totalScore: number
  grade: string
}) {
  const hasSignals = data.views > 0 || data.downloads > 0 || data.interests > 0

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="UTF-8"></head>
<body style="font-family:'Tajawal','Cairo',sans-serif;direction:rtl;background:#faf8f2;padding:30px;margin:0">
<div style="max-width:600px;margin:auto;background:#fff;border:1px solid #c9a84c33;border-radius:24px;overflow:hidden;box-shadow:0 8px 30px rgba(10,15,30,0.06)">
  <div style="background:linear-gradient(135deg,#0a0f1e,#0d1628);padding:32px 24px;text-align:center">
    <h1 style="color:#c9a84c;font-size:24px;margin:0 0 8px 0">⚓ مرفأ — ملخصك الأسبوعي</h1>
    <p style="color:#a0aec0;font-size:13px;margin:0">${name}، هذه خلاصة نشاطك هذا الأسبوع</p>
  </div>
  <div style="padding:32px 24px">
    ${hasSignals ? `
    <div style="border-radius:16px;padding:24px;background:#fdf9ef;margin-bottom:20px">
      ${data.views > 0 ? `<p style="color:#0a0f1e;font-size:15px;margin:0 0 12px">👀 ${data.views} مشاهدة لملفك هذا الأسبوع</p>` : ''}
      ${data.downloads > 0 ? `<p style="color:#0a0f1e;font-size:15px;margin:0 0 12px">📥 ${data.downloads} تحميل لعرضك</p>` : ''}
      ${data.interests > 0 ? `<p style="color:#0a0f1e;font-size:15px;margin:0">⭐ ${data.interests} مستثمر أبدى اهتماماً</p>` : ''}
    </div>` : `
    <div style="border-radius:16px;padding:24px;background:#fdf9ef;margin-bottom:20px;text-align:center">
      <p style="color:#4a5b78;font-size:14px;margin:0">أكمل ملفك الشخصي وارفع عرضك التقديمي لتظهر إحصائياتك هنا</p>
    </div>`}

    <div style="border:2px solid #c9a84c;border-radius:16px;padding:24px;background:#fdf9ef;margin-bottom:20px;text-align:center">
      <p style="color:#0a0f1e;font-size:15px;font-weight:bold;margin:0 0 8px">📊 مؤشر الجاهزية الاستثمارية</p>
      <p style="color:#c9a84c;font-size:32px;font-weight:900;margin:0">${data.totalScore}% — ${data.grade}</p>
    </div>

    <div style="text-align:center">
      <a href="https://www.marfa.sa/dashboard/hub" style="display:inline-block;background:#c9a84c;color:#0a0f1e;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:bold;font-size:15px">افتح لوحة التحكم</a>
    </div>

    <div style="margin-top:32px;padding-top:20px;border-top:1px solid #c9a84c44;text-align:center">
      <p style="color:#8a94a8;font-size:11px;margin:0">لإيقاف الملخص الأسبوعي، عدّل تفضيلاتك من صفحة ملفك الشخصي</p>
      <p style="color:#8a94a8;font-size:11px;margin:4px 0 0">www.marfa.sa | منصة مرفأ الاستثمارية | حائل 🇸🇦</p>
    </div>
  </div>
</div>
</body></html>`
}

export async function GET() {
  try {
    const supabase = createServiceClient()
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString()

    // Get all profiles with weekly digest enabled
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .eq('weekly_digest_enabled', true)

    if (!profiles || profiles.length === 0) {
      return NextResponse.json({ message: 'No subscribers with digest enabled' })
    }

    const resend = getResend()
    const results: { email: string; status: string }[] = []

    for (const profile of profiles) {
      try {
        // Get signal counts for last 7 days
        const [viewRes, dlRes, intRes] = await Promise.all([
          supabase.from('investor_signals').select('*', { count: 'exact', head: true }).eq('entrepreneur_id', profile.id).eq('signal_type', 'profile_view').gte('created_at', weekAgo),
          supabase.from('investor_signals').select('*', { count: 'exact', head: true }).eq('entrepreneur_id', profile.id).eq('signal_type', 'deck_download').gte('created_at', weekAgo),
          supabase.from('investor_signals').select('*', { count: 'exact', head: true }).eq('entrepreneur_id', profile.id).eq('signal_type', 'interest').gte('created_at', weekAgo),
        ])

        const views = viewRes.count || 0
        const downloads = dlRes.count || 0
        const interests = intRes.count || 0

        // Get readiness score
        const { data: readiness } = await supabase
          .from('readiness_scores')
          .select('total_score, grade')
          .eq('user_id', profile.id)
          .maybeSingle()

        const totalScore = readiness?.total_score || 0
        const grade = readiness?.grade || 'D'

        // Skip users with zero signals
        if (views === 0 && downloads === 0 && interests === 0) {
          results.push({ email: profile.email || '', status: 'تم التخطي (لا توجد إشارات)' })
          continue
        }

        const name = profile.full_name || profile.email?.split('@')[0] || 'مستخدم'

        const { error } = await resend.emails.send({
          from: 'Marfa <noreply@marfa.sa>',
          to: profile.email || '',
          subject: 'ملخصك الأسبوعي من مرفأ 🚀',
          html: buildDigestHTML(profile.email || '', name, { views, downloads, interests, totalScore, grade }),
        })

        results.push({ email: profile.email || '', status: error ? `فشل: ${error.message}` : 'تم الإرسال' })
      } catch (err: unknown) {
        results.push({ email: profile.email || '', status: `فشل: ${err instanceof Error ? err.message : String(err)}` })
      }

      // Rate limit: 600ms between sends
      await new Promise((r) => setTimeout(r, 600))
    }

    const sent = results.filter((r) => r.status === 'تم الإرسال').length
    const attempted = results.filter((r) => !r.status.startsWith('تم التخطي')).length

    // Notify super admin
    await resend.emails.send({
      from: 'Marfa <noreply@marfa.sa>',
      to: 'op.younis@gmail.com',
      subject: `📋 الملخص الأسبوعي — تم إرسال ${sent}/${attempted} ملخص`,
      html: `<div style="font-family:sans-serif;padding:20px"><h2>تقرير الملخص الأسبوعي</h2><pre>${JSON.stringify(results, null, 2)}</pre></div>`,
    }).catch(() => {})

    return NextResponse.json({ success: true, sent, total: attempted, results })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 })
  }
}
