import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

// ── Types ──────────────────────────────────────────────────────────────────

interface PageView {
  visitor_hash: string;
  user_hash: string | null;
  path: string;
  country: string | null;
  referrer: string | null;
  created_at: string;
}

interface QuizAnswer {
  user_id: string;
  meeting_number: number;
  score: number | null;
  created_at: string;
}

interface Profile {
  id: string;
  email: string;
}

interface UserJourney {
  userId: string;
  email: string | null;
  isRegistered: boolean;
  totalVisits: number;
  pagesVisited: { path: string; count: number }[];
  daysActive: number;
  firstVisit: string;
  lastVisit: string;
  quizMeeting: number | null;
  quizScore: number | null;
  engagementScore: number;
  churnRisk: string;
  behaviorSegment: string;
  recommendedAction: string;
}

interface AggregatedInsight {
  type: 'drop_off' | 'opportunity' | 'win' | 'risk';
  title: string;
  description: string;
  affectedUsers: number;
  priority: 'high' | 'medium' | 'low';
  suggestedAction: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function getWeekStart(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split('T')[0];
}

function computeEngagementScore(j: Omit<UserJourney, 'engagementScore' | 'churnRisk' | 'behaviorSegment' | 'recommendedAction'>): number {
  let score = 10; // base: visited at all
  score += Math.min(j.daysActive * 10, 50); // up to 50 for daily activity
  const paths = j.pagesVisited.map(p => p.path);

  if (paths.some(p => p.startsWith('/learn'))) score += 15;
  if (paths.some(p => p.startsWith('/meetings'))) score += 15;
  if (j.quizMeeting) score += 20;
  if (j.isRegistered) score += 15;
  if (paths.some(p => p.startsWith('/dashboard'))) score += 10;

  return Math.min(score, 100);
}

function classifySegment(j: Omit<UserJourney, 'behaviorSegment' | 'recommendedAction'>, prevTotalVisits: number): string {
  if (j.totalVisits === 0 && prevTotalVisits > 0) return 'dropped_off';
  if (j.isRegistered && j.quizMeeting && j.totalVisits >= 5) return 'power_user';
  if (j.quizMeeting) return 'quiz_taker';
  const paths = j.pagesVisited.map(p => p.path);
  if (paths.some(p => p.startsWith('/learn'))) return 'learner';
  if (j.totalVisits <= 2 && !j.isRegistered) return 'explorer';
  return 'explorer';
}

function computeChurnRisk(j: UserJourney, prevTotalVisits: number): string {
  if (prevTotalVisits === 0 && j.totalVisits <= 2) return 'new';
  if (j.totalVisits === 0 && prevTotalVisits > 0) return 'high';
  if (j.totalVisits < prevTotalVisits * 0.5) return 'medium';
  return 'low';
}

function recommendAction(j: UserJourney): string {
  const paths = j.pagesVisited.map(p => p.path);

  if (j.churnRisk === 'high') return 'إرسال إيميل إعادة تفعيل — لم يعد هذا الأسبوع بعد نشاط سابق';
  if (j.churnRisk === 'medium') return 'إرسال إيميل تذكيري بمحتوى جديد — نشاطه يتراجع';
  if (j.churnRisk === 'new' && !j.isRegistered) return 'عرض CTA تسجيل عند زيارته القادمة';

  if (paths.some(p => p.startsWith('/jobs')) && !j.isRegistered) return 'عرض تنبيهات وظيفية للتسجيل';
  if (paths.some(p => p.startsWith('/learn')) && !j.quizMeeting) return 'دعوته للمجلس الاستشاري — يقرأ لكنه لا يشارك';
  if (j.quizMeeting && !paths.some(p => p.startsWith('/dashboard'))) return 'تعريفه بلوحة التحكم والتقييمات الشهرية';
  if (j.quizMeeting && j.quizScore && j.quizScore <= 2) return 'إرسال ملاحظات تحسين من المستشار — أداؤه منخفض';

  if (j.behaviorSegment === 'power_user') return 'مستخدم قوي — إشراكه في برامج متقدمة أو دعوته كمتحدث';
  if (j.behaviorSegment === 'explorer') return 'تعريفه بالأدوات المجانية (مستشار 360°، خطاب المصعد)';

  return 'متابعة عادية';
}

// ── Aggregated insights generator ──────────────────────────────────────────

function generateAggregatedInsights(journeys: UserJourney[]): AggregatedInsight[] {
  const insights: AggregatedInsight[] = [];

  // 1. Drop-off: jobs visitors not registering
  const jobsVisitors = journeys.filter(j =>
    j.pagesVisited.some(p => p.path.startsWith('/jobs')) && !j.isRegistered
  );
  if (jobsVisitors.length > 0) {
    insights.push({
      type: 'opportunity',
      title: 'زوّار الوظائف لا يسجّلون',
      description: `${jobsVisitors.length} زائر تصفّحوا صفحات الوظائف هذا الأسبوع ولم يسجّلوا. صفحات الوظائف هي ثاني أكبر مصدر للترافك المجهول.`,
      affectedUsers: jobsVisitors.length,
      priority: 'high',
      suggestedAction: 'إضافة CTA تسجيل بارز داخل صفحة تفاصيل الوظيفة (وليس فقط في القائمة). أو Gate المحتوى: "سجّل لمشاهدة كل التفاصيل".',
    });
  }

  // 2. Drop-off: learn visitors not progressing to quiz
  const learnersNoQuiz = journeys.filter(j =>
    j.pagesVisited.some(p => p.path.startsWith('/learn')) && !j.quizMeeting && j.totalVisits >= 2
  );
  if (learnersNoQuiz.length > 0) {
    insights.push({
      type: 'drop_off',
      title: 'زوّار المعرفة لا يشاركون في المجلس',
      description: `${learnersNoQuiz.length} مستخدم يزور مركز المعرفة بانتظام لكنه لم يجرب المجلس الاستشاري.`,
      affectedUsers: learnersNoQuiz.length,
      priority: 'medium',
      suggestedAction: 'إضافة قسم "طبّق معرفتك" في نهاية كل مقال مع رابط مباشر للمجلس. أو بطاقة "المجلس الاستشاري" داخل صفحة /learn.',
    });
  }

  // 3. Churn risk: previously active now gone
  const churned = journeys.filter(j => j.churnRisk === 'high');
  if (churned.length > 0) {
    insights.push({
      type: 'risk',
      title: 'مستخدمون توقفوا عن الزيارة',
      description: `${churned.length} مستخدم كانوا نشطين الأسبوع الماضي وتوقفوا تماماً هذا الأسبوع.`,
      affectedUsers: churned.length,
      priority: 'high',
      suggestedAction: 'إرسال إيميل "نفتقدك" مع رابط لمحتوى جديد أو أداة مجانية. تفعيل إيميلات إعادة الاستهداف التلقائية.',
    });
  }

  // 4. Win: quiz takers growing
  const quizTakers = journeys.filter(j => j.quizMeeting);
  if (quizTakers.length > 0) {
    insights.push({
      type: 'win',
      title: 'المجلس الاستشاري ينمو',
      description: `${quizTakers.length} مستخدم أجابوا على أسئلة المجلس هذا الأسبوع.`,
      affectedUsers: quizTakers.length,
      priority: 'low',
      suggestedAction: 'استمرار — مشاركة أفضل الإجابات (بإذن) لتحفيز الآخرين. إضافة شارة "متميز" للمجيبين.',
    });
  }

  // 5. Power users
  const powerUsers = journeys.filter(j => j.behaviorSegment === 'power_user');
  if (powerUsers.length > 0) {
    insights.push({
      type: 'win',
      title: 'مستخدمون متميزون',
      description: `${powerUsers.length} مستخدم نشط بالكامل — مسجّل، يزور الأدوات، ويجيب على المجلس.`,
      affectedUsers: powerUsers.length,
      priority: 'medium',
      suggestedAction: 'التواصل معهم شخصياً — شهادات، إحالات، دعوة للأكاديمية أو برامج متقدمة.',
    });
  }

  // 6. Empty quiz: meeting with no answers
  const quizMeetings = new Set(journeys.filter(j => j.quizMeeting).map(j => j.quizMeeting));
  if (quizMeetings.size === 0 && journeys.length > 5) {
    insights.push({
      type: 'risk',
      title: 'لا توجد مشاركات في المجلس هذا الأسبوع',
      description: 'لا يوجد أي مستخدم أجاب على سؤال المجلس هذا الأسبوع رغم وجود زيارات.',
      affectedUsers: journeys.length,
      priority: 'high',
      suggestedAction: 'مراجعة توقيت إرسال التذكير — هل وصل متأخراً؟ هل السؤال واضح؟ هل يحتاج تذكيراً ثانياً منتصف الأسبوع؟',
    });
  }

  // 7. Anonymous majority
  const anonCount = journeys.filter(j => !j.isRegistered).length;
  const pct = journeys.length > 0 ? Math.round((anonCount / journeys.length) * 100) : 0;
  if (pct > 60) {
    insights.push({
      type: 'opportunity',
      title: `${pct}٪ من الزوّار مجهولون`,
      description: `${anonCount} من ${journeys.length} زائر لم يسجّلوا بعد.`,
      affectedUsers: anonCount,
      priority: 'high',
      suggestedAction: 'تحسين صفحة /join وزيادة CTAs التسجيل. اختبار A/B لنص الـ CTA وصفحة الهبوط.',
    });
  }

  return insights;
}

// ── Email HTML ─────────────────────────────────────────────────────────────

function buildAnalysisEmail(journeys: UserJourney[], insights: AggregatedInsight[], weekStart: string, prevWeekTotal: number): string {
  const total = journeys.length;
  const registered = journeys.filter(j => j.isRegistered).length;
  const anon = total - registered;
  const avgEngagement = total > 0 ? Math.round(journeys.reduce((s, j) => s + j.engagementScore, 0) / total) : 0;
  const powerUsers = journeys.filter(j => j.behaviorSegment === 'power_user').length;
  const churned = journeys.filter(j => j.churnRisk === 'high').length;
  const quizTakers = journeys.filter(j => j.quizMeeting).length;

  const change = prevWeekTotal > 0 ? Math.round(((total - prevWeekTotal) / prevWeekTotal) * 100) : 0;

  const insightsHTML = insights.map(i => `
    <div style="border:1px solid ${i.priority === 'high' ? '#ef4444' : i.priority === 'medium' ? '#c9a84c' : '#10b981'}33;border-radius:12px;padding:16px;margin-bottom:12px;background:#ffffff">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <span style="font-size:16px">${i.type === 'risk' ? '🔴' : i.type === 'drop_off' ? '🟡' : i.type === 'opportunity' ? '🔵' : '🟢'}</span>
        <span style="font-weight:bold;font-size:14px;color:#0a0f1e">${i.title}</span>
        <span style="font-size:11px;color:#64748b;margin-right:auto">${i.affectedUsers} مستخدم</span>
      </div>
      <p style="color:#4a5b78;font-size:13px;line-height:1.7;margin:0 0 8px 0">${i.description}</p>
      <p style="color:#0a0f1e;font-size:12px;line-height:1.6;margin:0;background:#faf8f2;padding:8px 12px;border-radius:8px">💡 ${i.suggestedAction}</p>
    </div>
  `).join('');

  return `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"></head>
<body style="font-family:'Tajawal','Cairo',sans-serif;direction:rtl;background:#faf8f2;padding:30px;margin:0">
<div style="max-width:640px;margin:auto;background:#fff;border:1px solid #c9a84c33;border-radius:24px;overflow:hidden;box-shadow:0 8px 30px rgba(10,15,30,0.06)">

<div style="background:linear-gradient(135deg,#0a0f1e,#0d1628);padding:32px 24px;text-align:center">
  <h1 style="color:#c9a84c;font-size:22px;margin:0 0 6px 0">🧠 تحليل سلوك المستخدمين — ${weekStart}</h1>
  <p style="color:#a0aec0;font-size:13px;margin:0">تقرير أسبوعي لتوجيه أولويات التطوير</p>
</div>

<div style="padding:32px 24px">

  <!-- Summary cards -->
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:20px">
    <div style="background:#faf8f2;border-radius:12px;padding:14px;text-align:center">
      <p style="color:#64748b;font-size:11px;margin:0">زائر فريد</p>
      <p style="font-size:26px;font-weight:900;color:#0a0f1e;margin:6px 0">${total}</p>
      <p style="font-size:11px;color:${change >= 0 ? '#10b981' : '#ef4444'}">${change >= 0 ? '↑' : '↓'} ${Math.abs(change)}%</p>
    </div>
    <div style="background:#faf8f2;border-radius:12px;padding:14px;text-align:center">
      <p style="color:#64748b;font-size:11px;margin:0">متوسط التفاعل</p>
      <p style="font-size:26px;font-weight:900;color:#c9a84c;margin:6px 0">${avgEngagement}</p>
      <p style="font-size:11px;color:#64748b">من 100</p>
    </div>
    <div style="background:#faf8f2;border-radius:12px;padding:14px;text-align:center">
      <p style="color:#64748b;font-size:11px;margin:0">مسجّل / مجهول</p>
      <p style="font-size:22px;font-weight:900;color:#0a0f1e;margin:6px 0">${registered}/${anon}</p>
      <p style="font-size:11px;color:#64748b">${total > 0 ? Math.round(registered / total * 100) : 0}% مسجّل</p>
    </div>
  </div>

  <!-- Segments -->
  <table style="width:100%;margin-bottom:20px;border-collapse:collapse">
    <tr style="background:#faf8f2">
      <td style="padding:8px;font-size:12px;color:#64748b">🏆 متميز</td>
      <td style="padding:8px;font-size:14px;font-weight:bold;color:#10b981;text-align:left">${powerUsers}</td>
      <td style="padding:8px;font-size:12px;color:#64748b">✍️ مجلس</td>
      <td style="padding:8px;font-size:14px;font-weight:bold;color:#c9a84c;text-align:left">${quizTakers}</td>
    </tr>
    <tr>
      <td style="padding:8px;font-size:12px;color:#64748b">📚 قارئ</td>
      <td style="padding:8px;font-size:14px;font-weight:bold;text-align:left">${journeys.filter(j => j.behaviorSegment === 'learner').length}</td>
      <td style="padding:8px;font-size:12px;color:#64748b">⚠️ متوقف</td>
      <td style="padding:8px;font-size:14px;font-weight:bold;color:#ef4444;text-align:left">${churned}</td>
    </tr>
  </table>

  <!-- Insights -->
  <h2 style="color:#0a0f1e;font-size:16px;margin:0 0 12px 0">📋 توصيات التطوير</h2>
  ${insightsHTML}

  <!-- High-value users -->
  ${powerUsers > 0 ? `
  <div style="margin-top:20px;padding:16px;background:#fdf9ef;border:1px solid #c9a84c33;border-radius:12px">
    <h3 style="color:#c9a84c;font-size:14px;margin:0 0 8px 0">⭐ المستخدمون المتميزون هذا الأسبوع</h3>
    ${journeys.filter(j => j.behaviorSegment === 'power_user').slice(0, 5).map(j => `
    <div style="font-size:12px;color:#4a5b78;padding:4px 0">
      ${j.email || j.userId.slice(0, 8)} — ${j.engagementScore}/100 — ${j.quizScore ? `درجة ${j.quizScore}/5` : 'بلا تقييم'}
    </div>`).join('')}
  </div>` : ''}

  <div style="margin-top:24px;padding-top:16px;border-top:1px solid #c9a84c44;text-align:center">
    <p style="color:#64748b;font-size:10px;margin:0">🧠 نظام تحليل رحلة المستخدم — مرفأ | يصلك كل أحد</p>
  </div>

</div></div></body></html>`;
}

// ── GET handler ────────────────────────────────────────────────────────────

export async function GET() {
  // Guard: only run on Sunday
  if (new Date().getUTCDay() !== 0) {
    return NextResponse.json({ skipped: true, reason: 'Not Sunday' });
  }

  try {
    const svc = createServiceClient();
    const weekStart = getWeekStart();
    const since = new Date(weekStart).toISOString();
    const prevWeekStart = new Date(new Date(weekStart).getTime() - 7 * 86400000).toISOString().split('T')[0];
    const prevSince = new Date(prevWeekStart).toISOString();

    console.log(`[user-journey] Analyzing week ${weekStart} (prev: ${prevWeekStart})`);

    // ── 1. Fetch this week's page views ──
    const { data: thisWeekViews } = await svc
      .from('page_views')
      .select('visitor_hash, user_hash, path, country, referrer, created_at')
      .gte('created_at', since)
      .order('created_at', { ascending: true });

    // ── 2. Fetch last week's page views (for churn detection) ──
    const { data: lastWeekViews } = await svc
      .from('page_views')
      .select('visitor_hash, user_hash, path, created_at')
      .gte('created_at', prevSince)
      .lt('created_at', since)
      .order('created_at', { ascending: true });

    // ── 3. Fetch quiz answers this week ──
    const { data: quizAnswers } = await svc
      .from('majlis_quiz_answers')
      .select('user_id, meeting_number, score, created_at')
      .gte('created_at', since);

    // ── 4. Fetch all profiles for email matching ──
    const { data: profiles } = await svc
      .from('profiles')
      .select('id, email');

    const profileMap = new Map<string, string>();
    if (profiles) {
      for (const p of profiles) {
        profileMap.set(p.id, (p.email || '').trim().toLowerCase());
      }
    }

    const views = (thisWeekViews || []) as PageView[];
    const prevViews = (lastWeekViews || []) as PageView[];
    const quizzes = (quizAnswers || []) as QuizAnswer[];

    // ── 5. Group by user ──
    // Key: user_hash (registered) or visitor_hash (anonymous)
    const userMap = new Map<string, PageView[]>();
    for (const v of views) {
      const key = v.user_hash || v.visitor_hash;
      const arr = userMap.get(key) || [];
      arr.push(v);
      userMap.set(key, arr);
    }

    // Previous week grouping
    const prevUserMap = new Map<string, PageView[]>();
    for (const v of prevViews) {
      const key = v.user_hash || v.visitor_hash;
      const arr = prevUserMap.get(key) || [];
      arr.push(v);
      prevUserMap.set(key, arr);
    }

    // Quiz by user_id
    const quizByUser = new Map<string, QuizAnswer[]>();
    for (const q of quizzes) {
      const arr = quizByUser.get(q.user_id) || [];
      arr.push(q);
      quizByUser.set(q.user_id, arr);
    }

    // ── 6. Build user journeys ──
    const journeys: UserJourney[] = [];

    for (const [userId, userViews] of userMap) {
      const paths = new Map<string, number>();
      const days = new Set<string>();
      let firstVisit = userViews[0].created_at;
      let lastVisit = userViews[0].created_at;

      for (const v of userViews) {
        paths.set(v.path, (paths.get(v.path) || 0) + 1);
        days.add(v.created_at.split('T')[0]);
        if (v.created_at < firstVisit) firstVisit = v.created_at;
        if (v.created_at > lastVisit) lastVisit = v.created_at;
      }

      const pagesVisited = Array.from(paths.entries()).map(([path, count]) => ({ path, count }));
      const isRegistered = !!userViews[0].user_hash;
      const email = isRegistered ? profileMap.get(userId) || null : null;

      const userQuiz = isRegistered ? quizByUser.get(userId) : undefined;
      const quizMeeting = userQuiz?.[0]?.meeting_number || null;
      const quizScore = userQuiz?.[0]?.score || null;

      const prevUserViews = prevUserMap.get(userId) || [];

      const journey: Omit<UserJourney, 'engagementScore' | 'churnRisk' | 'behaviorSegment' | 'recommendedAction'> = {
        userId,
        email,
        isRegistered,
        totalVisits: userViews.length,
        pagesVisited,
        daysActive: days.size,
        firstVisit,
        lastVisit,
        quizMeeting,
        quizScore,
      };

      const engagementScore = computeEngagementScore(journey);
      const churnRisk = computeChurnRisk({ ...journey, engagementScore, churnRisk: '', behaviorSegment: '', recommendedAction: '' }, prevUserViews.length);
      const behaviorSegment = classifySegment({ ...journey, engagementScore }, prevUserViews.length);

      const fullJourney: UserJourney = {
        ...journey,
        engagementScore,
        churnRisk,
        behaviorSegment,
        recommendedAction: '',
      };
      fullJourney.recommendedAction = recommendAction(fullJourney);

      journeys.push(fullJourney);
    }

    // ── 7. Sort by engagement ──
    journeys.sort((a, b) => b.engagementScore - a.engagementScore);

    // ── 8. Generate aggregated insights ──
    const insights = generateAggregatedInsights(journeys);

    // ── 9. Save to DB ──
    for (const j of journeys) {
      await svc.from('user_journey_analysis').upsert({
        user_id: j.userId,
        email: j.email,
        is_registered: j.isRegistered,
        week_start: weekStart,
        total_visits: j.totalVisits,
        pages_visited: j.pagesVisited,
        days_active: j.daysActive,
        first_visit: j.firstVisit,
        last_visit: j.lastVisit,
        quiz_meeting: j.quizMeeting,
        quiz_score: j.quizScore,
        engagement_score: j.engagementScore,
        churn_risk: j.churnRisk,
        behavior_segment: j.behaviorSegment,
        recommended_action: j.recommendedAction,
        insights_json: { aggregated_recommendations: insights },
      }, { onConflict: 'user_id, week_start' });
    }

    // ── 10. Send email ──
    const resend = new Resend(process.env.RESEND_API_KEY);
    const prevWeekTotal = prevUserMap.size;

    try {
      await resend.emails.send({
        from: 'Marfa Analytics <noreply@marfa.sa>',
        to: 'op.younis@gmail.com',
        subject: `🧠 تحليل رحلة المستخدم — ${weekStart} | ${journeys.length} مستخدم | ${insights.length} توصية`,
        html: buildAnalysisEmail(journeys, insights, weekStart, prevWeekTotal),
      });
    } catch (emailErr) {
      console.error('[user-journey] email failed', emailErr);
    }

    return NextResponse.json({
      success: true,
      weekStart,
      users: journeys.length,
      insights: insights.length,
      segments: {
        power_user: journeys.filter(j => j.behaviorSegment === 'power_user').length,
        quiz_taker: journeys.filter(j => j.behaviorSegment === 'quiz_taker').length,
        learner: journeys.filter(j => j.behaviorSegment === 'learner').length,
        explorer: journeys.filter(j => j.behaviorSegment === 'explorer').length,
        dropped_off: journeys.filter(j => j.behaviorSegment === 'dropped_off').length,
      },
      churn: {
        high: journeys.filter(j => j.churnRisk === 'high').length,
        medium: journeys.filter(j => j.churnRisk === 'medium').length,
        low: journeys.filter(j => j.churnRisk === 'low').length,
        new: journeys.filter(j => j.churnRisk === 'new').length,
      },
      avgEngagement: journeys.length > 0
        ? Math.round(journeys.reduce((s, j) => s + j.engagementScore, 0) / journeys.length)
        : 0,
    });
  } catch (err: unknown) {
    console.error('[user-journey]', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
