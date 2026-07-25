'use client';

// Meeting subscription card — links to dashboard checkout for weekly meeting subscription
// بقيمة قهوة — 100 ريال / شهر

import Link from 'next/link';

const MEETING_PRODUCT_ID = 'f0848f83-ad00-4528-9936-b2a19f5e3ba2';

export default function MeetingSubscribeCard() {
  return (
    <section className="max-w-2xl mx-auto w-full mt-20 mb-12">
      <div className="bg-white rounded-3xl p-8 border border-[#c9a84c]/20 shadow-[0_8px_30px_rgba(10,15,30,0.06)] text-center" dir="rtl">
        <div className="text-5xl mb-4">☕</div>
        <h2 className="text-2xl font-black text-[#0a0f1e] mb-3" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          انضم للاجتماع الأسبوعي
        </h2>
        <p className="text-[#4a5b78] text-sm mb-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          اشتراك شهري لحضور اللقاءات الأسبوعية
        </p>
        <p className="text-[#c9a84c] font-black text-4xl mb-1" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          ١٠٠ ريال
        </p>
        <p className="text-[#8a94a8] text-xs mb-6">/ شهرياً — <strong className="text-[#c9a84c]">بقيمة قهوة</strong> واحدة فقط</p>

        <ul className="space-y-2 mb-8 text-right max-w-xs mx-auto">
          {['حضور الاجتماع الأسبوعي', 'نقاش مباشر مع الخبراء', 'فرصة للتواصل وبناء العلاقات', 'قيمة قهوة واحدة فقط'].map((f, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-[#4a5b78]">
              <svg className="w-5 h-5 text-[#c9a84c] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              {f}
            </li>
          ))}
        </ul>

        <Link
          href={`/dashboard/checkout/${MEETING_PRODUCT_ID}`}
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#c9a84c] text-[#0a0f1e] font-bold text-lg rounded-2xl hover:bg-[#d4a843] transition-colors shadow-lg shadow-[#c9a84c]/20"
        >
          ☕ اشترك الآن — ١٠٠ ريال/شهر
        </Link>

        <p className="text-xs text-[#8a94a8] mt-4" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          🔒 دفع آمن عبر Paymob — إلغاء في أي وقت
        </p>
      </div>
    </section>
  );
}
