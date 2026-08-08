'use client';

// Checkout page — order summary + Apple Pay / Card buttons
// Creates Paymob intention then redirects to Paymob Unified Checkout

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';
import { CONTRIBUTION_FLOOR } from '@/lib/contributionTiers';

const MEETING_PRODUCT_ID = 'f0848f83-ad00-4528-9936-b2a19f5e3ba2';

export default function CheckoutPage() {
  const { productId } = useParams<{ productId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const { showToast } = useToast();
  const [product, setProduct] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const amountParam = searchParams.get('amount');
  const customAmount = amountParam ? parseInt(amountParam, 10) : null;
  const isMeetingProduct = productId === MEETING_PRODUCT_ID;

  useEffect(() => {
    if (!productId) return;
    const fetchProduct = async () => {
      const { data, error } = await supabase.from('products').select('*').eq('id', productId).single();
      if (error) { showToast('الخطة غير موجودة', 'error'); router.push('/dashboard/plans'); }
      else setProduct(data);
      setLoading(false);
    };
    fetchProduct();
  }, [productId, router, supabase]);

  const handlePayment = async (applePay = false) => {
    setProcessing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { showToast('يرجى تسجيل الدخول أولاً', 'warning'); router.push('/login'); return; }

      const effectivePrice = isMeetingProduct && customAmount && customAmount >= CONTRIBUTION_FLOOR
        ? customAmount
        : (product ? (product as Record<string, number>).price : 0);

      const res = await fetch('/api/paymob/intention', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          price: effectivePrice,
          name: product ? (product as Record<string, string>).name : '',
          applePay,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to initialize payment');
      if (data.client_secret) {
        localStorage.setItem('paymob_product_id', String(productId));
        const publicKey = process.env.NEXT_PUBLIC_PAYMOB_PUBLIC_KEY;
        window.location.href = `https://ksa.paymob.com/unifiedcheckout/?publicKey=${publicKey}&clientSecret=${data.client_secret}`;
      } else {
        throw new Error('Missing client_secret');
      }
    } catch (error: unknown) {
      showToast(error instanceof Error ? error.message : 'خطأ في الدفع', 'error');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#c9a84c]" />
    </div>
  );
  if (!product) return null;

  const p = product as Record<string, unknown>;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4" dir="rtl">
      <div className="bg-gradient-to-br from-[#0d1628] to-[#0a0f1e] border border-[#c9a84c]/20 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white text-center mb-8" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          إتمام الاشتراك
        </h1>

        <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-8">
          <h2 className="text-xl font-semibold text-[#a0aec0] mb-4 border-b border-white/10 pb-2">
            ملخص الطلب
          </h2>
          <div className="flex justify-between mb-2">
            <span className="text-[#64748b]">الباقة:</span>
            <span className="text-white font-bold text-lg">{String(p.name)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-[#64748b]">المدة:</span>
            <span className="text-white">{p.interval === 'year' ? 'سنوي' : 'شهري'}</span>
          </div>
          <div className="flex justify-between mt-6 pt-4 border-t border-white/10">
            <span className="text-[#a0aec0] font-bold">الإجمالي:</span>
            <span className="text-[#c9a84c] font-bold text-2xl">
              {isMeetingProduct && customAmount && customAmount >= CONTRIBUTION_FLOOR
                ? `${customAmount.toLocaleString('ar-SA')} ريال`
                : `${String(p.price)} ${String(p.currency)}`}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Apple Pay */}
            <button
              onClick={() => handlePayment(true)}
              disabled={processing}
              className="bg-black hover:bg-neutral-900 text-white font-bold py-4 rounded-xl transition-all border border-white/20 hover:border-white/40 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {processing ? '...' : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  Pay
                </>
              )}
            </button>
            {/* Card */}
            <button
              onClick={() => handlePayment(false)}
              disabled={processing}
              className="bg-[#c9a84c] hover:bg-[#d4a843] text-[#0a0f1e] font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-[#c9a84c]/30 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {processing ? '...' : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  بطاقة
                </>
              )}
            </button>
          </div>
          <p className="text-center text-xs text-[#64748b]">عملية دفع آمنة ومشفرة عبر Paymob</p>
        </div>
      </div>
    </div>
  );
}
