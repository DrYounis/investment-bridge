'use client';

// Consultation payment success — sends booking email and shows confirmation

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface BookingDetails {
  name?: string;
  email?: string;
  phone?: string;
  day?: string;
  slot?: string;
  minutes?: number;
  notes?: string;
  isFirstTime?: boolean;
  price?: number;
}

function ConsultationSuccessContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'sent' | 'error'>('loading');
  const [booking, setBooking] = useState<BookingDetails | null>(null);

  useEffect(() => {
    const fulfill = async () => {
      const urlSuccess = searchParams.get('success');
      if (urlSuccess === 'false') {
        setStatus('error');
        return;
      }

      // Read booking details from localStorage
      try {
        const raw = localStorage.getItem('consultation_booking');
        if (raw) {
          const details = JSON.parse(raw);
          setBooking(details);
          localStorage.removeItem('consultation_booking');

          // Send confirmation email to 10.younis@gmail.com
          const res = await fetch('/api/consultation/notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: details.name,
              email: details.email,
              phone: details.phone,
              isFirstTime: details.isFirstTime,
              price: details.price,
              day: details.day,
              slot: details.slot,
              minutes: details.minutes || 75,
              notes: details.notes || '',
            }),
          });

          if (res.ok) {
            setStatus('sent');
          } else {
            // Email failed but payment succeeded — still show success
            console.error('Notify email failed but payment OK');
            setStatus('sent');
          }
        } else {
          setStatus('sent'); // No localStorage but payment succeeded
        }
      } catch {
        setStatus('sent');
      }
    };
    fulfill();
  }, [searchParams]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#faf8f2]" dir="rtl">
      <div className="max-w-md mx-auto text-center px-6">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c9a84c] mx-auto mb-6" />
            <h2 className="text-xl font-bold text-[#0a0f1e] mb-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
              جاري تأكيد الحجز...
            </h2>
            <p className="text-[#8a94a8]">يرجى الانتظار</p>
          </>
        )}

        {status === 'sent' && (
          <>
            <div className="w-20 h-20 bg-[#c9a84c]/15 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-[#c9a84c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#0a0f1e] mb-3" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
              تم الحجز بنجاح! ✅
            </h2>
            <p className="text-[#4a5b78] mb-6 leading-relaxed">
              تم استلام حجزك وسيتم التواصل معك قريباً عبر الإيميل أو الواتساب لتأكيد موعد الاستشارة.
            </p>

            {booking && (
              <div className="bg-white border border-[#c9a84c]/20 rounded-2xl p-5 mb-6 text-right shadow-[0_8px_30px_rgba(10,15,30,0.04)]">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#8a94a8]">الاسم:</span>
                    <span className="text-[#0a0f1e] font-bold">{booking.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8a94a8]">الموعد:</span>
                    <span className="text-[#0a0f1e] font-bold">{booking.day} | {booking.slot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8a94a8]">النوع:</span>
                    <span className="text-[#0a0f1e]">{booking.isFirstTime ? 'أول مرة' : 'متابعة'}</span>
                  </div>
                </div>
              </div>
            )}

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#c9a84c] text-white rounded-xl font-bold text-sm hover:bg-[#d4a843] transition-colors"
            >
              العودة للرئيسية
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#0a0f1e] mb-2">فشل الدفع</h2>
            <p className="text-[#8a94a8] mb-6">لم يتم إتمام عملية الدفع. لم يتم خصم أي مبلغ.</p>
            <Link
              href="/consultation"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#c9a84c] text-white rounded-xl font-bold text-sm"
            >
              المحاولة مرة أخرى
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function ConsultationSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex items-center justify-center bg-[#faf8f2]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#c9a84c]" />
      </div>
    }>
      <ConsultationSuccessContent />
    </Suspense>
  );
}
