'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Skeleton from '@/components/ui/Skeleton';

export default function BroadcastComposer() {
  const router = useRouter();
  const supabase = createClient();

  const [authed, setAuthed] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState<'all' | 'investor' | 'entrepreneur'>('all');
  const [sendInApp, setSendInApp] = useState(true);
  const [sendEmail, setSendEmail] = useState(false);
  const [recipientCount, setRecipientCount] = useState<number | null>(null);
  const [loadingCount, setLoadingCount] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  // Super admin gate
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/login'); return; }
      if (user.email !== 'mohamedy2003@gmail.com') { router.push('/dashboard'); return; }
      setAuthed(true);
    });
  }, [supabase, router]);

  // Fetch recipient count on audience change
  const fetchCount = useCallback(async () => {
    setLoadingCount(true);
    setRecipientCount(null);
    try {
      let query = supabase.from('profiles').select('*', { count: 'exact', head: true });
      if (audience === 'investor') query = query.eq('role', 'investor');
      else if (audience === 'entrepreneur') query = query.eq('role', 'entrepreneur');
      const { count } = await query;
      setRecipientCount(count || 0);
    } catch {
      setRecipientCount(0);
    }
    setLoadingCount(false);
  }, [audience, supabase]);

  useEffect(() => {
    if (authed) fetchCount();
  }, [authed, fetchCount]);

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) return;
    setSending(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), body: body.trim(), audience, sendInApp, sendEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'حدث خطأ أثناء الإرسال');
      } else {
        setResult(data);
      }
    } catch {
      setError('فشل الاتصال بالخادم');
    }
    setSending(false);
  };

  const handleReset = () => {
    setTitle('');
    setBody('');
    setAudience('all');
    setSendInApp(true);
    setSendEmail(false);
    setResult(null);
    setError('');
  };

  if (!authed) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="marfa-skeleton h-8 w-40 rounded-lg" />
      </div>
    );
  }

  // Success state
  if (result) {
    return (
      <div dir="rtl" className="space-y-6">
        <div className="rounded-xl p-6 border flex flex-col gap-3" style={{ background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.3)' }}>
          <div className="flex items-center gap-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
              تم الإرسال بنجاح
            </span>
          </div>
          <p className="text-sm text-[#a0aec0]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            وصل الإشعار إلى {result.recipientCount} مستخدم — {result.inAppSent} داخل التطبيق، {result.emailSent} بريد إلكتروني
            {result.emailFailed > 0 && ` (فشل ${result.emailFailed} بريد)`}
          </p>
        </div>
        <button
          onClick={handleReset}
          className="px-6 py-3 rounded-lg text-sm border border-[#c9a84c]/40 text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-colors font-bold"
          style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
        >
          إرسال إشعار جديد
        </button>
      </div>
    );
  }

  return (
    <div dir="rtl" className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white text-right" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          إرسال إشعار جماعي
        </h1>
        <p className="text-[#a0aec0] text-right mt-1" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          أرسل رسالة للمستخدمين داخل التطبيق أو عبر البريد الإلكتروني
        </p>
      </div>

      {/* Composer card */}
      <div className="rounded-2xl p-8 border border-[#c9a84c]/30" style={{ background: '#0d1628' }}>
        {/* Title */}
        <div className="mb-5">
          <label className="block text-sm text-[#a0aec0] text-right mb-1" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            عنوان الرسالة
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مثال: تحديث مهم من فريق مرفأ"
            className="w-full rounded-lg px-4 py-3 text-white text-right outline-none transition-colors border border-[#1a2540] focus:border-[#c9a84c]"
            style={{ background: '#0a0f1e', fontFamily: 'var(--font-tajawal), sans-serif' }}
          />
        </div>

        {/* Body */}
        <div className="mb-6">
          <label className="block text-sm text-[#a0aec0] text-right mb-1" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            نص الرسالة
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="اكتب تفاصيل الإشعار هنا..."
            rows={5}
            className="w-full rounded-lg px-4 py-3 text-white text-right outline-none transition-colors border border-[#1a2540] focus:border-[#c9a84c] resize-none"
            style={{ background: '#0a0f1e', minHeight: 140, fontFamily: 'var(--font-tajawal), sans-serif' }}
          />
        </div>

        {/* Audience selector */}
        <div className="mb-5">
          <label className="block text-sm text-[#a0aec0] text-right mb-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            الجمهور المستهدف
          </label>
          <div className="flex gap-3 justify-end">
            {([
              { value: 'all', label: 'الكل' },
              { value: 'investor', label: 'المستثمرون' },
              { value: 'entrepreneur', label: 'رواد الأعمال' },
            ] as const).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setAudience(opt.value)}
                className="px-5 py-2 rounded-lg text-sm font-bold transition-all duration-150"
                style={{
                  fontFamily: 'var(--font-tajawal), sans-serif',
                  background: audience === opt.value ? '#c9a84c' : 'transparent',
                  color: audience === opt.value ? '#0a0f1e' : '#a0aec0',
                  border: audience === opt.value ? '1px solid #c9a84c' : '1px solid #1a2540',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recipient count */}
        <div className="mb-6">
          <div className="rounded-lg px-4 py-3 flex justify-between items-center border border-[#1a2540]" style={{ background: '#0a0f1e' }}>
            <span className="text-sm text-[#a0aec0]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
              سيصل الإشعار إلى
            </span>
            {loadingCount ? (
              <Skeleton width="80px" height="28px" />
            ) : (
              <span className="text-lg font-bold text-[#c9a84c]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                {recipientCount} مستخدم
              </span>
            )}
          </div>
        </div>

        {/* Delivery toggles */}
        <div className="mb-6 space-y-4">
          <label className="block text-sm text-[#a0aec0] text-right mb-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            قنوات الإرسال
          </label>

          {/* In-app toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSendInApp(!sendInApp)}
              className={`w-11 h-6 rounded-full transition-colors duration-200 relative ${sendInApp ? 'bg-[#c9a84c]' : 'bg-[#1a2540]'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${sendInApp ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
            <div className="text-right">
              <p className="text-white text-sm" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                إشعار داخل التطبيق
              </p>
              <p className="text-[#64748b] text-xs" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                يظهر فوراً في جرس الإشعارات
              </p>
            </div>
          </div>

          {/* Email toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSendEmail(!sendEmail)}
              className={`w-11 h-6 rounded-full transition-colors duration-200 relative ${sendEmail ? 'bg-[#c9a84c]' : 'bg-[#1a2540]'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${sendEmail ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
            <div className="text-right">
              <p className="text-white text-sm" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                بريد إلكتروني عبر Resend
              </p>
              <p className="text-[#64748b] text-xs" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                يُرسل إلى بريد كل مستخدم مستهدف
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl p-4 mb-6 border flex items-center gap-3" style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.3)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            <span className="text-sm text-white" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
              {error}
            </span>
          </div>
        )}

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={sending || !title.trim() || !body.trim()}
          className="w-full h-[52px] rounded-lg text-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: sending ? '#b8953a' : '#c9a84c',
            color: '#0a0f1e',
            fontFamily: 'var(--font-tajawal), sans-serif',
          }}
        >
          {sending ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="20 60" />
              </svg>
              جارٍ الإرسال...
            </>
          ) : (
            'إرسال الإشعار'
          )}
        </button>
      </div>
    </div>
  );
}
