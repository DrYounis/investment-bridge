'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardHome from '@/app/components/dashboard/DashboardHome';
import WelcomeCard from '@/components/dashboard/WelcomeCard';
import ProgressRings from '@/components/dashboard/ProgressRings';
import NotificationBell from '@/components/dashboard/NotificationBell';
import ThemeToggle from '@/components/dashboard/ThemeToggle';
import ParticleBackground from '@/components/dashboard/ParticleBackground';
import ActivityTimeline from '@/components/dashboard/ActivityTimeline';
import MiniAnalytics from '@/components/dashboard/MiniAnalytics';
import NextStepsChecklist from '@/components/dashboard/NextStepsChecklist';
import AiTipOfDay from '@/components/dashboard/AiTipOfDay';
import MeetingCountdown from '@/components/dashboard/MeetingCountdown';
import SocialProofTicker from '@/components/dashboard/SocialProofTicker';
import ReadinessScore from '@/components/dashboard/ReadinessScore';
import PitchAuditCard from '@/components/dashboard/PitchAuditCard';
import InvestorSignals from '@/components/dashboard/InvestorSignals';
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
        {/* Particle background behind hero area */}
        <div className="relative overflow-hidden">
          <ParticleBackground />
          <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 relative z-10">
            {/* Top bar */}
            <div className="flex justify-end items-center gap-4">
              <ThemeToggle />
              <NotificationBell />
            </div>

            {/* Row 1: Welcome + Progress Rings + Readiness Score */}
            <div className="grid lg:grid-cols-3 gap-6">
              <WelcomeCard />
              <ProgressRings />
              <ReadinessScore />
            </div>

            {/* Row 2: MiniAnalytics + NextSteps */}
            <div className="grid lg:grid-cols-2 gap-6">
              <MiniAnalytics />
              <NextStepsChecklist />
            </div>

            {/* Row 3: AiTip + MeetingCountdown */}
            <div className="grid lg:grid-cols-2 gap-6">
              <AiTipOfDay />
              <MeetingCountdown />
            </div>

            {/* Row 3b: AI Pitch Audit (full width) */}
            <PitchAuditCard />

            {/* Row 4: Activity Timeline + Investor Signals */}
            <div className="grid lg:grid-cols-2 gap-6">
              <ActivityTimeline />
              <InvestorSignals />
            </div>

            {/* Row 5: Existing role-based dashboard */}
            <DashboardHome user={currentUser} />
          </div>

          {/* Social proof ticker */}
          <SocialProofTicker />
        </div>

        {/* Floating action button */}
        <QuickActionFAB />
      </div>
    </NewsProvider>
  );
}
