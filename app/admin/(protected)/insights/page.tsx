import { createServiceClient } from '@/lib/supabase/service';
import { requireSuperAdmin } from '@/lib/auth/requireSuperAdmin';

export const dynamic = 'force-dynamic';

export default async function InsightsPage() {
  await requireSuperAdmin();

  const svc = createServiceClient();

  // Get last 4 weeks of data
  const { data: weeks } = await svc
    .from('user_journey_analysis')
    .select('week_start')
    .order('week_start', { ascending: false })
    .limit(1);

  const latestWeek = weeks?.[0]?.week_start || null;

  const { data: latest } = await svc
    .from('user_journey_analysis')
    .select('*')
    .eq('week_start', latestWeek)
    .order('engagement_score', { ascending: false });

  const journeys = latest || [];

  const totalUsers = journeys.length;
  const avgEngagement = totalUsers > 0
    ? Math.round(journeys.reduce((s, j) => s + (j.engagement_score || 0), 0) / totalUsers)
    : 0;
  const registered = journeys.filter(j => j.is_registered).length;
  const powerUsers = journeys.filter(j => j.behavior_segment === 'power_user').length;
  const quizTakers = journeys.filter(j => j.quiz_meeting).length;
  const churned = journeys.filter(j => j.churn_risk === 'high').length;
  const learners = journeys.filter(j => j.behavior_segment === 'learner').length;
  const explorers = journeys.filter(j => j.behavior_segment === 'explorer').length;

  // Top recommendations
  const recommendations = journeys
    .filter(j => j.recommended_action && j.recommended_action !== 'متابعة عادية')
    .slice(0, 5);

  // Power users
  const topUsers = journeys
    .filter(j => j.behavior_segment === 'power_user' || j.engagement_score >= 50)
    .sort((a, b) => (b.engagement_score || 0) - (a.engagement_score || 0))
    .slice(0, 5);

  // Trend: compare with previous week
  const prevWeekDate = latestWeek
    ? new Date(new Date(latestWeek).getTime() - 7 * 86400000).toISOString().split('T')[0]
    : null;

  const { data: prevWeek } = prevWeekDate
    ? await svc.from('user_journey_analysis').select('engagement_score').eq('week_start', prevWeekDate)
    : { data: null };

  const prevAvg = prevWeek && prevWeek.length > 0
    ? Math.round(prevWeek.reduce((s, j) => s + (j.engagement_score || 0), 0) / prevWeek.length)
    : null;
  const trend = prevAvg ? avgEngagement - prevAvg : null;

  // Arabic date
  const weekLabel = latestWeek
    ? new Date(latestWeek).toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : '—';

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-[#faf8f2]" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-[#0a0f1e] mb-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          📊 رؤى مرفأ
        </h1>
        <p className="text-[#8a94a8] text-sm mb-8" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          تحليل أسبوع {weekLabel}
        </p>

        {/* Key metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'زائر', value: totalUsers, sub: `${registered} مسجل` },
            { label: 'متوسط التفاعل', value: `${avgEngagement}/100`, sub: trend !== null ? `${trend >= 0 ? '↑' : '↓'} ${Math.abs(trend)}` : '—', color: trend !== null && trend >= 0 ? '#10b981' : '#ef4444' },
            { label: 'متميز', value: powerUsers, sub: quizTakers > 0 ? `${quizTakers} مجلس` : '' },
            { label: 'متوقف', value: churned, sub: churned > 0 ? 'يحتاجون تفعيل' : '—', color: churned > 0 ? '#ef4444' : '#64748b' },
          ].map((m, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 text-center border border-[#c9a84c]/15 shadow-[0_4px_16px_rgba(10,15,30,0.03)]">
              <p className="text-2xl font-black text-[#0a0f1e]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>{m.value}</p>
              <p className="text-xs text-[#4a5b78] mt-1" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>{m.label}</p>
              <p className="text-xs mt-1" style={{ fontFamily: 'var(--font-tajawal), sans-serif', color: (m as { color?: string }).color || '#8a94a8' }}>{m.sub}</p>
            </div>
          ))}
        </div>

        {/* Segments */}
        <div className="bg-white rounded-2xl p-6 border border-[#c9a84c]/15 shadow-[0_4px_16px_rgba(10,15,30,0.03)] mb-6">
          <h2 className="text-lg font-bold text-[#0a0f1e] mb-4" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>شرائح المستخدمين</h2>
          <div className="flex gap-3 flex-wrap">
            {[
              { label: '🏆 متميز', count: powerUsers, color: '#10b981' },
              { label: '✍️ مجلس', count: quizTakers, color: '#c9a84c' },
              { label: '📚 قارئ', count: learners, color: '#3b82f6' },
              { label: '🔍 مستكشف', count: explorers, color: '#8a94a8' },
              { label: '⚠️ متوقف', count: churned, color: '#ef4444' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2 bg-[#faf8f2] rounded-full px-4 py-2">
                <span className="text-sm" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>{s.label}</span>
                <span className="text-sm font-bold" style={{ color: s.color }}>{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-[#c9a84c]/15 shadow-[0_4px_16px_rgba(10,15,30,0.03)] mb-6">
            <h2 className="text-lg font-bold text-[#0a0f1e] mb-4" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>🎯 توصيات للمستخدمين</h2>
            <div className="space-y-3">
              {recommendations.map((r, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-[#faf8f2] rounded-xl">
                  <span className="text-sm shrink-0 mt-0.5">
                    {r.churn_risk === 'high' ? '🔴' : r.churn_risk === 'medium' ? '🟡' : '🟢'}
                  </span>
                  <div>
                    <p className="text-sm text-[#0a0f1e] font-bold" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                      {r.email || r.user_id?.slice(0, 12)} — {r.engagement_score}/100
                    </p>
                    <p className="text-xs text-[#4a5b78]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                      {r.recommended_action}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top users */}
        {topUsers.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-[#c9a84c]/15 shadow-[0_4px_16px_rgba(10,15,30,0.03)]">
            <h2 className="text-lg font-bold text-[#0a0f1e] mb-4" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>⭐ الأكثر تفاعلاً</h2>
            <div className="space-y-2">
              {topUsers.map((u, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-[#c9a84c]/10 last:border-0">
                  <span className="text-sm text-[#0a0f1e]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                    {u.email || u.user_id?.slice(0, 12)}
                  </span>
                  <span className="text-xs text-[#4a5b78]">
                    {u.behavior_segment === 'power_user' ? '🏆 ' : ''}{u.engagement_score}/100
                    {u.quiz_score ? ` • درجة ${u.quiz_score}/5` : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {totalUsers === 0 && (
          <div className="text-center py-20">
            <p className="text-[#8a94a8] text-lg" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
              لا توجد بيانات بعد — أول تقرير سيصدر يوم الأحد القادم
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
