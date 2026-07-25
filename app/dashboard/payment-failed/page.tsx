'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const msg = searchParams.get('message') || 'لم يتم إتمام عملية الدفع';

  return (
    <div className="min-h-[60vh] flex items-center justify-center" dir="rtl">
      <div className="text-center space-y-4 max-w-sm">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          فشل الدفع
        </h2>
        <p className="text-[#a0aec0]">{msg}</p>
        <p className="text-xs text-[#64748b]">لم يتم خصم أي مبلغ. يمكنك المحاولة مرة أخرى.</p>
        <div className="flex gap-3 justify-center pt-4">
          <Link
            href="/dashboard/plans"
            className="px-6 py-2.5 bg-[#c9a84c] text-[#0a0f1e] rounded-xl font-bold text-sm hover:bg-[#d4a843]"
          >
            المحاولة مرة أخرى
          </Link>
          <Link
            href="/dashboard/hub"
            className="px-6 py-2.5 bg-white/5 text-[#a0aec0] rounded-xl font-bold text-sm hover:bg-white/10 border border-white/10"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-[60vh]"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#c9a84c]" /></div>}>
      <PaymentFailedContent />
    </Suspense>
  );
}
