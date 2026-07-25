'use client';

// Payment success — calls /api/paymob/fulfill to activate subscription, then redirects to dashboard

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fulfill = async () => {
      const tid = searchParams.get('id');
      const success = searchParams.get('success');
      const productId = localStorage.getItem('paymob_product_id');

      if (success === 'false') {
        router.push('/dashboard/payment-failed?message=' + encodeURIComponent('الدفع غير ناجح'));
        return;
      }

      try {
        const res = await fetch('/api/paymob/fulfill', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transactionId: tid, productId }),
        });

        if (res.ok) {
          localStorage.removeItem('paymob_product_id');
          setStatus('success');
          setTimeout(() => router.push('/dashboard/hub'), 2000);
        } else {
          const err = await res.json();
          if (err.error?.includes('already')) {
            setStatus('success');
            setTimeout(() => router.push('/dashboard/hub'), 2000);
          } else {
            setStatus('error');
            setMessage(err.error || 'فشل تفعيل الاشتراك');
          }
        }
      } catch {
        setStatus('error');
        setMessage('خطأ في الاتصال');
      }
    };
    fulfill();
  }, [searchParams, router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center" dir="rtl">
      <div className="text-center">
        {status === 'loading' && (
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c9a84c] mx-auto mb-4" />
        )}
        {status === 'success' && (
          <div className="w-16 h-16 bg-[#c9a84c]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#c9a84c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
        {status === 'error' && (
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )}
        <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          {status === 'loading' ? 'جاري تفعيل اشتراكك...' : status === 'success' ? 'تم الاشتراك بنجاح!' : 'حدث خطأ'}
        </h2>
        {message && <p className="text-red-400 mt-2">{message}</p>}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-[60vh]"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#c9a84c]" /></div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
