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

interface TeacherUser {
  id: string;
  email?: string | null;
}

export default function TeacherClient({ lessons: initialLessons }: { lessons: Lesson[] }) {
  const [user, setUser] = useState<TeacherUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [adminMode, setAdminMode] = useState(false);
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ title: '', icon: '', content: '' });
  const [editSaving, setEditSaving] = useState(false);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      setUser(u);
      if (u) {
        const admin = ADMIN_EMAILS.includes(u.email || '');
        setIsAdmin(admin);
        if (admin) {
          fetch('/api/admin/teacher?type=enrollments').then(r => r.json()).then(d => {
            if (d.enrollments) setEnrollments(d.enrollments);
          }).catch(() => {});
          fetch('/api/admin/teacher').then(r => r.json()).then(d => {
            if (d.lessons?.length) setLessons(d.lessons);
          }).catch(() => {});
        }
      }
      setLoading(false);
    });
  }, [supabase]);

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
        const r = await fetch('/api/admin/teacher');
        const d = await r.json();
        if (d.lessons?.length) setLessons(d.lessons);
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

  const printLesson = () => {
    if (!selectedDay) return;
    const lesson = lessons[selectedDay - 1];
    const w = window.open('', '_blank', 'width=800,height=600');
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><title>Vibe Coding بالعربي — اليوم ${lesson.day}</title>
<style>body{font-family:Tajawal,Cairo,sans-serif;direction:rtl;padding:40px;max-width:800px;margin:auto;color:#0a0f1e;line-height:1.9}
h1{color:#c9a84c;font-size:24px;margin-bottom:8px}h2{font-size:18px;margin-bottom:24px;color:#4a5b78}
pre{background:#0a0f1e;color:#a0aec0;padding:16px;border-radius:12px;overflow-x:auto;font-size:13px;direction:ltr;text-align:left}
code{background:#faf8f2;color:#c9a84c;padding:2px 6px;border-radius:4px;font-size:13px}
li{margin-right:16px}strong{color:#0a0f1e}@media print{body{padding:20px}}</style></head><body>
<h1>💻 Vibe Coding بالعربي — أكاديمية مرفأ</h1>
<h2>اليوم ${lesson.day}: ${lesson.title}</h2>
${formatMarkdown(lesson.content)}
<p style="margin-top:40px;color:#8a94a8;font-size:11px;border-top:1px solid #c9a84c33;padding-top:16px">marfa.sa/teacher | أكاديمية مرفأ</p>
</body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 500);
  };

  if (loading) {
    return <div className="animate-pulse space-y-4 pt-8">{[1,2,3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl" />)}</div>;
  }

  if (!user) {
    return (
      <div className="text-center py-20" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
        <div className="text-5xl mb-4">🔐</div>
        <h3 className="text-xl font-black text-[#0a0f1e] mb-2">دخول المدرّب فقط</h3>
        <p className="text-[#4a5b78] mb-6">هذه الصفحة مخصصة لمدرّب البرنامج. الرجاء تسجيل الدخول.</p>
        <button onClick={() => supabase.auth.signInWithOtp({ email: '' }).catch(() => {})} className="px-6 py-3 bg-[#c9a84c] text-[#0a0f1e] rounded-full font-bold">
          تسجيل الدخول
        </button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-20" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
        <div className="text-5xl mb-4">🚫</div>
        <h3 className="text-xl font-black text-[#0a0f1e] mb-2">غير مصرح</h3>
        <p className="text-[#4a5b78]">هذه الصفحة مخصصة لمدرّب البرنامج فقط.</p>
      </div>
    );
  }

  // Selected lesson view
  if (selectedDay !== null) {
    const lesson = lessons[selectedDay - 1];
    return (
      <div style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setSelectedDay(null)} className="text-[#c9a84c] font-bold text-sm hover:underline">← العودة للبرنامج</button>
          <button onClick={printLesson} className="px-4 py-2 bg-[#faf8f2] border border-[#c9a84c]/30 rounded-full text-[#c9a84c] text-sm font-bold hover:bg-[#c9a84c]/10 transition">
            🖨️ طباعة PDF
          </button>
        </div>

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
      </div>
    );
  }

  // Main view
  return (
    <div style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-1 rounded-full bg-[#faf8f2] border border-[#c9a84c]/30 text-[#c9a84c] text-xs font-bold mb-3">
          💻 Vibe Coding بالعربي
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-[#0a0f1e] mb-4">
          لوحة <span className="text-[#c9a84c]">المدرّب</span>
        </h1>
        <p className="text-[#64748b]">١٠ دروس — اضغط على أي درس لعرضه وطباعته</p>
      </div>

      {/* Lesson List */}
      <div className="space-y-3 mb-12">
        {lessons.map((l) => (
          <button
            key={l.day}
            onClick={() => setSelectedDay(l.day)}
            className="w-full text-start bg-white rounded-2xl p-5 border border-[#c9a84c]/20 hover:border-[#c9a84c]/40 shadow-[0_8px_30px_rgba(10,15,30,0.04)] transition"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">{l.icon}</span>
              <div className="flex-1">
                <span className="text-xs text-[#c9a84c] font-bold">اليوم {l.day}</span>
                <h3 className="font-bold text-[#0a0f1e]">{l.title}</h3>
              </div>
              <span className="text-[#c9a84c]">←</span>
            </div>
          </button>
        ))}
      </div>

      {/* Admin Panel */}
      <div className="border-t border-[#c9a84c]/20 pt-8">
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
                  <button key={l.day} onClick={() => openEditor(l.day)} className="w-full text-start p-3 rounded-xl border border-[#c9a84c]/10 hover:border-[#c9a84c]/30 transition text-sm">
                    <span className="text-[#c9a84c] font-bold">اليوم {l.day}:</span> {l.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

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
