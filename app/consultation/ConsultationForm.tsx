'use client';

import { useState, useMemo } from 'react';

// ── Availability rules ──
// Weekdays (Sun-Thu): 7 PM - 9 PM, 2 hours
// Weekends (Fri-Sat): 5 PM - 7 PM, 2 hours
const HOURS_PER_DAY = 2;
const WEEKDAY_START = 19; // 7 PM
const WEEKEND_START = 17; // 5 PM

function generateSlots(daysAhead = 14): { date: Date; label: string; slots: string[] }[] {
  const days: { date: Date; label: string; slots: string[] }[] = [];
  const now = new Date();

  for (let i = 1; i <= daysAhead; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    d.setHours(0, 0, 0, 0);

    const dayOfWeek = d.getDay(); // 0=Sun, 6=Sat in Saudi
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6; // Fri-Sat

    let startHour: number;
    let endHour: number;

    if (isWeekend) {
      startHour = WEEKEND_START;
      endHour = startHour + HOURS_PER_DAY; // 5 PM - 7 PM
    } else {
      startHour = WEEKDAY_START;
      endHour = startHour + HOURS_PER_DAY; // 7 PM - 9 PM
    }

    const slots: string[] = [];
    for (let h = startHour; h < endHour && slots.length < HOURS_PER_DAY; h++) {
      const start = `${h.toString().padStart(2, '0')}:00`;
      const end = `${(h + 1).toString().padStart(2, '0')}:00`;
      slots.push(`${start} - ${end}`);
    }

    if (slots.length > 0) {
      const months = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
      const weekdays = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
      const label = `${weekdays[dayOfWeek]} ${d.getDate()} ${months[d.getMonth()]}`;
      days.push({ date: d, label, slots });
    }
  }

  return days;
}

interface ConsultationFormProps {
  onBooked?: () => void;
}

export default function ConsultationForm({ onBooked }: ConsultationFormProps) {
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [paymentMode, setPaymentMode] = useState<'pay' | 'equity'>('pay');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [step, setStep] = useState<'form' | 'schedule' | 'confirm'>('form');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [error, setError] = useState('');

  const [processing, setProcessing] = useState(false);

  const isEquity = paymentMode === 'equity';
  const price = isEquity ? 0 : (isFirstTime ? 100 : 350);
  const minutes = 75;
  const freeMinutes = isFirstTime ? 15 : 0;
  const paidMinutes = minutes - freeMinutes;

  const days = useMemo(() => generateSlots(), []);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('الرجاء تعبئة جميع الحقول المطلوبة');
      return;
    }
    setStep('schedule');
  };

  const handleSelectSlot = (dayLabel: string, slot: string) => {
    setSelectedDay(dayLabel);
    setSelectedSlot(slot);
  };

  const handleConfirm = () => {
    if (!selectedSlot) {
      setError('الرجاء اختيار موعد');
      return;
    }
    setStep('confirm');
    onBooked?.();
  };

  const handlePay = async () => {
    setProcessing(true);
    setError('');

    // Equity mode: skip payment, notify admin directly
    if (isEquity) {
      try {
        const res = await fetch('/api/consultation/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name, email, phone, isFirstTime: true,
            price: 0, day: selectedDay, slot: selectedSlot, minutes,
            notes: `SAFE 3% EQUITY — ${notes}`,
          }),
        });
        if (res.ok) {
          localStorage.setItem('consultation_equity_booked', 'true');
          window.location.href = '/consultation?equity=success';
        } else {
          throw new Error('فشل إرسال الطلب');
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'حدث خطأ');
        setProcessing(false);
      }
      return;
    }

    // Payment mode: create Paymob intention
    localStorage.setItem('consultation_booking', JSON.stringify({
      name, email, phone, isFirstTime, price, day: selectedDay, slot: selectedSlot, minutes, notes,
    }));

    try {
      const res = await fetch('/api/paymob/consultation-intention', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: price, name, email, phone, day: selectedDay, slot: selectedSlot, minutes, notes, isFirstTime }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'فشل في إنشاء جلسة الدفع');
      if (data.client_secret) {
        const publicKey = process.env.NEXT_PUBLIC_PAYMOB_PUBLIC_KEY;
        window.location.href = `https://ksa.paymob.com/unifiedcheckout/?publicKey=${publicKey}&clientSecret=${data.client_secret}`;
      } else {
        throw new Error('Missing payment session');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في الدفع');
      setProcessing(false);
      localStorage.removeItem('consultation_booking');
    }
  };

  // ── Step 3: Confirmation + Payment ──
  if (step === 'confirm') {
    return (
      <div className="bg-white rounded-3xl p-8 border border-[#c9a84c]/30 shadow-[0_8px_30px_rgba(10,15,30,0.06)] text-center">
        <div className="text-5xl mb-4">{isEquity ? '🤝' : '💳'}</div>
        <h2 className="text-xl font-black text-[#0a0f1e] mb-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          {isEquity ? 'طلب حصة 3% — استشارات لا نهائية' : 'تأكيد الحجز والدفع'}
        </h2>
        <p className="text-[#4a5b78] text-sm mb-6" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          {isEquity
            ? '١٠ ساعات استشارة أسبوعياً مع فريق مرفأ. التسجيل بعد توقيع النسبة وتعديل عقد التأسيس.'
            : 'راجع تفاصيل حجزك ثم أكمل الدفع'}
        </p>

        {isEquity ? (
          <div className="bg-[#faf8f2] rounded-xl p-4 mb-6 text-right">
            <p className="text-sm text-[#4a5b78]"><strong>الباقة:</strong> استشارات لا نهائية</p>
            <p className="text-sm text-[#4a5b78]"><strong>المعدل:</strong> ١٠ ساعات أسبوعياً</p>
            <p className="text-sm text-[#4a5b78]"><strong>الفريق:</strong> فريق مرفأ</p>
            <p className="text-sm text-[#4a5b78]"><strong>الموعد الأول:</strong> {selectedDay} | {selectedSlot}</p>
            <p className="text-sm text-[#0a0f1e] font-bold mt-2"><strong>المقابل:</strong> 3% حصة (SAFE)</p>
          </div>
        ) : (
          <div className="bg-[#faf8f2] rounded-xl p-4 mb-6 text-right">
            <p className="text-sm text-[#4a5b78]"><strong>الموعد:</strong> {selectedDay} | {selectedSlot}</p>
            <p className="text-sm text-[#4a5b78]"><strong>المدة:</strong> {minutes} دقيقة ({paidMinutes} + {freeMinutes > 0 ? `${freeMinutes} مجانية` : ''})</p>
            <p className="text-sm text-[#4a5b78]"><strong>النوع:</strong> {isFirstTime ? 'أول مرة' : 'متابعة'}</p>
            <p className="text-sm text-[#0a0f1e] font-bold mt-2"><strong>الإجمالي:</strong> {price} ريال</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm mb-4">{error}</div>
        )}

        <button
          onClick={handlePay}
          disabled={processing}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#c9a84c] to-[#d4a843] text-[#0a0f1e] font-bold text-lg hover:shadow-xl hover:shadow-[#c9a84c]/30 transition-all duration-300 disabled:opacity-50"
          style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
        >
          {processing ? 'جاري الإرسال...' : (isEquity ? '🤝 قدّم طلب الحصة' : `🔒 ادفع الآن — ${price} ريال`)}
        </button>

        <p className="text-xs text-[#8a94a8] mt-4" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          {isEquity ? 'سيتم التواصل معك خلال 24 ساعة لإتمام الاتفاقية' : 'دفع آمن عبر Paymob — Apple Pay مدعوم'}
        </p>

        <button
          onClick={() => setStep('schedule')}
          className="mt-4 text-xs text-[#8a94a8] hover:text-[#0a0f1e] transition-colors"
          style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
        >
          ← تغيير الموعد
        </button>
      </div>
    );
  }

  // ── Step 2: Schedule picker ──
  if (step === 'schedule') {
    return (
      <div className="bg-white rounded-3xl p-8 border border-[#c9a84c]/20 shadow-[0_8px_30px_rgba(10,15,30,0.06)]">
        <div className="text-center mb-6">
          <h2 className="text-xl font-black text-[#0a0f1e] mb-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            اختر موعد الاستشارة
          </h2>
          <p className="text-[#4a5b78] text-sm" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            {isFirstTime ? `${paidMinutes} دقيقة + ${freeMinutes} دقيقة مجانية` : `${minutes} دقيقة`} — {price} ريال
          </p>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {days.map((day) => (
            <div key={day.label} className="border border-[#c9a84c]/15 rounded-xl p-4">
              <p className="text-sm font-bold text-[#0a0f1e] mb-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                {day.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {day.slots.map((slot) => {
                  const isSelected = selectedDay === day.label && selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      onClick={() => handleSelectSlot(day.label, slot)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        isSelected
                          ? 'bg-[#c9a84c] text-[#0a0f1e] shadow-lg shadow-[#c9a84c]/20'
                          : 'bg-[#faf8f2] text-[#4a5b78] border border-[#c9a84c]/15 hover:border-[#c9a84c]/40'
                      }`}
                      style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm text-center mt-4">
            {error}
          </div>
        )}

        <button
          onClick={handleConfirm}
          disabled={!selectedSlot}
          className="w-full mt-6 py-3.5 rounded-xl bg-gradient-to-r from-[#c9a84c] to-[#d4a843] text-[#0a0f1e] font-bold text-sm hover:shadow-lg hover:shadow-[#c9a84c]/20 transition-all duration-300 disabled:opacity-30"
          style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
        >
          {selectedSlot ? `تأكيد الموعد — ${selectedDay} ${selectedSlot}` : 'اختر موعداً من القائمة'}
        </button>

        <button
          onClick={() => setStep('form')}
          className="w-full mt-3 text-xs text-[#8a94a8] hover:text-[#0a0f1e] transition-colors"
          style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
        >
          ← تعديل المعلومات
        </button>
      </div>
    );
  }

  // ── Step 1: Info form ──
  return (
    <div className="bg-white rounded-3xl p-8 border border-[#c9a84c]/20 shadow-[0_8px_30px_rgba(10,15,30,0.06)]">
      <h2 className="text-xl font-black text-[#0a0f1e] text-center mb-6" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
        احجز استشارتك
      </h2>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { setIsFirstTime(true); setPaymentMode('pay'); }}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${isFirstTime && !isEquity ? 'bg-[#10b981] text-white' : 'bg-[#faf8f2] text-[#4a5b78] border border-[#c9a84c]/20'}`}
          style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
        >
          🎉 أول مرة — ١٠٠ ريال
        </button>
        <button
          onClick={() => { setIsFirstTime(false); setPaymentMode('pay'); }}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${!isFirstTime && !isEquity ? 'bg-[#c9a84c] text-[#0a0f1e]' : 'bg-[#faf8f2] text-[#4a5b78] border border-[#c9a84c]/20'}`}
          style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
        >
          🔁 متابعة — ٣٥٠ ريال
        </button>
      </div>

      {/* Payment Mode — Cash or Equity */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { setPaymentMode('pay'); setIsFirstTime(true); }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${paymentMode === 'pay' ? 'bg-[#faf8f2] text-[#0a0f1e] border-2 border-[#c9a84c]' : 'bg-[#faf8f2] text-[#8a94a8] border border-[#c9a84c]/10'}`}
        >
          💳 دفع نقدي — جلسة واحدة
        </button>
        <button
          onClick={() => setPaymentMode('equity')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${isEquity ? 'bg-[#c9a84c] text-[#0a0f1e] border-2 border-[#c9a84c]' : 'bg-[#faf8f2] text-[#8a94a8] border border-[#c9a84c]/10'}`}
        >
          🤝 مقابل حصة 3% — غير محدود
        </button>
      </div>

      {isEquity && (
        <div className="bg-[#c9a84c]/5 border border-[#c9a84c]/20 rounded-xl p-4 mb-6 text-center">
          <p className="text-sm text-[#0a0f1e] font-bold mb-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            🚀 استشارات لا نهائية — ١٠ ساعات أسبوعياً مع فريق مرفأ
          </p>
          <p className="text-xs text-[#4a5b78] leading-relaxed">
            التسجيل بعد اكتمال توقيع نسبة الـ 3٪ وتعديل عقد التأسيس
          </p>
        </div>
      )}

      <div className="text-center mb-6 bg-[#faf8f2] rounded-xl p-3">
        <p className="text-sm text-[#4a5b78]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          {paidMinutes} دقيقة استشارة
          {freeMinutes > 0 && <span className="text-[#c9a84c] font-bold"> + {freeMinutes} دقيقة مجانية</span>}
          {' = '}<strong className="text-[#0a0f1e]">{minutes} دقيقة</strong>
        </p>
      </div>

      <form onSubmit={handleContinue} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-[#0a0f1e] mb-1" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            الاسم الكامل *
          </label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required
            className="w-full px-4 py-3 rounded-xl border border-[#c9a84c]/20 bg-[#faf8f2] text-[#0a0f1e] text-sm focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]/30 transition-all"
            style={{ fontFamily: 'var(--font-tajawal), sans-serif' }} placeholder="الاسم الكامل" />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#0a0f1e] mb-1" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            البريد الإلكتروني *
          </label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
            className="w-full px-4 py-3 rounded-xl border border-[#c9a84c]/20 bg-[#faf8f2] text-[#0a0f1e] text-sm focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]/30 transition-all"
            style={{ fontFamily: 'var(--font-tajawal), sans-serif' }} placeholder="email@example.com" dir="ltr" />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#0a0f1e] mb-1" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            رقم الجوال *
          </label>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required
            className="w-full px-4 py-3 rounded-xl border border-[#c9a84c]/20 bg-[#faf8f2] text-[#0a0f1e] text-sm focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]/30 transition-all"
            style={{ fontFamily: 'var(--font-tajawal), sans-serif' }} placeholder="05xxxxxxxx" dir="ltr" />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#0a0f1e] mb-1" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            ملاحظات
          </label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
            className="w-full px-4 py-3 rounded-xl border border-[#c9a84c]/20 bg-[#faf8f2] text-[#0a0f1e] text-sm focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]/30 transition-all resize-none"
            style={{ fontFamily: 'var(--font-tajawal), sans-serif' }} placeholder="اكتب نبذة عن فكرتك..." />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm text-center">{error}</div>
        )}

        <button type="submit"
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#c9a84c] to-[#d4a843] text-[#0a0f1e] font-bold text-sm hover:shadow-lg hover:shadow-[#c9a84c]/20 transition-all duration-300"
          style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          متابعة لاختيار الموعد ←
        </button>

        <p className="text-center text-xs text-[#8a94a8]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          اختر الموعد المناسب لك
        </p>
      </form>
    </div>
  );
}
