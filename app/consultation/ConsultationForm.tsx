'use client';

import { useState, useMemo } from 'react';

const WHATSAPP_NUMBER = '966555056545';

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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [step, setStep] = useState<'form' | 'schedule' | 'confirm'>('form');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [error, setError] = useState('');

  const price = isFirstTime ? 20 : 100;
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

  const waMsg = encodeURIComponent(
    `السلام عليكم أستاذ أحمد،\n\nحجز استشارة جديد:\n- الاسم: ${name}\n- الإيميل: ${email}\n- الجوال: ${phone}\n- النوع: ${isFirstTime ? 'أول مرة' : 'متابعة'}\n- السعر: ${price}$\n- الموعد: ${selectedDay} | ${selectedSlot}\n${notes ? `- ملاحظات: ${notes}\n` : ''}\nمستعد للدفع — أرسل طريقة الدفع من فضلك.`
  );

  // ── Step 3: Confirmation ──
  if (step === 'confirm') {
    return (
      <div className="bg-white rounded-3xl p-8 border border-[#10b981]/30 shadow-[0_8px_30px_rgba(10,15,30,0.06)] text-center">
        <div className="text-5xl mb-4">📅</div>
        <h2 className="text-xl font-black text-[#0a0f1e] mb-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          تم اختيار الموعد — أكمل الدفع
        </h2>

        <div className="bg-[#faf8f2] rounded-xl p-4 mb-6 text-right">
          <p className="text-sm text-[#4a5b78]"><strong>الموعد:</strong> {selectedDay} | {selectedSlot}</p>
          <p className="text-sm text-[#4a5b78]"><strong>المدة:</strong> {minutes} دقيقة ({paidMinutes} + {freeMinutes > 0 ? `${freeMinutes} مجانية` : ''})</p>
          <p className="text-sm text-[#4a5b78]"><strong>السعر:</strong> {price}$</p>
        </div>

        <p className="text-[#4a5b78] text-sm mb-6" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          أرسل هذه الرسالة للمهندس أحمد لإتمام الحجز والدفع:
        </p>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-4 rounded-2xl bg-[#25D366] text-white font-bold text-lg hover:bg-[#1ebe5d] transition-colors shadow-lg shadow-[#25D366]/20"
          style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
        >
          💬 أكمل الحجز عبر واتساب
        </a>

        <p className="text-xs text-[#8a94a8] mt-4" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          سيتم تأكيد موعدك بعد إتمام الدفع
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
            {isFirstTime ? `${paidMinutes} دقيقة + ${freeMinutes} دقيقة مجانية` : `${minutes} دقيقة`} — {price}$
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
