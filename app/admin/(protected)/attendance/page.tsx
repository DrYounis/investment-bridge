'use client';

import { useState, useEffect, useCallback } from 'react';
import { TOTAL_MEETINGS, getThisFridayIndex } from '@/app/components/marfa/scheduleData';

interface Attendee {
  id: string;
  meeting_number: number;
  profile_id: string;
  attended_at: string;
  recorded_by: string | null;
  profiles?: { full_name?: string | null; student_number?: number | null } | null;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
}

export default function AdminAttendancePage() {
  const [meeting, setMeeting] = useState<number>(() =>
    Math.min(Math.max(getThisFridayIndex() + 1, 1), TOTAL_MEETINGS)
  );
  const [studentNumber, setStudentNumber] = useState('');
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = useCallback((type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    window.setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchAttendees = useCallback(async (m: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/attendance?meeting=${m}`);
      const json = await res.json();
      if (!res.ok) {
        showToast('error', json.error || 'تعذّر التحميل');
        setAttendees([]);
        return;
      }
      setAttendees(json.attendees || []);
    } catch {
      showToast('error', 'تعذّر التحميل');
      setAttendees([]);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchAttendees(meeting);
  }, [meeting, fetchAttendees]);

  const submit = async () => {
    const num = parseInt(studentNumber, 10);
    if (!Number.isInteger(num) || num < 1) {
      showToast('error', 'أدخل رقم طالب صحيح');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/admin/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meeting_number: meeting, student_number: num }),
      });
      const json = await res.json();
      if (!res.ok) {
        showToast('error', json.error || 'تعذّر التسجيل');
        return;
      }
      showToast('success', `تم تسجيل الحضور: ${json.full_name || `الطالب #${json.student_number}`}`);
      setStudentNumber('');
      await fetchAttendees(meeting);
    } catch {
      showToast('error', 'تعذّر التسجيل');
    } finally {
      setBusy(false);
    }
  };

  const undo = async (sn: number) => {
    setBusy(true);
    try {
      const res = await fetch('/api/admin/attendance', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meeting_number: meeting, student_number: sn }),
      });
      if (!res.ok) {
        const json = await res.json();
        showToast('error', json.error || 'تعذّر الإلغاء');
        return;
      }
      await fetchAttendees(meeting);
    } catch {
      showToast('error', 'تعذّر الإلغاء');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div dir="rtl" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white mb-2">✅ تسجيل الحضور</h1>
        <p className="text-[#8a9bb8] text-sm">سجّل حضور رواد الأعمال لكل لقاء برقم الطالب</p>
      </div>

      {toast && (
        <div className={`mb-4 p-3 rounded-lg border text-sm text-center ${toast.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {toast.text}
        </div>
      )}

      {/* Controls */}
      <div className="bg-[#0d1628] border border-[#1e2d4a] rounded-xl p-5 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="text-xs font-bold text-[#c9a84c] mb-2 block">اللقاء</label>
            <select
              value={meeting}
              onChange={(e) => setMeeting(parseInt(e.target.value, 10))}
              className="w-full bg-[#060c18] border border-[#1e2d4a] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#c9a84c]"
            >
              {Array.from({ length: TOTAL_MEETINGS }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>اللقاء {n}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="text-xs font-bold text-[#c9a84c] mb-2 block">رقم الطالب</label>
            <input
              type="number"
              inputMode="numeric"
              autoFocus
              value={studentNumber}
              onChange={(e) => setStudentNumber(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
              placeholder="أدخل رقم الطالب..."
              className="w-full bg-[#060c18] border border-[#1e2d4a] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#c9a84c] placeholder:text-[#4a5a78]"
            />
          </div>
          <button
            type="button"
            onClick={submit}
            disabled={busy}
            className="px-5 py-2.5 rounded-lg bg-[#c9a84c] hover:bg-[#d4a843] text-[#0a0f1e] font-bold text-sm disabled:opacity-40 transition whitespace-nowrap"
          >
            {busy ? 'جاري...' : 'تسجيل'}
          </button>
        </div>
      </div>

      {/* Attendees list */}
      <div className="bg-[#0d1628] border border-[#1e2d4a] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#1e2d4a] flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">الحاضرون</h2>
          <span className="text-xs font-bold text-[#c9a84c] bg-[#c9a84c]/10 px-2 py-1 rounded-full">
            عدد الحاضرين: {attendees.length}
          </span>
        </div>

        {loading ? (
          <div className="p-8 animate-pulse space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-12 bg-[#1a2540] rounded-lg" />)}
          </div>
        ) : attendees.length === 0 ? (
          <p className="text-center text-[#4a5a78] py-10 text-sm">لا يوجد حضور مسجّل لهذا اللقاء بعد</p>
        ) : (
          <ul className="divide-y divide-[#1e2d4a]/60">
            {attendees.map((a) => (
              <li key={a.id} className="flex items-center justify-between px-4 py-3 hover:bg-[#1a2540]/40">
                <div className="flex items-center gap-3">
                  <span className="text-[#c9a84c] font-bold text-sm w-10">#{a.profiles?.student_number ?? '—'}</span>
                  <div>
                    <p className="text-sm text-white font-bold">{a.profiles?.full_name || 'بدون اسم'}</p>
                    <p className="text-xs text-[#4a5a78]">{formatTime(a.attended_at)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => undo(a.profiles?.student_number ?? 0)}
                  disabled={busy || !a.profiles?.student_number}
                  className="text-xs text-[#8a9bb8] hover:text-red-400 border border-[#1e2d4a] rounded-lg px-2.5 py-1.5 hover:border-red-400/20 transition disabled:opacity-40"
                >
                  إلغاء
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
