// Shared, dependency-free journey-scoring logic.
// Used by both the weekly cron (app/api/cron/user-journey-analysis/route.ts)
// and standalone backfill scripts. Keep this file free of Next.js/server-only,
// Resend, and AI imports so it can be imported outside the Next.js runtime.

import { createHash } from 'node:crypto';

export interface PageView {
  visitor_hash: string;
  user_hash: string | null;
  path: string;
  country: string | null;
  referrer: string | null;
  device?: string | null;
  utm_source?: string | null;
  event_name?: string | null;
  variant?: string | null;
  is_likely_bot?: boolean | null;
  created_at: string;
}

export interface QuizAnswer {
  user_id: string;
  meeting_number: number;
  score: number | null;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
}

export interface UserJourney {
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

export interface AggregatedInsight {
  type: 'drop_off' | 'opportunity' | 'win' | 'risk';
  title: string;
  description: string;
  affectedUsers: number;
  priority: 'high' | 'medium' | 'low';
  suggestedAction: string;
}

// page_views.user_hash is sha256(user.id) — key profiles/quiz answers the same
// way, or the registered-user join silently misses.
export function hashId(id: string): string {
  return createHash('sha256').update(id).digest('hex');
}

export function getWeekStart(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split('T')[0];
}

export function computeEngagementScore(j: Omit<UserJourney, 'engagementScore' | 'churnRisk' | 'behaviorSegment' | 'recommendedAction'>): number {
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

export function classifySegment(j: Omit<UserJourney, 'behaviorSegment' | 'recommendedAction'>, prevTotalVisits: number): string {
  if (j.totalVisits === 0 && prevTotalVisits > 0) return 'dropped_off';
  if (j.isRegistered && j.quizMeeting && j.totalVisits >= 5) return 'power_user';
  if (j.quizMeeting) return 'quiz_taker';
  const paths = j.pagesVisited.map(p => p.path);
  if (paths.some(p => p.startsWith('/learn'))) return 'learner';
  if (j.totalVisits <= 2 && !j.isRegistered) return 'explorer';
  return 'explorer';
}

export function computeChurnRisk(j: UserJourney, prevTotalVisits: number): string {
  if (prevTotalVisits === 0 && j.totalVisits <= 2) return 'new';
  if (j.totalVisits === 0 && prevTotalVisits > 0) return 'high';
  if (j.totalVisits < prevTotalVisits * 0.5) return 'medium';
  return 'low';
}

export function recommendAction(j: UserJourney): string {
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

export function generateAggregatedInsights(journeys: UserJourney[]): AggregatedInsight[] {
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
