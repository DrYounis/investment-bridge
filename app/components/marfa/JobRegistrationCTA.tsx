'use client';

import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';

export default function JobRegistrationCTA() {
  const { user } = useAuth();

  // Don't show to logged-in users
  if (user) return null;

  return (
    <div
      className="bg-white rounded-2xl border border-[#c9a84c]/30 p-6 text-center shadow-[0_4px_20px_rgba(10,15,30,0.04)]"
      style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
    >
      <p className="text-[#0a0f1e] font-bold text-lg mb-2">
        🚀 سجّل في مرفأ واحصل على تنبيهات وظيفية
      </p>
      <p className="text-[#4a5b78] text-sm mb-4 leading-relaxed">
        أنشئ حسابك المجاني لتصلك أحدث الوظائف أولاً بأول — وتابع تقدمك المهني مع مرفأ
      </p>
      <Link
        href="/login"
        className="inline-block px-8 py-2.5 rounded-full bg-gradient-to-r from-[#c9a84c] to-[#d4a843] text-[#0a0f1e] text-sm font-bold hover:shadow-lg hover:shadow-[#c9a84c]/25 transition-all duration-300"
      >
        سجّل الآن مجاناً ←
      </Link>
      <p className="text-[#8a94a8] text-xs mt-2">يستغرق أقل من دقيقة</p>
    </div>
  );
}
