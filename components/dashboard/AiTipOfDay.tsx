'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import GlassCard from '@/components/ui/GlassCard';
import Skeleton from '@/components/ui/Skeleton';

const FALLBACK_TIPS: string[] = [
  'ركّز على بناء نموذج أولي بسيط قبل البحث عن التمويل — المستثمر يريد رؤية شيء ملموس. تحدث مع 3 عملاء محتملين هذا الأسبوع.',
  'جهّز عرضك التقديمي بحيث يجيب على سؤالين فقط: ما المشكلة التي تحلها؟ ولماذا أنت الشخص المناسب لحلها؟',
  'معظم المستثمرين في السوق السعودي يفضلون رؤية أرقام واقعية حتى لو كانت صغيرة — الأرقام تتحدث louder من الأفكار.',
  'لا تنتظر الفكرة المثالية. ابدأ بما لديك، اختبره في السوق، وطوّره بناءً على ملاحظات العملاء الحقيقية.',
  'خصص وقتاً كل أسبوع للتواصل مع مستثمرين ورواد أعمال — العلاقات هي أكبر أصل في رحلة ريادة الأعمال.',
  'قبل أن تطلب تمويلاً، تأكد أن لديك إجابة واضحة عن: كيف ستحقق إيرادات؟ وكم ستحتاج من الوقت للوصول إلى نقطة التعادل؟',
  'السوق السعودي مليء بالفرص في قطاعات التقنية المالية، الصحة الرقمية، والخدمات اللوجستية — ابحث عن المشكلة قبل أن تبحث عن الحل.',
];

const PROMPT =
  'أنت مستشار أعمال خبير متخصص في ريادة الأعمال والاستثمار في السوق السعودي. اكتب نصيحة عملية واحدة مختصرة (3 جمل كحد أقصى) لرائد أعمال سعودي شاب يسعى للحصول على تمويل. النصيحة يجب أن تكون باللغة العربية الفصحى البسيطة، عملية، وقابلة للتطبيق فوراً.';

export default function AiTipOfDay() {
  const router = useRouter();
  const supabase = createClient();
  const [tip, setTip] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const lastTipRef = useRef<string>('');

  function randomFallback(): string {
    const others = FALLBACK_TIPS.filter((t) => t !== lastTipRef.current);
    const pool = others.length > 0 ? others : FALLBACK_TIPS;
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    lastTipRef.current = chosen;
    return chosen;
  }

  async function fetchTip() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const res = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: PROMPT }),
      });
      if (!res.ok) throw new Error('API error');
      const json = await res.json();
      const text = json.text || json.response || json.content || '';
      if (text && text.trim().length > 10) {
        lastTipRef.current = text;
        setTip(text);
      } else {
        setTip(randomFallback());
      }
    } catch {
      setTip(randomFallback());
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
        ) : (
          <p className="text-white text-base leading-relaxed text-right" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            {tip}
          </p>
        )}
      </div>
    </GlassCard>
  );
}
