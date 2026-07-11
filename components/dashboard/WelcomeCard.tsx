'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function getArabicGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'صباح الخير';
  if (hour >= 12 && hour < 17) return 'مساء الخير';
  if (hour >= 17 && hour < 22) return 'مساء النور';
  return 'مرحباً';
}

export default function WelcomeCard() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .maybeSingle();

      setFullName(profile?.full_name || user.email?.split('@')[0] || 'مستخدم');
      setLoading(false);
    }
    load();
  }, [supabase, router]);

  const arabicDate = new Date().toLocaleDateString('ar-SA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (loading) {
    return (
      <div
        className="rounded-2xl p-6 border border-[#1a2540] overflow-hidden relative"
        style={{
          background: 'linear-gradient(135deg, #0a0f1e, #0d1a3a, #0a1628)',
          backgroundSize: '300% 300%',
          borderBottom: '1px solid rgba(201,168,76,0.4)',
          fontFamily: 'var(--font-tajawal), sans-serif',
        }}
        dir="rtl"
      >
        <div className="flex flex-col gap-3">
          <span className="marfa-skeleton h-8 w-48 rounded-lg" />
          <span className="marfa-skeleton h-5 w-64 rounded-lg" />
          <span className="marfa-skeleton h-4 w-40 rounded-lg" />
        </div>
        <style>{`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
      </div>
    );
  }

  const greeting = getArabicGreeting();

  return (
    <div
      className="rounded-2xl p-6 border border-[#1a2540] overflow-hidden relative"
      style={{
        background: 'linear-gradient(135deg, #0a0f1e, #0d1a3a, #0a1628)',
        backgroundSize: '300% 300%',
        animation: 'gradientShift 8s ease infinite',
        willChange: 'background-position',
        borderBottom: '1px solid rgba(201,168,76,0.4)',
        fontFamily: 'var(--font-tajawal), sans-serif',
      }}
      dir="rtl"
    >
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <div className="relative z-10 flex flex-col gap-1">
        <h2 className="text-2xl md:text-3xl font-black text-white">
          {greeting}، <span className="text-[#c9a84c]">{fullName}</span>
        </h2>
        <p className="text-[#a0aec0] text-sm md:text-base font-medium mt-1">
          {arabicDate}
        </p>
      </div>

      {/* Decorative subtle corner glow */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-[#c9a84c]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#c9a84c]/3 rounded-full blur-2xl pointer-events-none" />
    </div>
  );
}
