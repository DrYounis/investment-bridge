'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

const GRADE_COLORS: Record<string, string> = {
  'A+': 'bg-green-500/20 text-green-400 border-green-500/30',
  'A': 'bg-green-500/15 text-green-400 border-green-500/20',
  'B+': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  'B': 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  'C+': 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  'C': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'D': 'bg-red-500/10 text-red-400 border-red-500/20',
  'F': 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function MonthlyGrade({ userId }: { userId: string }) {
  const [grade, setGrade] = useState<string | null>(null);
  const [notes, setNotes] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const isLastDay = (() => {
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return now.getDate() === last.getDate();
  })();

  useEffect(() => {
    const supabase = createClient();

    supabase
      .from('monthly_evaluations')
      .select('grade, notes')
      .eq('user_id', userId)
      .eq('month', currentMonth)
      .maybeSingle()
      .then(({ data, error: err }) => {
        if (err) {
          setError('تعذّر تحميل التقييم');
        } else if (data) {
          setGrade(data.grade);
          setNotes(data.notes);
        }
        setLoading(false);
      });
  }, [userId, currentMonth]);

  if (loading) {
    return (
      <div className="bg-[#0d1628] border border-[#1e2d4a] rounded-2xl p-6 animate-pulse" dir="rtl">
        <div className="h-4 bg-[#1a2540] rounded w-1/3 mb-3" />
        <div className="h-8 bg-[#1a2540] rounded w-1/2" />
      </div>
    );
  }

  if (error) return null;

  if (!grade && !isLastDay) {
    return (
      <div className="bg-[#0d1628] border border-[#1e2d4a] rounded-2xl p-6 text-center" dir="rtl" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
        <div className="text-3xl mb-3">🔒</div>
        <h3 className="text-white font-bold text-sm mb-1">تقييمك الشهري</h3>
        <p className="text-[#4a5a78] text-xs">سيظهر تقييمك من المجلس الاستشاري في نهاية الشهر</p>
      </div>
    );
  }

  if (!grade && isLastDay) {
    return (
      <div className="bg-[#0d1628] border border-[#1e2d4a] rounded-2xl p-6 text-center" dir="rtl" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
        <div className="text-3xl mb-3">⏳</div>
        <h3 className="text-white font-bold text-sm mb-1">التقييم قيد المراجعة</h3>
        <p className="text-[#4a5a78] text-xs">لم يصدر تقييمك بعد — يرجى المتابعة لاحقاً</p>
      </div>
    );
  }

  // Grade is visible (past month or last day with grade)
  return (
    <div className="bg-[#0d1628] border border-[#1e2d4a] rounded-2xl p-6" dir="rtl" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
      <h3 className="text-sm font-bold text-[#c9a84c] mb-3 text-center">🏛️ تقييمك من المجلس الاستشاري</h3>
      <div className="text-center mb-3">
        <span className={`inline-block text-2xl font-black px-6 py-2 rounded-full border-2 ${GRADE_COLORS[grade!] || 'bg-[#1e2d4a] text-[#4a5a78]'}`}>
          {grade}
        </span>
      </div>
      {notes && (
        <p className="text-[#8a9bb8] text-xs text-center leading-relaxed">{notes}</p>
      )}
      <p className="text-[#4a5a78] text-[10px] text-center mt-3">{currentMonth}</p>
    </div>
  );
}
