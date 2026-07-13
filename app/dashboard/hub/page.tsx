'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import VoyageJourney from '@/components/dashboard/VoyageJourney';
import Lighthouse from '@/components/dashboard/Lighthouse';
import NotificationBell from '@/components/dashboard/NotificationBell';
import ThemeToggle from '@/components/dashboard/ThemeToggle';
import ParticleBackground from '@/components/dashboard/ParticleBackground';
import QuickActionFAB from '@/components/dashboard/QuickActionFAB';
import { NewsProvider } from '@/app/context/NewsContext';
import { createClient } from '@/lib/supabase/client';

export default function HubPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          setCurrentUser({
            id: user.id,
            name: profile?.full_name || user.email?.split('@')[0] || 'مستخدم',
            email: user.email,
            role: profile?.user_type || profile?.role || 'user',
          });
        }
      } catch {}
      setLoading(false);
    }
    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center" dir="rtl">
        <div className="text-[#8a9bb8]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          جاري التحميل...
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <p className="text-[#8a9bb8] mb-4" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            يجب تسجيل الدخول للوصول إلى لوحة التحكم
          </p>
          <Link href="/login" className="text-[#c9a84c] font-bold hover:underline" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            تسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  return (
    <NewsProvider>
      <div className="min-h-screen bg-[#0a0f1e] overflow-x-hidden pt-24 md:pt-32" dir="rtl" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
        <div className="relative overflow-hidden">
          <ParticleBackground />
          <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 relative z-10">
            {/* Top bar */}
            <div className="flex justify-end items-center gap-4">
              <ThemeToggle />
              <NotificationBell />
            </div>

            {/* Row 1: Voyage Journey (full width) */}
            <VoyageJourney />

            {/* Row 2: Lighthouse (centered, 2/3 width on desktop) */}
            <div className="max-w-2xl mx-auto">
              <Lighthouse />
            </div>
          </div>
        </div>

        {/* Floating action button */}
        <QuickActionFAB />
      </div>
    </NewsProvider>
  );
}
