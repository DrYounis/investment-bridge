import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#0a0f1e', fontFamily: 'var(--font-tajawal), sans-serif' }}
      dir="rtl"
    >
      <div className="text-center max-w-md">
        <div className="text-7xl mb-6 text-[#c9a84c] font-bold" style={{ letterSpacing: '-0.05em' }}>
          ٤٠٤
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">الصفحة غير موجودة</h1>
        <p className="text-[#a0aec0] mb-8 leading-relaxed">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-lg font-bold text-[#0a0f1e] transition-colors hover:opacity-90"
          style={{ background: '#c9a84c' }}
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
