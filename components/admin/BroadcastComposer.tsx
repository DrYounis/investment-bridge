'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Skeleton from '@/components/ui/Skeleton';

interface Recipient {
  id: string;
  email: string;
  full_name: string | null;
  role?: string;
}

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

  // Individual mode
  const [mode, setMode] = useState<'audience' | 'individual'>('audience');
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loadingRecipients, setLoadingRecipients] = useState(false);
  const [recipientSearch, setRecipientSearch] = useState('');

  // Custom email input
  const [customEmailInput, setCustomEmailInput] = useState('');
  const [customEmails, setCustomEmails] = useState<string[]>([]);

  // Super admin gate
  const SUPER_ADMIN = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL || 'mohamedy2003@gmail.com';

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/login'); return; }
      if (user.email !== SUPER_ADMIN) { router.push('/dashboard'); return; }
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
    if (authed && mode === 'audience') fetchCount();
    if (authed && mode === 'individual') fetchRecipients();
  }, [authed, fetchCount, mode]);

  // Fetch individual recipients list
  const fetchRecipients = useCallback(async () => {
    setLoadingRecipients(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id,email,full_name,role');
      if (!error && data) setRecipients(data as Recipient[]);
    } catch {
      setRecipients([]);
    }
    setLoadingRecipients(false);
  }, [supabase]);

  const toggleRecipient = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    const all = recipients.map((r) => r.id);
    setSelectedIds(new Set(all));
  };

  const deselectAll = () => {
    setSelectedIds(new Set());
  };

  const addCustomEmail = () => {
    const email = customEmailInput.trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    if (customEmails.includes(email)) return;
    setCustomEmails((prev) => [...prev, email]);
    setCustomEmailInput('');
  };

  const removeCustomEmail = (email: string) => {
    setCustomEmails((prev) => prev.filter((e) => e !== email));
  };

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) return;
    setSending(true);
    setError('');
    setResult(null);

    try {
      const payload: any = { title: title.trim(), body: body.trim(), audience, sendInApp, sendEmail };
      if (mode === 'individual') {
        payload.audience = 'individual';
        payload.recipientIds = Array.from(selectedIds);
        payload.customEmails = customEmails;
      }
      const res = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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

        {/* Mode toggle */}
        <div className="mb-5">
          <label className="block text-sm text-[#a0aec0] text-right mb-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            طريقة الإرسال
          </label>
          <div className="flex gap-3 justify-end mb-4">
            <button
              onClick={() => { setMode('audience'); setSelectedIds(new Set()); }}
              className="px-5 py-2 rounded-lg text-sm font-bold transition-all"
              style={{
                background: mode === 'audience' ? '#c9a84c' : 'transparent',
                color: mode === 'audience' ? '#0a0f1e' : '#a0aec0',
                border: mode === 'audience' ? '1px solid #c9a84c' : '1px solid #1a2540',
              }}
            >
              عام
            </button>
            <button
              onClick={() => { setMode('individual'); }}
              className="px-5 py-2 rounded-lg text-sm font-bold transition-all"
              style={{
                background: mode === 'individual' ? '#c9a84c' : 'transparent',
                color: mode === 'individual' ? '#0a0f1e' : '#a0aec0',
                border: mode === 'individual' ? '1px solid #c9a84c' : '1px solid #1a2540',
              }}
            >
              مخصص
            </button>
          </div>

          {mode === 'audience' ? (
            <>
              <label className="block text-sm text-[#a0aec0] text-right mb-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                الجمهور المستهدف
              </label>
              <div className="flex flex-wrap gap-3 justify-end">
                {([
                  { value: 'all', label: 'الكل' },
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

              {/* Recipient count */}
              <div className="mt-4 rounded-lg px-4 py-3 flex justify-between items-center border border-[#1a2540]" style={{ background: '#0a0f1e' }}>
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
            </>
          ) : (
            <>
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex gap-2">
                  <button
                    onClick={selectAll}
                    className="text-xs px-3 py-1 rounded border border-[#c9a84c]/30 text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-colors"
                    style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
                  >
                    تحديد الكل
                  </button>
                  <button
                    onClick={deselectAll}
                    className="text-xs px-3 py-1 rounded border border-[#1a2540] text-[#64748b] hover:bg-[#1a2540] transition-colors"
                    style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
                  >
                    إلغاء الكل
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#a0aec0]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                    سيصل الإشعار إلى
                  </span>
                  <span className="text-lg font-bold text-[#c9a84c]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                    {selectedIds.size} مستخدم
                  </span>
                </div>
              </div>

              <input
                type="text"
                value={recipientSearch}
                onChange={(e) => setRecipientSearch(e.target.value)}
                placeholder="بحث بالبريد أو الاسم..."
                className="w-full rounded-lg px-3 py-2 text-sm text-white text-right outline-none border border-[#1a2540] focus:border-[#c9a84c] mb-2"
                style={{ background: '#0a0f1e', fontFamily: 'var(--font-tajawal), sans-serif' }}
              />

              <div className="max-h-64 overflow-y-auto rounded-lg border border-[#1a2540]" style={{ background: '#0a0f1e' }}>
                {loadingRecipients ? (
                  <div className="p-4 space-y-2">
                    {new Array(4).fill(null).map((_, i) => (
                      <div key={i} className="animate-pulse h-8 rounded" style={{ background: '#1a2540' }} />
                    ))}
                  </div>
                ) : (
                  recipients
                    .filter((r) => {
                      if (!recipientSearch.trim()) return true;
                      const s = recipientSearch.toLowerCase();
                      return (r.email || '').toLowerCase().includes(s) || (r.full_name || '').toLowerCase().includes(s);
                    })
                    .map((r) => {
                      const isSelected = selectedIds.has(r.id);
                      return (
                        <label
                          key={r.id}
                          className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#c9a84c]/5 transition-colors border-b border-[#1a2540] last:border-b-0"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleRecipient(r.id)}
                            className="accent-[#c9a84c] shrink-0"
                          />
                          <div className="min-w-0 text-right flex-1">
                            <p className="text-sm text-white truncate" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                              {r.full_name || 'مستخدم'}
                            </p>
                            <p className="text-xs text-[#64748b] truncate">{r.email}</p>
                          </div>
                          {r.role && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[#c9a84c]/10 text-[#c9a84c] shrink-0">
                              {r.role === 'investor' ? 'مستثمر' : 'رائد أعمال'}
                            </span>
                          )}
                        </label>
                      );
                    })
                )}
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-sm text-[#a0aec0] text-right mb-1" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                إضافة بريد إلكتروني
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={customEmailInput}
                  onChange={(e) => setCustomEmailInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCustomEmail()}
                  placeholder="example@domain.com"
                  dir="ltr"
                  className="flex-1 rounded-lg px-3 py-2 text-sm text-white outline-none border border-[#1a2540] focus:border-[#c9a84c]"
                  style={{ background: '#0a0f1e', fontFamily: 'var(--font-tajawal), sans-serif' }}
                />
                <button
                  onClick={addCustomEmail}
                  className="shrink-0 px-4 py-2 rounded-lg text-sm font-bold transition-all"
                  style={{ background: '#c9a84c', color: '#0a0f1e' }}
                >
                  ➕ إضافة
                </button>
              </div>
              {customEmails.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {customEmails.map((email) => (
                    <span
                      key={email}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border"
                      style={{ background: '#c9a84c10', borderColor: '#c9a84c40', color: '#c9a84c' }}
                    >
                      {email}
                      <button onClick={() => removeCustomEmail(email)} className="hover:text-red-400 ml-1">
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </>
          )}
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
