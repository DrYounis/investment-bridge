'use client';

// Plans/Pricing page — shows active Pro products from DB with monthly/yearly toggle
// دفع عبر Paymob — بطاقة ائتمان أو Apple Pay

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface PlanProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: string;
  features: string[];
  tier_level: string;
}

export default function PlansPage() {
  const [products, setProducts] = useState<{ monthly: PlanProduct | null; yearly: PlanProduct | null }>({
    monthly: null, yearly: null,
  });
  const [billing, setBilling] = useState<'month' | 'year'>('year');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('tier_level', 'pro')
        .order('price', { ascending: true });

      if (!error && data) {
        setProducts({
          monthly: data.find(p => p.interval === 'month') || null,
          yearly: data.find(p => p.interval === 'year') || null,
        });
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const activeProduct = billing === 'month' ? products.monthly : products.yearly;
  const monthlyPrice = products.monthly?.price || 150;
  const yearlyPrice = products.yearly?.price || 1000;
  const yearlyMonthly = Math.round(yearlyPrice / 12);
  const savingsPercent = Math.round((1 - yearlyMonthly / monthlyPrice) * 100);

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#c9a84c]" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-12 px-4" dir="rtl">
      <div className="text-center mb-10">
        <span className="inline-block px-4 py-1 bg-[#c9a84c]/10 border border-[#c9a84c]/30 text-[#c9a84c] text-sm font-bold rounded-full mb-4">
          🚀 منصة مرفأ
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          طوّر مشروعك مع مرفأ
        </h1>
        <p className="text-[#a0aec0] text-lg">خطة واحدة شاملة لكل ما تحتاجه للنجاح</p>
      </div>

      {/* Monthly / Yearly Toggle */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
          <button onClick={() => setBilling('month')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${billing === 'month' ? 'bg-[#c9a84c] text-[#0a0f1e] shadow-lg' : 'text-[#a0aec0] hover:text-white'}`}>
            شهري
          </button>
          <button onClick={() => setBilling('year')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${billing === 'year' ? 'bg-[#c9a84c] text-[#0a0f1e] shadow-lg' : 'text-[#a0aec0] hover:text-white'}`}>
            سنوي
            {savingsPercent > 0 && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${billing === 'year' ? 'bg-[#0a0f1e]/20 text-[#0a0f1e]' : 'bg-[#c9a84c]/20 text-[#c9a84c]'}`}>
                وفر {savingsPercent}%
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Pricing Card */}
      <div className="relative bg-gradient-to-br from-[#0d1628] to-[#0a0f1e] border border-[#c9a84c]/30 rounded-2xl p-8 shadow-2xl shadow-[#c9a84c]/5 mb-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#c9a84c]/5 to-transparent" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <span className="text-[#c9a84c] font-bold text-lg">برو</span>
            <span className="px-3 py-1 bg-[#c9a84c]/20 border border-[#c9a84c]/30 text-[#c9a84c] text-xs font-bold rounded-full">
              الأكثر شيوعاً
            </span>
          </div>
          <div className="mb-2">
            <div className="flex items-end gap-2">
              <span className="text-5xl font-bold text-white">
                {billing === 'month' ? monthlyPrice : yearlyMonthly}
              </span>
              <div className="mb-2">
                <span className="text-[#a0aec0] text-sm block">ريال</span>
                <span className="text-[#64748b] text-xs">/ شهر</span>
              </div>
            </div>
            {billing === 'year' && (
              <p className="text-[#c9a84c] text-sm mt-1">
                يُدفع {yearlyPrice} ريال سنوياً — توفير {(monthlyPrice * 12) - yearlyPrice} ريال
              </p>
            )}
          </div>
          <div className="my-8">
            {activeProduct ? (
              <Link
                href={`/dashboard/checkout/${activeProduct.id}`}
                className="w-full block text-center py-4 bg-[#c9a84c] hover:bg-[#d4a843] text-[#0a0f1e] font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-[#c9a84c]/30 active:scale-95"
              >
                اشترك الآن — {billing === 'month' ? `${monthlyPrice} ريال/شهر` : `${yearlyPrice} ريال/سنة`}
              </Link>
            ) : (
              <button disabled className="w-full py-4 bg-[#1a2540] text-[#64748b] font-bold rounded-xl cursor-not-allowed">
                غير متاح حالياً
              </button>
            )}
          </div>
          <ul className="space-y-3">
            {[
              'الوصول الكامل لجميع الأدوات والتحليلات',
              'تقارير جاهزية مخصّصة',
              'تدقيق آلي لعرضك الاستثماري',
              'إشارات المستثمرين والتوصيات',
              'غرفة صفقات مع مستثمرين',
              'تحليلات أسبوعية لأداء ملفك',
              'دعم فني أولوية عبر واتساب',
            ].map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-[#a0aec0]">
                <svg className="w-5 h-5 text-[#c9a84c] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="text-center text-[#64748b] text-xs">
        🔒 دفع آمن عبر Paymob — Apple Pay مدعوم — إلغاء في أي وقت
      </p>
    </div>
  );
}
