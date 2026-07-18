'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Lesson } from './page';

const ADMIN_EMAILS = ['op.younis@gmail.com', '10.younis@gmail.com', 'mohamedy2003@gmail.com', 'remy.arbaoui@gmail.com'];

interface Enrollment {
  id: string;
  user_id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  status: string;
  created_at: string;
}

export default function TeacherClient({ lessons: initialLessons }: { lessons: Lesson[] }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', phone: '' });
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [enrollmentDate, setEnrollmentDate] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ title: '', icon: '', content: '' });
  const [editSaving, setEditSaving] = useState(false);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [adminLessons, setAdminLessons] = useState<Lesson[]>(initialLessons);
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      setUser(u);
      if (u) {
        const admin = ADMIN_EMAILS.includes(u.email || '');
        setIsAdmin(admin);
        if (admin) {
          // Fetch admin data
          fetch('/api/admin/teacher?type=enrollments').then(r => r.json()).then(d => {
            if (d.enrollments) setEnrollments(d.enrollments);
          }).catch(() => {});
          fetch('/api/admin/teacher').then(r => r.json()).then(d => {
            if (d.lessons?.length) { setAdminLessons(d.lessons); setLessons(d.lessons); }
          }).catch(() => {});
        }
        supabase.from('teacher_enrollments').select('created_at').eq('user_id', u.id).maybeSingle().then(({ data }) => {
          if (data) {
            setEnrolled(true);
            setEnrollmentDate(data.created_at);
          }
        });
      }
      setLoading(false);
    });
  }, [supabase]);

  const handleEnroll = async () => {
    if (!form.full_name.trim()) { setError('الاسم مطلوب'); return; }
    setEnrolling(true);
    setError('');
    try {
      const res = await fetch('/api/academy/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          program: 'teacher-vibe-coding',
          full_name: form.full_name.trim(),
          email: form.email.trim() || user?.email || '',
          phone: form.phone.trim() || undefined,
        }),
        credentials: 'include',
      });
      if (!res.ok) { const j = await res.json(); throw new Error(j.error || 'فشل التسجيل'); }
      setDone(true);
      setEnrolled(true);
      setEnrollmentDate(new Date().toISOString());
    } catch (e) { setError(e instanceof Error ? e.message : 'حدث خطأ'); }
    setEnrolling(false);
  };

  const saveLesson = async () => {
    if (!editingDay || !editForm.title.trim()) return;
    setEditSaving(true);
    try {
      const res = await fetch('/api/admin/teacher', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day: editingDay, ...editForm }),
        credentials: 'include',
      });
      if (res.ok) {
        // Refresh lessons
        const r = await fetch('/api/admin/teacher');
        const d = await r.json();
        if (d.lessons?.length) { setAdminLessons(d.lessons); setLessons(d.lessons); }
        setEditingDay(null);
      }
    } catch (e) { console.error(e); }
    setEditSaving(false);
  };

  const openEditor = (day: number) => {
    const lesson = lessons[day - 1];
    setEditingDay(day);
    setEditForm({ title: lesson.title, icon: lesson.icon, content: lesson.content });
  };

  const getUnlockedDays = () => {
    if (!enrollmentDate) return 0;
    const start = new Date(enrollmentDate);
    const now = new Date();
    const daysSinceStart = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const currentHour = now.getHours();
    // Day 1 unlocks immediately, then one lesson per day
    if (daysSinceStart < 0) return 0;
    // Each day at 6 AM, unlock the next lesson
    const unlockDay = currentHour >= 6 ? daysSinceStart + 1 : daysSinceStart;
    return Math.min(unlockDay, 10);
  };

  const unlockedDays = getUnlockedDays();

  if (loading) {
    return (
      <div className="animate-pulse space-y-4 pt-8">
        {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl" />)}
      </div>
    );
  }

  // Selected lesson view
  if (selectedDay !== null && enrolled) {
    const lesson = lessons[selectedDay - 1];
    const isUnlocked = selectedDay <= unlockedDays;
    return (
      <div style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
        <button onClick={() => setSelectedDay(null)} className="text-[#c9a84c] font-bold text-sm mb-6 hover:underline">
          ← العودة للبرنامج
        </button>

        {!isUnlocked ? (
          <div className="bg-white rounded-2xl p-8 border border-[#c9a84c]/20 text-center shadow-[0_8px_30px_rgba(10,15,30,0.04)]">
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="text-lg font-black text-[#0a0f1e] mb-2">هذا الدرس لم يُفتح بعد</h3>
            <p className="text-[#4a5b78]">سيُفتح الدرس {lesson.day - unlockedDays === 1 ? 'غداً' : `بعد ${lesson.day - unlockedDays} أيام`} الساعة ٦ صباحاً</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 border border-[#c9a84c]/20 shadow-[0_8px_30px_rgba(10,15,30,0.04)]">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">{lesson.icon}</span>
              <div>
                <span className="text-xs text-[#c9a84c] font-bold">اليوم {lesson.day}</span>
                <h2 className="text-xl font-black text-[#0a0f1e]">{lesson.title}</h2>
              </div>
            </div>
            <div className="prose prose-lg max-w-none text-[#4a5b78] leading-relaxed" dangerouslySetInnerHTML={{ __html: formatMarkdown(lesson.content) }} />
          </div>
        )}
      </div>
    );
  }

  // Main course view
  return (
    <div style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
      {/* Course Header */}
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-1 rounded-full bg-[#faf8f2] border border-[#c9a84c]/30 text-[#c9a84c] text-xs font-bold mb-3">
          💻 Vibe Coding بالعربي
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-[#0a0f1e] mb-4">
          تعلّم بناء التطبيقات <span className="text-[#c9a84c]">بالذكاء الاصطناعي</span>
        </h1>
        <p className="text-[#64748b] max-w-xl mx-auto">
          أسبوعين مكثفين — ١٠ دروس — من الصفر إلى تطبيقك الأول على الإنترنت
        </p>
      </div>

      {!enrolled ? (
        <div className="max-w-lg mx-auto">
          {/* Pricing Card */}
          <div className="bg-white rounded-2xl p-8 border-2 border-[#c9a84c] shadow-[0_8px_30px_rgba(10,15,30,0.06)] text-center mb-6">
            <div className="text-5xl mb-4">💻</div>
            <h2 className="text-2xl font-black text-[#0a0f1e] mb-2">Vibe Coding بالعربي</h2>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <span className="text-xs px-3 py-1 rounded-full bg-[#fdf9ef] text-[#c9a84c] font-bold border border-[#c9a84c]/20">أسبوعين مكثفين</span>
              <span className="text-xs px-3 py-1 rounded-full bg-[#faf8f2] text-[#4a5b78]">١٠ دروس</span>
              <span className="text-xs px-3 py-1 rounded-full bg-[#faf8f2] text-[#4a5b78]">بالعربي</span>
            </div>
            <p className="text-4xl font-black text-[#c9a84c] mb-4">1,950 ر.س</p>
            <p className="text-sm text-[#4a5b78] mb-6">يشمل كل الدروس + شهادة إتمام + مجتمع الخريجين</p>
            <button
              onClick={() => { if (!user) { supabase.auth.signInWithOtp({ email: '' }).catch(() => {}); alert('الرجاء تسجيل الدخول أولاً من الزر أعلى الصفحة'); return; } setModalOpen(true); }}
              className="w-full px-6 py-3.5 bg-[#c9a84c] hover:bg-[#d4a843] text-[#0a0f1e] rounded-full font-black text-lg transition"
            >
              سجّل الآن
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Progress Bar */}
          <div className="bg-white rounded-2xl p-6 border border-[#c9a84c]/20 shadow-[0_8px_30px_rgba(10,15,30,0.04)] mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-[#0a0f1e]">تقدمك</span>
              <span className="text-sm text-[#c9a84c] font-bold">{unlockedDays} / 10 دروس متاحة</span>
            </div>
            <div className="h-2 bg-[#faf8f2] rounded-full overflow-hidden">
              <div className="h-full bg-[#c9a84c] rounded-full transition-all duration-1000" style={{ width: `${(unlockedDays / 10) * 100}%` }} />
            </div>
            <p className="text-xs text-[#8a94a8] mt-2 text-center">
              {unlockedDays >= 10 ? '🎉 كل الدروس متاحة الآن!' : unlockedDays === 0 ? 'الدرس الأول يفتح غداً الساعة ٦ صباحاً' : `الدرس القادم يفتح ${unlockedDays < 10 ? 'غداً' : ''} الساعة ٦ صباحاً`}
            </p>
          </div>

          {/* Lesson List */}
          <div className="space-y-3">
            {lessons.map((l) => {
              const unlocked = l.day <= unlockedDays;
              return (
                <button
                  key={l.day}
                  onClick={() => unlocked && setSelectedDay(l.day)}
                  disabled={!unlocked}
                  className={`w-full text-start bg-white rounded-2xl p-5 border transition ${
                    unlocked
                      ? 'border-[#c9a84c]/20 hover:border-[#c9a84c]/40 shadow-[0_8px_30px_rgba(10,15,30,0.04)] cursor-pointer'
                      : 'border-[#c9a84c]/10 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{unlocked ? l.icon : '🔒'}</span>
                    <div className="flex-1">
                      <span className="text-xs text-[#c9a84c] font-bold">اليوم {l.day}</span>
                      <h3 className="font-bold text-[#0a0f1e]">{l.title}</h3>
                    </div>
                    {unlocked && <span className="text-[#c9a84c]">←</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Enrollment Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setModalOpen(false)}>
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
            onClick={e => e.stopPropagation()}
            dir="rtl"
            style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
          >
            <button onClick={() => setModalOpen(false)} className="float-start text-[#8a94a8] text-xl">✕</button>
            <h3 className="text-lg font-black text-[#0a0f1e] mb-4 text-center">تسجيل — Vibe Coding بالعربي</h3>
            {done ? (
              <div className="text-center py-6">
                <div className="text-5xl mb-4">✅</div>
                <h4 className="font-black text-[#0a0f1e] mb-2">تم التسجيل!</h4>
                <p className="text-[#4a5b78] text-sm mb-4">الدرس الأول يفتح غداً الساعة ٦ صباحاً</p>
                <div className="bg-[#fdf9ef] border border-[#c9a84c]/30 rounded-2xl p-4 mb-4 text-start">
                  <p className="text-sm font-bold text-[#c9a84c] mb-2">📋 الدفع</p>
                  <p className="text-xs text-[#4a5b78]">🏦 البنك السعودي الأول (SAB)</p>
                  <p className="text-xs text-[#4a5b78]">💳 SA57 4500 0000 1631 9938 3001</p>
                  <p className="text-xs text-[#4a5b78]">📋 شركة نظم الهندسة المبتكرة</p>
                  <p className="text-xs text-[#4a5b78] font-bold mt-1">المبلغ: 1,950 ر.س</p>
                </div>
                <button onClick={() => setModalOpen(false)} className="px-6 py-3 bg-[#c9a84c] text-[#0a0f1e] rounded-full font-bold">حسناً</button>
              </div>
            ) : (
              <>
                {error && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm text-center">{error}</div>}
                <div className="space-y-3">
                  <input type="text" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} placeholder="الاسم الكامل *" className="w-full rounded-xl border border-[#c9a84c]/20 px-4 py-2.5 text-sm outline-none focus:border-[#c9a84c]" />
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="البريد الإلكتروني" className="w-full rounded-xl border border-[#c9a84c]/20 px-4 py-2.5 text-sm outline-none focus:border-[#c9a84c]" />
                  <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="رقم الجوال" className="w-full rounded-xl border border-[#c9a84c]/20 px-4 py-2.5 text-sm outline-none focus:border-[#c9a84c]" />
                </div>
                <button onClick={handleEnroll} disabled={enrolling} className="w-full mt-4 px-6 py-3 bg-[#c9a84c] hover:bg-[#d4a843] text-[#0a0f1e] rounded-full font-bold disabled:opacity-50 transition">
                  {enrolling ? 'جاري التسجيل...' : 'تأكيد التسجيل'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Admin Panel */}
      {isAdmin && (
        <div className="mt-12 border-t border-[#c9a84c]/20 pt-8">
          <button
            onClick={() => { setAdminMode(!adminMode); if (!adminMode) { fetch('/api/admin/teacher?type=enrollments').then(r => r.json()).then(d => { if (d.enrollments) setEnrollments(d.enrollments); }).catch(() => {}); } }}
            className="text-sm font-bold text-[#c9a84c] hover:underline mb-4"
          >
            {adminMode ? '✕ إخفاء لوحة الإدارة' : '🔧 لوحة إدارة البرنامج'}
          </button>

          {adminMode && (
            <div className="space-y-6">
              {/* Enrollments */}
              <div className="bg-white rounded-2xl p-6 border border-[#c9a84c]/20">
                <h3 className="font-black text-[#0a0f1e] mb-4">📋 المسجلون ({enrollments.length})</h3>
                {enrollments.length === 0 ? (
                  <p className="text-sm text-[#8a94a8]">لا يوجد مسجلون بعد</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="border-b border-[#c9a84c]/10 text-[#8a94a8]"><td className="p-2 font-bold">الاسم</td><td className="p-2 font-bold">البريد</td><td className="p-2 font-bold">الجوال</td><td className="p-2 font-bold">تاريخ التسجيل</td></tr></thead>
                      <tbody>
                        {enrollments.map((e: Enrollment) => (
                          <tr key={e.id} className="border-b border-[#c9a84c]/5 text-[#4a5b78]">
                            <td className="p-2">{e.full_name}</td>
                            <td className="p-2" dir="ltr" style={{ textAlign: 'right' }}>{e.email}</td>
                            <td className="p-2" dir="ltr" style={{ textAlign: 'right' }}>{e.phone || '—'}</td>
                            <td className="p-2 text-xs">{new Date(e.created_at).toLocaleDateString('ar-SA')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Lesson Editor */}
              <div className="bg-white rounded-2xl p-6 border border-[#c9a84c]/20">
                <h3 className="font-black text-[#0a0f1e] mb-4">✏️ تعديل الدروس</h3>
                <div className="space-y-2">
                  {lessons.map((l) => (
                    <button
                      key={l.day}
                      onClick={() => openEditor(l.day)}
                      className="w-full text-start p-3 rounded-xl border border-[#c9a84c]/10 hover:border-[#c9a84c]/30 transition text-sm"
                    >
                      <span className="text-[#c9a84c] font-bold">اليوم {l.day}:</span> {l.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lesson Editor Modal */}
      {editingDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setEditingDay(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl" onClick={e => e.stopPropagation()} dir="rtl" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            <button onClick={() => setEditingDay(null)} className="float-start text-[#8a94a8] text-xl">✕</button>
            <h3 className="text-lg font-black text-[#0a0f1e] mb-4">تعديل — اليوم {editingDay}</h3>
            <div className="space-y-4">
              <input value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} placeholder="العنوان" className="w-full rounded-xl border border-[#c9a84c]/20 px-4 py-2.5 text-sm outline-none focus:border-[#c9a84c]" />
              <input value={editForm.icon} onChange={e => setEditForm({...editForm, icon: e.target.value})} placeholder="الأيقونة" className="w-full rounded-xl border border-[#c9a84c]/20 px-4 py-2.5 text-sm outline-none focus:border-[#c9a84c]" />
              <textarea value={editForm.content} onChange={e => setEditForm({...editForm, content: e.target.value})} rows={15} className="w-full rounded-xl border border-[#c9a84c]/20 px-4 py-2.5 text-sm outline-none focus:border-[#c9a84c] resize-none font-mono" dir="ltr" />
            </div>
            <button onClick={saveLesson} disabled={editSaving} className="w-full mt-4 px-6 py-3 bg-[#c9a84c] hover:bg-[#d4a843] text-[#0a0f1e] rounded-full font-bold text-sm disabled:opacity-50 transition">
              {editSaving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function formatMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-black text-[#0a0f1e] mt-6 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-black text-[#0a0f1e] mt-8 mb-4">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-black text-[#c9a84c] mt-8 mb-4">$1</h1>')
    .replace(/^- (.+)$/gm, '<li class="me-4 text-[#4a5b78]">$1</li>')
    .replace(/^\d\. (.+)$/gm, '<li class="me-4 text-[#4a5b78]">$1</li>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-[#0a0f1e]">$1</strong>')
    .replace(/✅/g, '<span class="text-green-600">✅</span>')
    .replace(/❌/g, '<span class="text-red-500">❌</span>')
    .replace(/🎉/g, '<span>🎉</span>')
    .replace(/`([^`]+)`/g, '<code class="bg-[#faf8f2] text-[#c9a84c] px-1.5 py-0.5 rounded text-sm">$1</code>')
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-[#0a0f1e] text-[#a0aec0] p-4 rounded-xl overflow-x-auto text-sm my-4" dir="ltr"><code>$2</code></pre>')
    .replace(/\n/g, '<br/>');
}
