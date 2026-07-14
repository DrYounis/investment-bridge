import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { Resend } from 'resend';

function isCronAuthorized(request: Request): boolean {
  if (request.headers.get('x-vercel-cron')) return true;
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return false;
  const url = new URL(request.url);
  if (url.searchParams.get('token') === cronSecret) return true;
  const authHeader = request.headers.get('authorization');
  if (authHeader === `Bearer ${cronSecret}`) return true;
  return false;
}

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function GET(request: NextRequest) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const errors: string[] = [];

  try {
    const svc = createServiceClient();
    const since = new Date(Date.now() - 7 * 86400000).toISOString();
    const prevSince = new Date(Date.now() - 14 * 86400000).toISOString();
    const prevUntil = since;

    const { data: rows, error: fetchError } = await svc
      .from('page_views')
      .select('path,referrer,country,device,visitor_hash,created_at')
      .gte('created_at', prevSince)
      .order('created_at', { ascending: false });

    if (fetchError) {
      errors.push(fetchError.message);
      return NextResponse.json({ success: false, errors }, { status: 500 });
    }

    const all = rows || [];
    const current = all.filter((r) => r.created_at >= since);
    const previous = all.filter((r) => r.created_at >= prevSince && r.created_at < prevUntil);

    const totalViews = current.length;
    const uniqueVisitors = new Set(current.map((r) => r.visitor_hash)).size;
    const prevTotalViews = previous.length;
    const prevUniqueVisitors = new Set(previous.map((r) => r.visitor_hash)).size;

    const viewChange = prevTotalViews ? ((totalViews - prevTotalViews) / prevTotalViews * 100).toFixed(0) : '—';
    const visitorChange = prevUniqueVisitors ? ((uniqueVisitors - prevUniqueVisitors) / prevUniqueVisitors * 100).toFixed(0) : '—';

    // Top pages
    const pageMap = new Map<string, number>();
    const referrerMap = new Map<string, number>();
    const countryMap = new Map<string, number>();
    for (const r of current) {
      pageMap.set(r.path, (pageMap.get(r.path) || 0) + 1);
      const ref = r.referrer ? new URL(r.referrer).hostname : 'مباشر';
      referrerMap.set(ref, (referrerMap.get(ref) || 0) + 1);
      if (r.country) countryMap.set(r.country, (countryMap.get(r.country) || 0) + 1);
    }

    const top = (m: Map<string, number>, limit = 5) =>
      [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit)
        .map(([k, v]) => `<tr><td style="text-align:right;padding:4px 8px">${k}</td><td style="text-align:start;padding:4px 8px;color:#c9a84c;font-weight:bold">${v}</td></tr>`)
        .join('');

    const html = `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"></head>
<body style="font-family:'Tajawal','Cairo',sans-serif;direction:rtl;background:#faf8f2;padding:30px;margin:0">
<div style="max-width:600px;margin:auto;background:#fff;border:1px solid #c9a84c33;border-radius:24px;overflow:hidden;box-shadow:0 8px 30px rgba(10,15,30,0.06)">
  <div style="background:linear-gradient(135deg,#0a0f1e,#0d1628);padding:32px 24px;text-align:center">
    <h1 style="color:#c9a84c;font-size:24px;margin:0 0 8px 0">⚓ مرفأ — تقرير زيارات الموقع الأسبوعي</h1>
    <p style="color:#a0aec0;font-size:13px;margin:0">${new Date().toLocaleDateString('ar-SA')}</p>
  </div>
  <div style="padding:32px 24px">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px">
      <div style="background:#faf8f2;border-radius:12px;padding:16px;text-align:center">
        <p style="color:#64748b;font-size:12px;margin:0">المشاهدات</p>
        <p style="color:#0a0f1e;font-size:28px;font-weight:900;margin:8px 0">${totalViews.toLocaleString()}</p>
        <p style="font-size:12px;margin:0;color:${Number(viewChange) >= 0 ? '#10b981' : '#ef4444'}">${Number(viewChange) >= 0 ? '↑' : '↓'} ${viewChange}%</p>
      </div>
      <div style="background:#faf8f2;border-radius:12px;padding:16px;text-align:center">
        <p style="color:#64748b;font-size:12px;margin:0">الزوار الفريدون</p>
        <p style="color:#0a0f1e;font-size:28px;font-weight:900;margin:8px 0">${uniqueVisitors.toLocaleString()}</p>
        <p style="font-size:12px;margin:0;color:${Number(visitorChange) >= 0 ? '#10b981' : '#ef4444'}">${Number(visitorChange) >= 0 ? '↑' : '↓'} ${visitorChange}%</p>
      </div>
    </div>
    <table style="width:100%;margin-bottom:16px"><thead><tr><th colspan="2" style="text-align:start;color:#0a0f1e;font-size:14px;padding-bottom:8px">أهم ٥ صفحات</th></tr></thead><tbody>${top(pageMap)}</tbody></table>
    <table style="width:100%;margin-bottom:16px"><thead><tr><th colspan="2" style="text-align:start;color:#0a0f1e;font-size:14px;padding-bottom:8px">أهم ٥ مصادر</th></tr></thead><tbody>${top(referrerMap)}</tbody></table>
    <table style="width:100%;margin-bottom:16px"><thead><tr><th colspan="2" style="text-align:start;color:#0a0f1e;font-size:14px;padding-bottom:8px">أهم ٥ دول</th></tr></thead><tbody>${top(countryMap)}</tbody></table>
    <div style="text-align:center;margin-top:24px">
      <a href="https://www.marfa.sa/admin/analytics" style="display:inline-block;background:#c9a84c;color:#0a0f1e;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:bold;font-size:15px">افتح لوحة التحليلات</a>
    </div>
    <div style="margin-top:32px;padding-top:20px;border-top:1px solid #c9a84c44;text-align:center">
      <p style="color:#64748b;font-size:11px;margin:0">www.marfa.sa | منصة مرفأ الاستثمارية | حائل 🇸🇦</p>
    </div>
  </div>
</div>
</body></html>`;

    try {
      const resend = getResend();
      const result = await resend.emails.send({
        from: 'مرفأ <noreply@marfa.sa>',
        to: 'mohamedy2003@gmail.com',
        subject: '⚓ مرفأ — تقرير زيارات الموقع الأسبوعي',
        html,
      });

      if (result.error) errors.push(result.error.message);

      return NextResponse.json({
        success: !result.error,
        stats: { totalViews, uniqueVisitors, viewChange, visitorChange },
        errors,
      });
    } catch (err) {
      errors.push(err instanceof Error ? err.message : 'Email send failed');
      return NextResponse.json({ success: false, stats: { totalViews, uniqueVisitors }, errors }, { status: 500 });
    }
  } catch (err) {
    errors.push(err instanceof Error ? err.message : 'Internal error');
    return NextResponse.json({ success: false, errors }, { status: 500 });
  }
}
