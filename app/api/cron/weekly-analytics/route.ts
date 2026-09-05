import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { generateWithDeepSeek } from '@/lib/ai/deepseek';
import { Resend } from 'resend';

function isCronAuthorized(request: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return false;
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

  // Guard: only run on Sunday (Vercel can trigger on deploy)
  if (new Date().getUTCDay() !== 0) {
    return NextResponse.json({ skipped: true, reason: 'Not Sunday' });
  }

  const errors: string[] = [];

  try {
    const svc = createServiceClient();
    const since = new Date(Date.now() - 7 * 86400000).toISOString();
    const prevSince = new Date(Date.now() - 14 * 86400000).toISOString();
    const prevUntil = since;

    const { data: rows, error: fetchError } = await svc
      .from('page_views')
      .select('path,referrer,country,device,visitor_hash,user_hash,utm_source,event_name,variant,created_at')
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

    // Top pages + auth split + UTM
    const pageMap = new Map<string, number>();
    const pageAnonMap = new Map<string, number>();
    const pageAuthMap = new Map<string, number>();
    const referrerMap = new Map<string, number>();
    const countryMap = new Map<string, number>();
    const utmSourceMap = new Map<string, number>();
    const eventMap = new Map<string, number>();
    const eventVariantMap = new Map<string, number>();
    let authTotal = 0;
    let anonTotal = 0;

    // Daily series for last 14 days
    const dailySeries: Record<string, number> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
      dailySeries[d] = 0;
    }
    const current7dDays = new Set<string>();
    for (let i = 0; i < 7; i++) {
      const d = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
      current7dDays.add(d);
    }

    for (const r of current) {
      pageMap.set(r.path, (pageMap.get(r.path) || 0) + 1);
      if (r.user_hash) {
        pageAuthMap.set(r.path, (pageAuthMap.get(r.path) || 0) + 1);
        authTotal++;
      } else {
        pageAnonMap.set(r.path, (pageAnonMap.get(r.path) || 0) + 1);
        anonTotal++;
      }
      const ref = r.referrer ? new URL(r.referrer).hostname : 'مباشر';
      referrerMap.set(ref, (referrerMap.get(ref) || 0) + 1);
      if (r.country) countryMap.set(r.country, (countryMap.get(r.country) || 0) + 1);
      if (r.utm_source) utmSourceMap.set(r.utm_source, (utmSourceMap.get(r.utm_source) || 0) + 1);
      if (r.event_name) {
        eventMap.set(r.event_name, (eventMap.get(r.event_name) || 0) + 1);
        const evKey = r.variant ? `${r.event_name} [${r.variant}]` : r.event_name;
        eventVariantMap.set(evKey, (eventVariantMap.get(evKey) || 0) + 1);
      }
      const d = r.created_at.split('T')[0];
      if (dailySeries[d] !== undefined) dailySeries[d]++;
    }

    const topN = (m: Map<string, number>, limit = 5) =>
      [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);

    const top = (m: Map<string, number>, limit = 5) =>
      topN(m, limit)
        .map(([k, v]) => `<tr><td style="text-align:right;padding:4px 8px">${k}</td><td style="text-align:start;padding:4px 8px;color:#c9a84c;font-weight:bold">${v}</td></tr>`)
        .join('');

    const eventRows = eventVariantMap.size > 0
      ? [...eventVariantMap.entries()].sort((a, b) => b[1] - a[1])
          .map(([k, v]) => `<tr><td style="text-align:right;padding:4px 8px">${k}</td><td style="text-align:start;padding:4px 8px;color:#c9a84c;font-weight:bold">${v}</td></tr>`)
          .join('')
      : '';

    // ── AI Insights ──────────────────────────────────────────────

    let insightsHtml = '';

    try {
      const dailyEntries = Object.entries(dailySeries).map(([date, views]) => ({ date, views }));
      const current7dViews = dailyEntries.filter((d) => current7dDays.has(d.date)).reduce((s, d) => s + d.views, 0);
      const prev7dViews = dailyEntries.filter((d) => !current7dDays.has(d.date)).reduce((s, d) => s + d.views, 0);
      const wowGrowth = prev7dViews ? Math.round(((current7dViews - prev7dViews) / prev7dViews) * 100) : 0;

      const top8Pages = topN(pageMap, 8).map(([path, views]) => ({
        path, views,
        anonViews: pageAnonMap.get(path) || 0,
        authViews: pageAuthMap.get(path) || 0,
      }));
      const top5Referrers = topN(referrerMap, 5).map(([k, v]) => ({ domain: k, views: v }));
      const top5Utm = topN(utmSourceMap, 5).map(([k, v]) => ({ source: k, views: v }));

      const prompt = `You are a growth analyst for marfa.sa, a Saudi entrepreneurship platform. Given these aggregated web analytics, write 3–5 concise English insights in the style: growth trend, strongest organic acquisition page ("SEO goldmine"), where anonymous readers concentrate and what CTA to add, one actionable recommendation. Plain sentences, no markdown headers.

Stats:
- Total views (last 7 days): ${totalViews}
- Unique visitors (last 7 days): ${uniqueVisitors}
- Week-over-week growth: ${wowGrowth}%
- Authenticated views: ${authTotal}
- Anonymous views: ${anonTotal}
- Daily view series (last 14 days): ${JSON.stringify(dailyEntries)}
- Top 8 pages: ${JSON.stringify(top8Pages)}
- Top 5 referrer domains: ${JSON.stringify(top5Referrers)}
- Top 5 UTM sources: ${JSON.stringify(top5Utm)}
- Conversion events (name → count): ${JSON.stringify(Object.fromEntries(eventMap))}`;

      let insights: string;
      try {
        insights = await generateWithDeepSeek(prompt);
      } catch (deepseekErr) {
        console.error('DEEPSEEK_FALLBACK', deepseekErr instanceof Error ? deepseekErr.message : String(deepseekErr));
        // Fall back to Anthropic Claude Haiku
        const Anthropic = (await import('@anthropic-ai/sdk')).default;
        const anthropicKey = process.env.ANTHROPIC_API_KEY;
        if (anthropicKey) {
          const client = new Anthropic({ apiKey: anthropicKey });
          const msg = await client.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 600,
            messages: [{ role: 'user', content: prompt }],
          });
          insights = msg.content
            .filter((block) => block.type === 'text')
            .map((block) => (block as { type: 'text'; text: string }).text)
            .join('')
            .trim();
        } else {
          throw new Error('No Anthropic key for fallback');
        }
      }

      if (insights) {
        const paragraphs = insights
          .split('\n')
          .filter((l) => l.trim())
          .map((l) => l.replace(/^[-*]\s*/, '').trim())
          .filter(Boolean);
        insightsHtml = `
    <div style="background:linear-gradient(135deg,#fdf9ef,#faf6e7);border:1px solid #c9a84c44;border-radius:16px;padding:24px;margin-bottom:24px">
      <h2 style="color:#b8933a;font-size:16px;margin:0 0 16px 0;text-align:start">🤖 AI Insights</h2>
      ${paragraphs.map((p) => `<p style="color:#4a5b78;font-size:14px;line-height:1.7;margin:0 0 12px 0;text-align:start">${p}</p>`).join('')}
    </div>`;
      }
    } catch (aiErr) {
      console.error('AI_INSIGHTS_FAILED', aiErr instanceof Error ? aiErr.message : String(aiErr));
      // Send email without insights — stats email must always go out
    }

    const html = `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"></head>
<body style="font-family:'Tajawal','Cairo',sans-serif;direction:rtl;background:#faf8f2;padding:30px;margin:0">
<div style="max-width:600px;margin:auto;background:#fff;border:1px solid #c9a84c33;border-radius:24px;overflow:hidden;box-shadow:0 8px 30px rgba(10,15,30,0.06)">
  <div style="background:linear-gradient(135deg,#0a0f1e,#0d1628);padding:32px 24px;text-align:center">
    <h1 style="color:#c9a84c;font-size:24px;margin:0 0 8px 0">⚓ مرفأ — تقرير زيارات الموقع الأسبوعي</h1>
    <p style="color:#a0aec0;font-size:13px;margin:0">${new Date().toLocaleDateString('ar-SA')}</p>
  </div>
  <div style="padding:32px 24px">${insightsHtml}
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
    ${eventRows ? `<table style="width:100%;margin-bottom:16px"><thead><tr><th colspan="2" style="text-align:start;color:#0a0f1e;font-size:14px;padding-bottom:8px">أحداث التحويل</th></tr></thead><tbody>${eventRows}</tbody></table>` : ''}
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
