'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function FundingPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/login');
    });
  }, [supabase, router]);

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center" dir="rtl">
      <div className="text-center">
        <span className="text-4xl block mb-4">💰</span>
        <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          جمع تمويل
        </h1>
        <p className="text-[#a0aec0]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          قريباً — أدوات جمع التمويل قيد التطوير
        </p>
      </div>
    </div>
  );
}
