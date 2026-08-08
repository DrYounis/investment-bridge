'use client';

import { useState, useEffect } from 'react';

const GRADES = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'];
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

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
}

interface Evaluation {
  id: string;
  user_id: string;
  month: string;
  grade: string;
  notes: string | null;
  graded_by: string;
  created_at: string;
  profiles?: { full_name: string | null; email: string | null };
}

export default function AdminMonthlyPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [evaluations, setEvaluations] = useState<Record<string, Evaluation>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [grades, setGrades] = useState<Record<string, string>>({});
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [profilesRes, evalsRes] = await Promise.all([
        fetch('/api/admin/monthly-evaluations'),
        fetch(`/api/admin/monthly-evaluations?month=${selectedMonth}`),
      ]);

      const pJson = await profilesRes.json();
      if (pJson.profiles) setProfiles(pJson.profiles);

      const eJson = await evalsRes.json();
      if (eJson.evaluations) {
        const map: Record<string, Evaluation> = {};
        const gMap: Record<string, string> = {};
        const nMap: Record<string, string> = {};
        for (const e of eJson.evaluations) {
          map[e.user_id] = e;
          gMap[e.user_id] = e.grade;
          nMap[e.user_id] = e.notes || '';
        }
        setEvaluations(map);
        setGrades(gMap);
        setNotesMap(nMap);
      }
    } catch (err) {
      console.error('[admin-monthly] fetch', err);
      setError('تعذّر تحميل البيانات');
    }
    setLoading(false);
  };

  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    fetchData();
  }, [selectedMonth]);
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  const saveGrade = async (userId: string) => {
    const grade = grades[userId];
    if (!grade || saving[userId]) return;

    setSaving((prev) => ({ ...prev, [userId]: true }));

    try {
      const res = await fetch('/api/admin/monthly-evaluations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          month: selectedMonth,
          grade,
          notes: notesMap[userId] || '',
        }),
      });

      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('[admin-monthly] save', err);
    }
    setSaving((prev) => ({ ...prev, [userId]: false }));
  };

  // Filter out test and admin emails
  const studentProfiles = profiles.filter((p) => {
    const email = p.email || '';
    return !email.includes('test.com') && !email.includes('op.younis') && !email.includes('remy.arbaoui');
  });

  // Generate month options (June 2026 onward, up to current + 1)
  const months: string[] = [];
  for (let y = 2026; y <= new Date().getFullYear(); y++) {
    const startM = y === 2026 ? 6 : 1;
    const endM = y === new Date().getFullYear() ? new Date().getMonth() + 2 : 12;
    for (let m = startM; m <= endM; m++) {
      months.push(`${y}-${String(m).padStart(2, '0')}`);
    }
  }

  const monthLabel = (m: string) => {
    const [y, mo] = m.split('-');
    const names = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
    return `${names[parseInt(mo) - 1]} ${y}`;
  };

  if (loading) {
    return (
      <div className="space-y-3 animate-pulse" dir="rtl">
        {[1,2,3,4].map((i) => <div key={i} className="h-16 bg-[#1a2540] rounded-xl" />)}
      </div>
    );
  }

  return (
    <div dir="rtl" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white mb-2">📊 التقييم الشهري</h1>
        <p className="text-[#8a9bb8] text-sm">تقييم رواد الأعمال شهرياً — التقييم يظهر للمستخدم في نهاية الشهر</p>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">{error}</div>
      )}

      {/* Month selector */}
      <div className="mb-6">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="bg-[#060c18] border border-[#1e2d4a] rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-[#c9a84c]"
        >
          {months.map((m) => (
            <option key={m} value={m}>{monthLabel(m)}</option>
          ))}
        </select>
      </div>

      {studentProfiles.length === 0 ? (
        <p className="text-[#4a5a78] text-center py-8">لا يوجد رواد أعمال بعد</p>
      ) : (
        <div className="space-y-3">
          {studentProfiles.map((p) => {
            const eval_ = evaluations[p.id];
            const isGraded = !!eval_;
            const isSaving = saving[p.id];

            return (
              <div key={p.id} className="bg-[#0d1628] border border-[#1e2d4a] rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-white font-bold text-sm">{p.full_name || p.email?.split('@')[0]}</span>
                    <p className="text-[#4a5a78] text-xs">{p.email}</p>
                  </div>
                  {isGraded && (
                    <span className={`text-xs px-3 py-1 rounded-full border font-bold ${GRADE_COLORS[eval_.grade] || 'bg-[#1e2d4a] text-[#4a5a78]'}`}>
                      {eval_.grade}
                    </span>
                  )}
                </div>

                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <label className="text-xs text-[#4a5a78] block mb-1">الدرجة</label>
                    <select
                      value={grades[p.id] || ''}
                      onChange={(e) => setGrades((prev) => ({ ...prev, [p.id]: e.target.value }))}
                      className="w-full bg-[#060c18] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#c9a84c]"
                    >
                      <option value="">اختر...</option>
                      {GRADES.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-[2]">
                    <label className="text-xs text-[#4a5a78] block mb-1">ملاحظات (اختياري)</label>
                    <input
                      type="text"
                      value={notesMap[p.id] || ''}
                      onChange={(e) => setNotesMap((prev) => ({ ...prev, [p.id]: e.target.value }))}
                      placeholder="ملاحظة..."
                      className="w-full bg-[#060c18] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#c9a84c] placeholder:text-[#4a5a78]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => saveGrade(p.id)}
                    disabled={isSaving || !grades[p.id]}
                    className="px-4 py-2 rounded-lg bg-[#c9a84c] hover:bg-[#d4a843] text-[#0a0f1e] font-bold text-xs disabled:opacity-40 transition shrink-0"
                  >
                    {isSaving ? '...' : isGraded ? 'تحديث' : 'حفظ'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
