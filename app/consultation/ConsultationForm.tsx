'use client';

import { useState } from 'react';

export default function ConsultationForm() {
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const price = isFirstTime ? 20 : 100;
  const minutes = 75;
  const freeMinutes = isFirstTime ? 15 : 0;
  const paidMinutes = minutes - freeMinutes;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('الرجاء تعبئة جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/consultation/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          notes: notes.trim(),
          isFirstTime,
          price,
          durationMinutes: minutes,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'فشل في إرسال الطلب');
      }

      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'حدث خطأ — حاول مرة أخرى');
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-[#10b981]/30 shadow-[0_8px_30px_rgba(10,15,30,0.06)] text-center">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-xl font-black text-[#0a0f1e] mb-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          تم استلام طلبك!
        </h3>
        <p className="text-[#4a5b78] text-sm mb-4" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          سنتواصل معك خلال ٢٤ ساعة لتأكيد الموعد. بعد التأكيد، حوّل {price}$ إلى الحساب البنكي لتأكيد الحجز.
        </p>
        <div className="inline-block text-right bg-[#faf8f2] rounded-2xl p-4 border border-[#c9a84c]/20">
          <p className="text-xs text-[#4a5b78]" dir="ltr">IBAN: SA4745000000163199380001</p>
          <p className="text-xs text-[#4a5b78] mt-1">Saudi Awwal Bank — Mohamad Younis</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 border border-[#c9a84c]/20 shadow-[0_8px_30px_rgba(10,15,30,0.06)]">
      <h2 className="text-xl font-black text-[#0a0f1e] text-center mb-6" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
        احجز استشارتك
      </h2>

      {/* Session type toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setIsFirstTime(true)}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${isFirstTime ? 'bg-[#10b981] text-white' : 'bg-[#faf8f2] text-[#4a5b78] border border-[#c9a84c]/20'}`}
          style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
        >
          🎉 أول مرة — ${20}
        </button>
        <button
          onClick={() => setIsFirstTime(false)}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${!isFirstTime ? 'bg-[#c9a84c] text-[#0a0f1e]' : 'bg-[#faf8f2] text-[#4a5b78] border border-[#c9a84c]/20'}`}
          style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
        >
          🔁 متابعة — ${100}
        </button>
      </div>

      {/* Duration summary */}
      <div className="text-center mb-6 bg-[#faf8f2] rounded-xl p-3">
        <p className="text-sm text-[#4a5b78]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          {paidMinutes} دقيقة استشارة
          {freeMinutes > 0 && <span className="text-[#c9a84c] font-bold"> + {freeMinutes} دقيقة مجانية</span>}
          {' = '}<strong className="text-[#0a0f1e]">{minutes} دقيقة</strong>
          {' — '}<strong className="text-[#0a0f1e]">${price}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-[#0a0f1e] mb-1" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            الاسم الكامل *
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-[#c9a84c]/20 bg-[#faf8f2] text-[#0a0f1e] text-sm focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]/30 transition-all"
            style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
            placeholder="الاسم الكامل"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#0a0f1e] mb-1" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            البريد الإلكتروني *
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-[#c9a84c]/20 bg-[#faf8f2] text-[#0a0f1e] text-sm focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]/30 transition-all dir-ltr text-left"
            style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
            placeholder="email@example.com"
            dir="ltr"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#0a0f1e] mb-1" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            رقم الجوال *
          </label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-[#c9a84c]/20 bg-[#faf8f2] text-[#0a0f1e] text-sm focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]/30 transition-all dir-ltr text-left"
            style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
            placeholder="05xxxxxxxx"
            dir="ltr"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#0a0f1e] mb-1" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            ملاحظات أو تفاصيل عن فكرتك
          </label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-[#c9a84c]/20 bg-[#faf8f2] text-[#0a0f1e] text-sm focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]/30 transition-all resize-none"
            style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
            placeholder="اكتب نبذة عن فكرتك أو التحدي اللي تواجهه..."
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#c9a84c] to-[#d4a843] text-[#0a0f1e] font-bold text-sm hover:shadow-lg hover:shadow-[#c9a84c]/20 transition-all duration-300 disabled:opacity-50"
          style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
        >
          {loading ? 'جاري الإرسال...' : `احجز استشارتك — ${price}$`}
        </button>

        <p className="text-center text-xs text-[#8a94a8]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          بعد الإرسال، سنتواصل معك لتأكيد الموعد المناسب
        </p>
      </form>
    </div>
  );
}
