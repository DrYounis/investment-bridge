'use client';

// Meeting subscription card — tiered membership picker
// Floor 100 SAR/month, preset amounts 100 / 500 / 5,000 + custom input

import { useState } from 'react';
import Link from 'next/link';
import { PRESET_AMOUNTS, CONTRIBUTION_FLOOR } from '@/lib/contributionTiers';

const MEETING_PRODUCT_ID = 'f0848f83-ad00-4528-9936-b2a19f5e3ba2';

export default function MeetingSubscribeCard() {
  const [amount, setAmount] = useState<number | null>(null);
  const [custom, setCustom] = useState('');

  const selectedAmount = amount ?? (custom ? parseInt(custom, 10) : null);
  const isValid = selectedAmount !== null && selectedAmount >= CONTRIBUTION_FLOOR && !isNaN(selectedAmount);
  const checkoutHref = isValid ? `/dashboard/checkout/${MEETING_PRODUCT_ID}?amount=${selectedAmount}` : '#';

  return (
    <section className="max-w-2xl mx-auto w-full mt-20 mb-12">
      <div className="bg-white rounded-3xl p-8 border border-[#c9a84c]/20 shadow-[0_8px_30px_rgba(10,15,30,0.06)] text-center" dir="rtl">
        <div className="text-5xl mb-4">📅</div>
        <h2 className="text-2xl font-black text-[#0a0f1e] mb-3" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          اختر باقة اشتراكك الشهري
        </h2>
        <p className="text-[#4a5b78] text-sm mb-6" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          اشتراك شهري لحضور لقاءات مرفأ — اختر المبلغ الذي يناسبك
        </p>

        {/* Preset buttons */}
        <div className="grid grid-cols-3 gap-3 mb-4 max-w-md mx-auto">
          {PRESET_AMOUNTS.map((n) => (
            <button
              key={n}
              onClick={() => { setAmount(n); setCustom(''); }}
              className={`py-4 rounded-2xl font-bold text-lg transition-all border-2 ${
                amount === n
                  ? 'bg-[#c9a84c] text-[#0a0f1e] border-[#c9a84c] shadow-lg shadow-[#c9a84c]/20'
                  : 'bg-white text-[#4a5b78] border-[#c9a84c]/20 hover:border-[#c9a84c]/50 hover:text-[#0a0f1e]'
              }`}
              style={n === 5000 ? { fontSize: '2rem', lineHeight: '2.5rem', fontWeight: 900 } : {}}
            >
              {n.toLocaleString('ar-SA')}
              <span className="block text-xs font-normal opacity-70">ريال/شهر</span>
            </button>
          ))}
        </div>

        {/* Custom amount */}
        <div className="flex items-center gap-3 max-w-xs mx-auto mb-6">
          <input
            type="number"
            min={CONTRIBUTION_FLOOR}
            placeholder={`أدخل مبلغاً (الحد الأدنى ${CONTRIBUTION_FLOOR} ريال)`}
            value={custom}
            onChange={(e) => { setCustom(e.target.value); setAmount(null); }}
            className="flex-1 rounded-xl border border-[#c9a84c]/20 px-4 py-3 text-sm text-[#0a0f1e] text-center outline-none focus:border-[#c9a84c] placeholder:text-[#8a94a8]"
          />
          <span className="text-sm text-[#8a94a8] shrink-0">ريال</span>
        </div>

        <ul className="space-y-2 mb-8 text-right max-w-xs mx-auto">
          {['حضور اللقاء الأسبوعي', 'نقاش مباشر مع الخبراء', 'فرصة للتواصل وبناء العلاقات', 'إلغاء في أي وقت'].map((f, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-[#4a5b78]">
              <svg className="w-5 h-5 text-[#c9a84c] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              {f}
            </li>
          ))}
        </ul>

        <Link
          href={checkoutHref}
          className={`inline-flex items-center gap-2 px-8 py-4 font-bold text-lg rounded-2xl transition-colors shadow-lg ${
            isValid
              ? 'bg-[#c9a84c] text-[#0a0f1e] hover:bg-[#d4a843] shadow-[#c9a84c]/20'
              : 'bg-[#e2e8f0] text-[#8a94a8] cursor-not-allowed shadow-none pointer-events-none'
          }`}
          aria-disabled={!isValid}
        >
          {isValid ? `اشترك الآن — ${selectedAmount!.toLocaleString('ar-SA')} ريال/شهر` : 'اختر مبلغ الاشتراك'}
        </Link>

        <p className="text-xs text-[#8a94a8] mt-4" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          🔒 دفع آمن عبر Paymob — إلغاء في أي وقت
        </p>
      </div>
    </section>
  );
}
