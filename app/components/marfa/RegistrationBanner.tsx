'use client';

import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';

interface RegistrationBannerProps {
  variant?: 'hero' | 'card';
  context?: string; // "meetings", "learn", "home"
}

const VALUE_PROPS: Record<string, { emoji: string; text: string }[]> = {
  meetings: [
    { emoji: '🏛️', text: 'انضم للمجلس الاستشاري وأجب عن أسئلة الحالات' },
    { emoji: '📊', text: 'احصل على تقييم شهري من المستشارين' },
    { emoji: '💬', text: 'ناقش الحالات مباشرة مع زملائك في المجلس' },
  ],
  learn: [
    { emoji: '📖', text: 'احفظ المقالات وتابع تقدمك التعليمي' },
    { emoji: '📚', text: 'يصلك مصطلح الأسبوع على إيميلك كل اثنين' },
    { emoji: '🎯', text: 'اختبر معرفتك في المجلس الاستشاري' },
  ],
  home: [
    { emoji: '🛠️', text: 'كل الأدوات مجانية: مستشار 360°، خطاب المصعد، تحليل الفكرة' },
    { emoji: '🏛️', text: 'انضم للمجلس الاستشاري — ١٤ لقاء تدريبي مع مستشارين معتمدين' },
    { emoji: '📧', text: 'تنبيهات وظيفية أسبوعية + مصطلح تجاري كل اثنين' },
  ],
};

export default function RegistrationBanner({ variant = 'card', context = 'home' }: RegistrationBannerProps) {
  const { user } = useAuth();

  if (user) return null;

  const props = VALUE_PROPS[context] || VALUE_PROPS.home;

  if (variant === 'hero') {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0a0f1e] to-[#0d1628] border border-[#c9a84c]/30 shadow-[0_8px_40px_rgba(201,168,76,0.08)]">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#c9a84c]/5 rounded-full blur-3xl" />
        <div className="relative z-10 p-8 md:p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            🚀 ابدأ رحلتك في مرفأ — مجاناً
          </h2>
          <p className="text-[#a0aec0] text-sm mb-6 max-w-lg mx-auto" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            مجتمع تدريبي سعودي لرواد الأعمال — أدوات ذكاء اصطناعي، لقاءات أسبوعية، تقييمات شهرية، وفرص وظيفية
          </p>
          <div className="grid sm:grid-cols-3 gap-3 mb-6 max-w-2xl mx-auto">
            {props.map((p, i) => (
              <div key={i} className="flex items-start gap-2 text-right bg-white/5 rounded-xl p-3 border border-white/5">
                <span className="text-lg shrink-0">{p.emoji}</span>
                <span className="text-xs text-[#a0aec0] leading-relaxed" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>{p.text}</span>
              </div>
            ))}
          </div>
          <Link
            href="/login"
            className="inline-block px-10 py-3.5 rounded-full bg-gradient-to-r from-[#c9a84c] to-[#d4a843] text-[#0a0f1e] font-bold text-base hover:shadow-xl hover:shadow-[#c9a84c]/25 transition-all duration-300"
            style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
          >
            سجّل الآن مجاناً ←
          </Link>
          <p className="text-[#64748b] text-xs mt-3" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>أقل من دقيقة — بريدك الإلكتروني فقط</p>
        </div>
      </div>
    );
  }

  // Card variant (light cream, for public pages)
  return (
    <div className="bg-white rounded-2xl border border-[#c9a84c]/30 p-6 shadow-[0_4px_20px_rgba(10,15,30,0.04)]">
      <div className="text-center mb-4">
        <h3 className="text-[#0a0f1e] font-bold text-lg mb-1" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          🚀 سجّل في مرفأ وابدأ رحلتك
        </h3>
        <p className="text-[#4a5b78] text-sm" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          مجتمع رواد أعمال — أدوات ذكاء اصطناعي — تدريب وتقييم — مجاناً
        </p>
      </div>
      <div className="space-y-2 mb-4">
        {props.slice(0, 3).map((p, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-[#4a5b78]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            <span>{p.emoji}</span>
            <span>{p.text}</span>
          </div>
        ))}
      </div>
      <Link
        href="/login"
        className="block w-full text-center py-2.5 rounded-full bg-gradient-to-r from-[#c9a84c] to-[#d4a843] text-[#0a0f1e] text-sm font-bold hover:shadow-lg hover:shadow-[#c9a84c]/25 transition-all duration-300"
        style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
      >
        سجّل الآن مجاناً ←
      </Link>
      <p className="text-center text-[#8a94a8] text-xs mt-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>أقل من دقيقة</p>
    </div>
  );
}
