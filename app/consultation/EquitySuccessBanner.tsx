'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function EquityBannerInner() {
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (searchParams.get('equity') === 'success' && localStorage.getItem('consultation_equity_booked') === 'true') {
      queueMicrotask(() => setShow(true));
      localStorage.removeItem('consultation_equity_booked');
      window.history.replaceState({}, '', '/consultation');
    }
  }, [searchParams]);

  if (!show) return null;

  return (
    <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/30 rounded-2xl p-6 mb-8 text-center animate-fade-in-up" dir="rtl">
      <div className="text-4xl mb-3">🤝</div>
      <h3 className="text-lg font-black text-[#0a0f1e] mb-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
        تم استلام طلب الحصة بنجاح
      </h3>
      <p className="text-[#4a5b78] text-sm" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
        سيتواصل معك الفريق خلال 24 ساعة لمناقشة اتفاقية 3% وتعديل عقد التأسيس
      </p>
    </div>
  );
}

export default function EquitySuccessBanner() {
  return (
    <Suspense fallback={null}>
      <EquityBannerInner />
    </Suspense>
  );
}
