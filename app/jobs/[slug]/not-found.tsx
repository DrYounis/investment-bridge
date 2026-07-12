import Link from 'next/link';

export default function JobNotFound() {
  return (
    <div className="min-h-screen bg-[#faf8f2] flex items-center justify-center" dir="rtl">
      <div className="text-center px-6">
        <h1
          className="text-4xl font-black text-[#c9a84c] mb-4"
          style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
        >
          الوظيفة غير متاحة
        </h1>
        <p
          className="text-[#64748b] text-lg mb-8"
          style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
        >
          هذه الوظيفة لم تعد متاحة
        </p>
        <Link
          href="/jobs"
          className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-[#c9a84c] to-[#d4a843] text-[#0a0f1e] font-bold hover:shadow-lg hover:shadow-[#c9a84c]/25 transition-all"
          style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
        >
          جميع الوظائف ←
        </Link>
      </div>
    </div>
  );
}
