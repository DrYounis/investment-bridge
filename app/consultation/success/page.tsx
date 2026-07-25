import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'تم الدفع — استشارتك مؤكدة | مرفأ',
  description: 'تم تأكيد حجز استشارتك. تواصل مع د. محمد يونس مباشرة عبر واتساب.',
};

export default function ConsultationSuccessPage() {
  return (
    <main className="min-h-screen bg-[#faf8f2] flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center border border-[#c9a84c]/20 shadow-[0_8px_30px_rgba(10,15,30,0.06)]">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-black text-[#0a0f1e] mb-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          تم تأكيد استشارتك!
        </h1>
        <p className="text-[#4a5b78] text-sm mb-8 leading-relaxed" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          شكراً لك. استشارتك محجوزة — تواصل مع د. محمد يونس مباشرة الآن عبر واتساب لتحديد الموعد.
        </p>

        <a
          href="https://wa.me/966555056545?text=السلام عليكم د. محمد، تم حجز استشارة عبر موقع مرفأ وأرغب في تحديد الموعد."
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-4 rounded-2xl bg-[#25D366] text-white font-bold text-lg mb-3 hover:bg-[#1ebe5d] transition-colors shadow-lg shadow-[#25D366]/20"
          style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
        >
          💬 تواصل عبر واتساب الآن
        </a>

        <p className="text-xs text-[#8a94a8] mt-4" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          أو أرسل رسالة إلى: +966 55 505 6545
        </p>

        <div className="mt-8 pt-6 border-t border-[#c9a84c]/20">
          <p className="text-xs text-[#8a94a8]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            سنرسل لك أيضاً إيميل تأكيد بكل التفاصيل
          </p>
        </div>

        <Link
          href="/consultation"
          className="inline-block mt-4 text-xs text-[#c9a84c] hover:text-[#d4a843] transition-colors"
          style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
        >
          ← العودة لصفحة الاستشارات
        </Link>
      </div>
    </main>
  );
}
