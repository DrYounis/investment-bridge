'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import MeetingsSchedule from './MeetingsSchedule';
import Link from 'next/link';

const MEETING_PRODUCT_ID = 'f0848f83-ad00-4528-9936-b2a19f5e3ba2';
const LEGACY_CUTOFF = '2026-07-26'; // Users registered before this get free access

export default function MeetingScheduleGate() {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      // Not authenticated → no access
      if (!user) {
        setHasAccess(false);
        return;
      }

      // Check if legacy user (signed up before cutoff)
      const { data: profile } = await supabase
        .from('profiles')
        .select('created_at')
        .eq('id', user.id)
        .single();

      if (profile?.created_at && profile.created_at < LEGACY_CUTOFF) {
        setHasAccess(true);
        return;
      }

      // Check for active meeting subscription OR Pro subscription
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('product_id, status')
        .eq('user_id', user.id)
        .eq('status', 'active');

      const hasActiveSub = subscription?.some(
        s => s.product_id === MEETING_PRODUCT_ID
      );

      // Also check Pro tier on profile
      const { data: profileTier } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', user.id)
        .single();

      const isPro = profileTier?.subscription_tier === 'pro' || profileTier?.subscription_tier === 'enterprise';

      setHasAccess(!!hasActiveSub || isPro);
    };
    check();
  }, [supabase]);

  if (hasAccess === null) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#c9a84c]" />
      </div>
    );
  }

  if (hasAccess) {
    return <MeetingsSchedule />;
  }

  // Blurred schedule + subscription CTA — visible enough for FOMO, unreadable
  return (
    <div className="relative" dir="rtl">
      {/* Blur overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#faf8f2]/60 rounded-3xl">
        <div className="text-center px-6 max-w-sm">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-xl font-black text-[#0a0f1e] mb-3" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            جدول اللقاءات حصري للمشتركين
          </h3>
          <p className="text-[#4a5b78] text-sm mb-6 leading-relaxed">
            اشترك في اللقاءات الأسبوعية بـ ١٠٠ ريال شهرياً للوصول للجدول الكامل وملفات PDF والانضمام للمجلس
          </p>
          <Link
            href={`/dashboard/checkout/${MEETING_PRODUCT_ID}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#c9a84c] text-[#0a0f1e] font-bold text-sm rounded-xl hover:bg-[#d4a843] transition-colors shadow-lg"
          >
            📅 اشترك الآن — ١٠٠ ريال/شهر
          </Link>
          <p className="text-xs text-[#8a94a8] mt-3">
            لديك حساب قديم؟ <a href="/login" className="text-[#c9a84c] underline">سجل دخولك</a>
          </p>
        </div>
      </div>

      {/* Blurred schedule underneath — visible but unreadable → FOMO */}
      <div className="select-none pointer-events-none blur-[3px]">
        <MeetingsSchedule />
      </div>
    </div>
  );
}
