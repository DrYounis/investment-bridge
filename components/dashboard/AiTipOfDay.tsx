'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import GlassCard from '@/components/ui/GlassCard';
import Skeleton from '@/components/ui/Skeleton';

export default function AiTipOfDay() {
  const router = useRouter();
  const supabase = createClient();
  const [tip, setTip] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const prompt =
    'أنت مستشار أعمال خبير متخصص في ريادة الأعمال والاستثمار في السوق السعودي. اكتب نصيحة عملية واحدة مختصرة (3 جمل كحد أقصى) لرائد أعمال سعودي شاب يسعى للحصول على تمويل. النصيحة يجب أن تكون باللغة العربية الفصحى البسيطة، عملية، وقابلة للتطبيق فوراً.';

  async function fetchTip() {
    setLoading(true);
    setError(false);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const res = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error('API error');
      const json = await res.json();
      setTip(json.text || json.response || json.content || '');
    } catch {
      setError(true);
    }
    setLoading(false);
  }

  useEffect(() => { fetchTip(); }, []);

  return (
    <GlassCard featured className="marfa-card-hover" dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-[#c9a84c] text-right" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          نصيحة اليوم 💡
        </h3>
        <button
          onClick={fetchTip}
          disabled={loading}
          className="px-4 py-2 rounded-lg text-sm border border-[#c9a84c]/40 text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-colors disabled:opacity-40"
          style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
        >
          نصيحة جديدة
        </button>
      </div>

      <div className="pr-4" style={{ borderRight: '4px solid #c9a84c' }}>
        {loading ? (
          <div className="space-y-2">
            <Skeleton height="14px" width="100%" />
            <Skeleton height="14px" width="80%" />
            <Skeleton height="14px" width="60%" />
          </div>
        ) : error ? (
          <p className="text-[#64748b] text-sm" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            تعذّر تحميل النصيحة، حاول مرة أخرى لاحقاً
          </p>
        ) : (
          <p className="text-white text-base leading-relaxed text-right" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            {tip}
          </p>
        )}
      </div>
    </GlassCard>
  );
}
