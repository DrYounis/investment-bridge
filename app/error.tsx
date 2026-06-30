'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#0a0f1e', fontFamily: 'var(--font-tajawal), sans-serif' }}
      dir="rtl"
    >
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="text-2xl font-bold text-white mb-3">حدث خطأ غير متوقع</h1>
        <p className="text-[#a0aec0] mb-8 leading-relaxed">
          نأسف على هذا الخطأ. يرجى المحاولة مرة أخرى أو العودة إلى الصفحة الرئيسية.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-lg font-bold text-[#0a0f1e] transition-colors"
            style={{ background: '#c9a84c' }}
          >
            إعادة المحاولة
          </button>
          <Link
            href="/"
            className="px-6 py-3 rounded-lg font-bold border transition-colors"
            style={{ color: '#c9a84c', borderColor: '#c9a84c' }}
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
