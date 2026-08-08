'use client';

import { useState, useEffect, useMemo } from 'react';

// ── Schedule data (mirrors MeetingsSchedule.tsx — immutable, hardcoded) ──
const SCHEDULE_DATA = [
  { num: '01', encounter: 'اللقاء 1', topic: 'الاستراتيجية', case: 'Airbnb', challenge: 'كيف تقنع المستثمر بفكرة تأجير خيام؟' },
  { num: '02', encounter: 'اللقاء 2', topic: 'القيادة', case: 'Zappos', challenge: 'هل يمكن بناء ثقافة مؤسسية تضحي من أجل العميل؟' },
  { num: '03', encounter: 'اللقاء 3', topic: 'المالية', case: 'WeWork', challenge: 'كيف تحولت شركة بمليارات الدولارات إلى الإفلاس؟' },
  { num: '04', encounter: 'اللقاء 4', topic: 'التسويق', case: 'Liquid Death', challenge: 'كيف تبيع منتجاً عادياً ببراند عبقري؟' },
  { num: '05', encounter: 'اللقاء 5', topic: 'العمليات', case: 'Amazon Logistics', challenge: 'كيف تدار العمليات لتقليل الهدر؟' },
  { num: '06', encounter: 'اللقاء 6', topic: 'التفاوض', case: 'Shark Tank', challenge: 'تحليل صفقات حقيقية: لماذا رفض المستثمر فكرة عبقرية؟' },
  { num: '07', encounter: 'اللقاء 7', topic: 'حوكمة الشركات', case: 'Saudi German Health', challenge: 'إدانة 11 عضو مجلس إدارة بتضخيم إيرادات.' },
  { num: '08', encounter: 'اللقاء 8', topic: 'الابتكار', case: 'Netflix', challenge: 'كيف تُقدم على تدمير نموذج عملك الناجح؟' },
  { num: '09', encounter: 'اللقاء 9', topic: 'الموارد البشرية', case: 'Google Project Aristotle', challenge: 'ما الذي يصنع فريقاً عالي الأداء فعلاً؟' },
  { num: '10', encounter: 'اللقاء 10', topic: 'إدارة المخاطر', case: 'Theranos', challenge: 'كيف يكتشف المستثمر علامات الخطر مبكراً؟' },
  { num: '11', encounter: 'اللقاء 11', topic: 'التوسع الدولي', case: 'IKEA', challenge: 'كيف توازن بين المعيار العالمي والتكيف المحلي؟' },
  { num: '12', encounter: 'اللقاء 12', topic: 'إدارة الأزمات', case: 'Johnson & Johnson', challenge: 'كيف تدار أزمة ثقة المستهلك بشفافية؟' },
  { num: '13', encounter: 'اللقاء 13', topic: 'الاستدامة والمسؤولية', case: 'Patagonia', challenge: 'هل يمكن أن يتوافق الربح مع القيم؟' },
  { num: '14', encounter: 'اللقاء 14', topic: 'دراسة الجدوى', case: 'Quibi', challenge: 'لماذا يفشل مشروع ضخم التمويل وبفريق نجوم؟' },
];

function getWeeklyFridaySchedule() {
  const baseFriday = new Date(2026, 5, 19);
  const dates: Date[] = [];
  for (let i = 0; i < 14; i++) { const d = new Date(baseFriday); d.setDate(d.getDate() + i * 7); dates.push(d); }
  return dates;
}
function formatDate(date: Date): string {
  const months = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}
function getThisFridayIndex(): number {
  const now = new Date(); const dayOfWeek = now.getDay();
  const friday = new Date(now);
  if (dayOfWeek === 0) friday.setDate(friday.getDate() - 2);
  else if (dayOfWeek < 5) friday.setDate(friday.getDate() + (5 - dayOfWeek));
  const baseFriday = new Date(2026, 5, 19);
  const diffMs = friday.getTime() - baseFriday.getTime();
  return Math.round(diffMs / (7 * 86400000));
}

interface MeetingRequest {
  id: string; name: string; email: string; company: string; preferred_time: string; message: string; status: string; created_at: string;
}

const MEETING_STATUS: Record<string, { label: string; color: string }> = {
  pending: { label: 'جديد', color: '#c9a84c' },
  contacted: { label: 'تم التواصل', color: '#10b981' },
  closed: { label: 'مغلق', color: '#64748b' },
};

export default function AdminMeetingsPage() {
  const [requests, setRequests] = useState<MeetingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const thisFridayIdx = useMemo(() => getThisFridayIndex(), []);
  const fridayDates = useMemo(() => getWeeklyFridaySchedule(), []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/meetings');
        const data = await res.json();
        if (!res.ok) { setError(data.error || 'Error'); setLoading(false); return; }
        setRequests(data.requests || []);
      } catch (err) { setError(err instanceof Error ? err.message : 'Failed'); }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="animate-pulse space-y-4" dir="rtl"><div className="h-8 bg-[#1a2540] rounded w-72" /><div className="h-64 bg-[#0d1628] rounded-2xl border border-[#1a2540]" /></div>;

  return (
    <div dir="rtl" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
      <h1 className="text-2xl font-bold text-white mb-6">الاجتماعات</h1>

      {/* Section A — Schedule */}
      <h2 className="text-lg font-bold text-[#c9a84c] mb-4">الجدول الأسبوعي</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
        {SCHEDULE_DATA.map((entry, idx) => {
          const isThisWeek = idx === thisFridayIdx;
          return (
            <div key={entry.num} className="rounded-xl p-4 transition-all" style={{ background: isThisWeek ? '#c9a84c10' : '#060c18', border: isThisWeek ? '2px solid #c9a84c' : '1px solid #1e2d4a' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: isThisWeek ? '#c9a84c' : '#1e2d4a', color: isThisWeek ? '#0a0f1e' : '#8a9bb8' }}>{entry.encounter}</span>
                {isThisWeek && <span className="text-[10px] font-bold text-[#c9a84c] bg-[#c9a84c]/15 px-2 py-0.5 rounded-full">هذا الأسبوع</span>}
              </div>
              <h3 className="font-bold text-white text-sm mb-1">{entry.topic}</h3>
              <p className="text-xs text-[#8a9bb8] mb-2">{entry.case}</p>
              <p className="text-[11px] text-[#4a5a78]">{formatDate(fridayDates[idx] || fridayDates[0])}</p>
            </div>
          );
        })}
      </div>

      {/* Section B — Requests */}
      <h2 className="text-lg font-bold text-[#c9a84c] mb-4">طلبات الحضور <span className="text-xs text-[#4a5a78] font-normal">({requests.length})</span></h2>
      {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

      {requests.length === 0 ? (
        <p className="text-center text-[#4a5a78] py-16 bg-[#060c18] border border-[#1e2d4a] rounded-lg">لا توجد طلبات حضور</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse"><thead><tr className="border-b border-[#1e2d4a] text-right"><th className="py-3 px-3 text-xs font-bold text-[#4a5a78]">الاسم</th><th className="py-3 px-3 text-xs font-bold text-[#4a5a78]">البريد</th><th className="py-3 px-3 text-xs font-bold text-[#4a5a78]">الجهة</th><th className="py-3 px-3 text-xs font-bold text-[#4a5a78]">الوقت المفضل</th><th className="py-3 px-3 text-xs font-bold text-[#4a5a78]">الحالة</th><th className="py-3 px-3 text-xs font-bold text-[#4a5a78]">التاريخ</th></tr></thead>
          <tbody>{requests.map(r => (
            <tr key={r.id} className="border-b border-[#1e2d4a]/50 hover:bg-[#c9a84c]/5">
              <td className="py-3 px-3 text-sm text-white">{r.name}</td>
              <td className="py-3 px-3 text-sm text-[#8a9bb8]" dir="ltr">{r.email}</td>
              <td className="py-3 px-3 text-sm text-[#8a9bb8]">{r.company || '—'}</td>
              <td className="py-3 px-3 text-sm text-[#8a9bb8]">{r.preferred_time || '—'}</td>
              <td className="py-3 px-3"><span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: `${MEETING_STATUS[r.status]?.color || '#64748b'}20`, color: MEETING_STATUS[r.status]?.color }}>{MEETING_STATUS[r.status]?.label || r.status}</span></td>
              <td className="py-3 px-3 text-xs text-[#8a9bb8]">{r.created_at ? new Date(r.created_at).toLocaleDateString('ar-SA') : '—'}</td>
            </tr>
          ))}</tbody></table>
        </div>
      )}
    </div>
  );
}
