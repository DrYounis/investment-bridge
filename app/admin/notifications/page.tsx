'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const SUPER_ADMIN_EMAILS = ['op.younis@gmail.com', 'mohamedy2003@gmail.com'];
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL) {
  SUPER_ADMIN_EMAILS.push(process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL);
}

const DEFAULT_EMAILS = [
  'Ahmedabdelzaher1395@gmail.com',
  'jalalmohammed227@gmail.com',
  'Dr_kh6006@hotmail.com',
  'Mohamed.raslan56@yahoo.com',
  'Mohamedbioumy32@yahoo.com',
  'Aymanbounty@gmail.com',
];

export default function AdminNotificationsPage() {
  const [emails, setEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [results, setResults] = useState<{ email: string; status: string; error?: string }[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.email) {
        router.replace('/login?redirect=/admin/notifications');
        return;
      }
      setUserEmail(session.user.email);
      if (!SUPER_ADMIN_EMAILS.includes(session.user.email)) {
        setLoading(false);
        return;
      }
      // Load saved emails from localStorage
      const saved = localStorage.getItem('marfa_subscriber_emails');
      if (saved) {
        try { setEmails(JSON.parse(saved)); } catch { setEmails(DEFAULT_EMAILS); }
      } else {
        setEmails(DEFAULT_EMAILS);
      }
      setLoading(false);
    })();
  }, [supabase, router]);

  function saveEmails(list: string[]) {
    setEmails(list);
    localStorage.setItem('marfa_subscriber_emails', JSON.stringify(list));
  }

  function addEmail() {
    const email = newEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) return;
    if (emails.includes(email)) return;
    saveEmails([...emails, email]);
    setNewEmail('');
  }

  function removeEmail(email: string) {
    saveEmails(emails.filter(e => e !== email));
  }

  async function sendNotification() {
    if (emails.length === 0) return;
    setSending(true);
    setResults([]);

    const res = await fetch('/api/admin/send-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emails }),
    });

    const data = await res.json();
    setResults(data.results || []);
    setSending(false);
  }

  if (loading) return <div className="min-h-screen bg-[#faf8f2] flex items-center justify-center"><p className="text-[#4a5b78]">جاري التحميل...</p></div>;

  if (userEmail && !SUPER_ADMIN_EMAILS.includes(userEmail)) {
    return (
      <div className="min-h-screen bg-[#faf8f2] flex items-center justify-center" dir="rtl">
        <div className="bg-white border border-red-200 rounded-3xl p-12 text-center max-w-md shadow-lg">
          <p className="text-red-600 font-bold text-xl">⛔ غير مصرح</p>
          <p className="text-[#4a5b78] mt-4">هذه الصفحة مخصصة للمشرف العام فقط.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f2]" dir="rtl">
      <header className="bg-white border-b border-[#c9a84c]/20 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📧</span>
            <div>
              <h1 className="text-[#0a0f1e] font-bold text-lg">إدارة الإشعارات</h1>
              <p className="text-[#8a94a8] text-xs">إرسال إشعارات اللقاءات الأسبوعية</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#fdf9ef] border border-[#c9a84c]/30 text-[#c9a84c] text-xs font-bold">
            مشرف عام
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-8">

        {/* Add Email */}
        <div className="bg-white border border-[#c9a84c]/20 rounded-3xl p-6 shadow-[0_8px_30px_rgba(10,15,30,0.06)]">
          <h2 className="text-[#c9a84c] font-bold text-lg mb-4">➕ إضافة بريد إلكتروني</h2>
          <div className="flex gap-3">
            <input
              type="email"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addEmail()}
              placeholder="example@email.com"
              className="flex-1 rounded-xl border border-[#c9a84c]/30 px-4 py-3 text-[#0a0f1e] outline-none focus:border-[#c9a84c]"
            />
            <button
              onClick={addEmail}
              className="bg-[#c9a84c] hover:bg-[#d4a843] text-[#0a0f1e] font-bold px-6 py-3 rounded-full transition-colors"
            >
              إضافة
            </button>
          </div>
        </div>

        {/* Email List */}
        <div className="bg-white border border-[#c9a84c]/20 rounded-3xl p-6 shadow-[0_8px_30px_rgba(10,15,30,0.06)]">
          <h2 className="text-[#c9a84c] font-bold text-lg mb-4">
            📋 قائمة المشتركين ({emails.length})
          </h2>
          {emails.length === 0 ? (
            <p className="text-[#8a94a8] text-center py-8">لا توجد رسائل بريد إلكتروني بعد. أضف بريداً إلكترونياً للبدء.</p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {emails.map(email => (
                <div key={email} className="flex items-center justify-between bg-[#fdf9ef] rounded-xl px-4 py-3">
                  <span className="text-[#0a0f1e] text-sm">{email}</span>
                  <button
                    onClick={() => removeEmail(email)}
                    className="text-red-400 hover:text-red-600 text-sm font-bold transition-colors"
                  >
                    ✕ حذف
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Meeting Preview */}
        <div className="bg-white border border-[#c9a84c]/20 rounded-3xl p-6 shadow-[0_8px_30px_rgba(10,15,30,0.06)]">
          <h2 className="text-[#c9a84c] font-bold text-lg mb-4">📅 تفاصيل اللقاء القادم</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-[#8a94a8]">اللقاء:</span> <span className="text-[#0a0f1e] font-bold">اللقاء 3</span></div>
            <div><span className="text-[#8a94a8]">التاريخ:</span> <span className="text-[#0a0f1e] font-bold">الجمعة 3 يوليو 2026</span></div>
            <div><span className="text-[#8a94a8]">الوقت:</span> <span className="text-[#0a0f1e] font-bold">بعد صلاة الجمعة</span></div>
            <div><span className="text-[#8a94a8]">المكان:</span> <span className="text-[#0a0f1e] font-bold">ثمد كوفي</span></div>
            <div className="col-span-2"><span className="text-[#8a94a8]">الموضوع:</span> <span className="text-[#c9a84c] font-bold">المالية — حالة WeWork (الفشل المالي)</span></div>
          </div>
        </div>

        {/* Send Button */}
        <button
          onClick={sendNotification}
          disabled={sending || emails.length === 0}
          className="w-full bg-[#c9a84c] hover:bg-[#d4a843] disabled:opacity-50 disabled:cursor-not-allowed text-[#0a0f1e] font-bold py-4 rounded-full text-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {sending ? '⏳ جاري الإرسال...' : `📤 إرسال الإشعار إلى ${emails.length} مشترك`}
        </button>

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-white border border-[#c9a84c]/20 rounded-3xl p-6 shadow-[0_8px_30px_rgba(10,15,30,0.06)]">
            <h2 className="text-[#c9a84c] font-bold text-lg mb-4">📊 نتائج الإرسال</h2>
            <div className="space-y-2">
              {results.map((r, i) => (
                <div key={i} className={`flex items-center justify-between rounded-xl px-4 py-3 ${r.status === 'تم الإرسال' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  <span className="text-sm">{r.email}</span>
                  <span className="text-sm font-bold">{r.status === 'تم الإرسال' ? '✅ تم الإرسال' : `❌ ${r.error || 'فشل'}`}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
