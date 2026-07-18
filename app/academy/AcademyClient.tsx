'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Program {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  price: string;
  duration: string;
  level: string;
  audience: string;
  desc: string;
  cert?: string;
  featured?: boolean;
  badge?: string;
}

interface BankAccount {
  bank: string;
  iban: string;
  accountName: string;
}

export default function AcademyClient({ programs, bankAccount }: { programs: Program[]; bankAccount: BankAccount }) {
  const [modal, setModal] = useState<Program | null>(null);
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const openModal = (p: Program) => {
    if (p.badge === 'قريباً') return;
    setModal(p);
    setForm({ full_name: '', email: '', phone: '', notes: '' });
    setDone(false);
    setError('');
  };

  const submit = async () => {
    if (!form.full_name.trim()) { setError('الاسم مطلوب'); return; }
    setSubmitting(true);
    setError('');

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    try {
      const res = await fetch('/api/academy/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          program: modal!.id,
          full_name: form.full_name.trim(),
          email: form.email.trim() || user?.email || '',
          phone: form.phone.trim() || undefined,
          notes: form.notes.trim() || undefined,
        }),
        credentials: 'include',
      });

      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || 'فشل التسجيل');
      }

      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'حدث خطأ');
    }
    setSubmitting(false);
  };

  const programNames: Record<string, string> = {
    'vibe-coding': 'Vibe Coding',
    'medical-insurance': 'أساسيات التأمين الطبي في السعودية',
    'rcm-advanced': 'RCM المتقدمة',
    'entrepreneurship': 'أساسيات ريادة الأعمال',
    'ai-professionals': 'الذكاء الاصطناعي للمهنيين',
  };

  const programPrices: Record<string, string> = {
    'vibe-coding': '1,950',
    'medical-insurance': '4,750',
    'rcm-advanced': '',
    'entrepreneurship': '100',
    'ai-professionals': '1,000',
  };

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((p) => (
          <div
            key={p.id}
            className={`bg-white rounded-2xl border shadow-[0_8px_30px_rgba(10,15,30,0.04)] overflow-hidden flex flex-col ${
              p.featured ? 'border-[#c9a84c] ring-2 ring-[#c9a84c]/20' : 'border-[#c9a84c]/20'
            }`}
          >
            {p.featured && (
              <div className="bg-[#c9a84c] text-[#0a0f1e] text-xs font-black text-center py-1.5" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                ⭐ الأكثر طلباً
              </div>
            )}
            {p.badge && !p.featured && (
              <div className="bg-[#64748b] text-white text-xs font-bold text-center py-1.5" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                🔜 {p.badge}
              </div>
            )}
            <div className="p-6 flex-1 flex flex-col">
              <div className="text-4xl mb-3">{p.icon}</div>
              <h3 className="font-black text-[#0a0f1e] text-lg mb-1" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                {p.title}
              </h3>
              <p className="text-xs text-[#c9a84c] font-bold mb-3" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                {p.subtitle}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs px-2 py-1 rounded-full bg-[#fdf9ef] text-[#c9a84c] font-bold border border-[#c9a84c]/20">
                  {p.duration}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-[#faf8f2] text-[#4a5b78]">{p.level}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-[#faf8f2] text-[#4a5b78]">{p.audience}</span>
              </div>

              <p className="text-sm text-[#4a5b78] leading-relaxed mb-4 flex-1" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                {p.desc}
              </p>

              {p.cert && (
                <p className="text-xs text-[#c9a84c] font-bold mb-4" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                  🏅 {p.cert}
                </p>
              )}

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#c9a84c]/10">
                <span className="text-xl font-black text-[#0a0f1e]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                  {p.price}
                </span>
                <button
                  type="button"
                  onClick={() => openModal(p)}
                  disabled={p.badge === 'قريباً'}
                  className={`px-5 py-2.5 rounded-full font-bold text-sm transition ${
                    p.badge === 'قريباً'
                      ? 'bg-[#e2e8f0] text-[#94a3b8] cursor-not-allowed'
                      : 'bg-[#c9a84c] hover:bg-[#d4a843] text-[#0a0f1e]'
                  }`}
                >
                  {p.badge === 'قريباً' ? 'قريباً' : 'سجّل الآن'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enrollment Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setModal(null)}>
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-3xl">{modal.icon}</span>
                  <h2 className="text-xl font-black text-[#0a0f1e] mt-2">{modal.title}</h2>
                  <p className="text-[#c9a84c] font-bold">{programPrices[modal.id] ? `${programPrices[modal.id]} ر.س` : modal.price}</p>
                </div>
                <button onClick={() => setModal(null)} className="text-[#8a94a8] hover:text-[#0a0f1e] text-2xl">✕</button>
              </div>

              {done ? (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="text-lg font-black text-[#0a0f1e] mb-2">تم التسجيل بنجاح</h3>
                  <p className="text-[#4a5b78] mb-6">سنرسل لك تفاصيل البرنامج على بريدك الإلكتروني</p>
                  <div className="bg-[#fdf9ef] border border-[#c9a84c]/30 rounded-2xl p-4 mb-4 text-start">
                    <p className="text-sm font-bold text-[#c9a84c] mb-2">📋 معلومات الدفع</p>
                    <p className="text-sm text-[#4a5b78]"><strong>البنك:</strong> {bankAccount.bank}</p>
                    <p className="text-sm text-[#4a5b78]"><strong>الآيبان:</strong> {bankAccount.iban}</p>
                    <p className="text-sm text-[#4a5b78]"><strong>المستفيد:</strong> {bankAccount.accountName}</p>
                    <p className="text-sm text-[#4a5b78]"><strong>المبلغ:</strong> {programPrices[modal.id]} ر.س</p>
                  </div>
                  <button onClick={() => setModal(null)} className="px-6 py-3 bg-[#c9a84c] text-[#0a0f1e] rounded-full font-bold">
                    حسناً
                  </button>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm text-center">{error}</div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-[#0a0f1e] mb-1">الاسم الكامل *</label>
                      <input
                        type="text"
                        value={form.full_name}
                        onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                        className="w-full rounded-xl border border-[#c9a84c]/20 px-4 py-2.5 text-sm text-[#0a0f1e] outline-none focus:border-[#c9a84c] placeholder:text-[#8a94a8]"
                        placeholder="الاسم الرباعي"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#0a0f1e] mb-1">البريد الإلكتروني</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full rounded-xl border border-[#c9a84c]/20 px-4 py-2.5 text-sm text-[#0a0f1e] outline-none focus:border-[#c9a84c] placeholder:text-[#8a94a8]"
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#0a0f1e] mb-1">رقم الجوال</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full rounded-xl border border-[#c9a84c]/20 px-4 py-2.5 text-sm text-[#0a0f1e] outline-none focus:border-[#c9a84c] placeholder:text-[#8a94a8]"
                        placeholder="05xxxxxxxx"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#0a0f1e] mb-1">ملاحظات (اختياري)</label>
                      <textarea
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        rows={2}
                        className="w-full rounded-xl border border-[#c9a84c]/20 px-4 py-2.5 text-sm text-[#0a0f1e] outline-none focus:border-[#c9a84c] placeholder:text-[#8a94a8] resize-none"
                        placeholder="أي ملاحظات إضافية..."
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={submit}
                    disabled={submitting}
                    className="w-full mt-6 px-6 py-3 bg-[#c9a84c] hover:bg-[#d4a843] text-[#0a0f1e] rounded-full font-bold text-sm disabled:opacity-50 transition"
                  >
                    {submitting ? 'جاري التسجيل...' : 'تأكيد التسجيل'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
