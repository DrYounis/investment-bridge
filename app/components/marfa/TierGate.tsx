'use client';

// Tier gating — wrap any component to require a minimum subscription tier
// Usage: <TierGate requiredTier="pro"> <YourProtectedContent /> </TierGate>

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface TierGateProps {
  requiredTier: 'pro' | 'enterprise';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function TierGate({ requiredTier, children, fallback }: TierGateProps) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setHasAccess(false); return; }
      const { data: profile } = await supabase.from('profiles').select('subscription_tier').eq('id', user.id).single();
      if (!profile) { setHasAccess(false); return; }
      const tiers = ['free', 'pro_trial', 'pro', 'enterprise'];
      const userLevel = tiers.indexOf(profile.subscription_tier);
      const requiredLevel = tiers.indexOf(requiredTier);
      setHasAccess(userLevel >= requiredLevel);
    };
    check();
  }, [requiredTier, supabase]);

  if (hasAccess === null) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#c9a84c]" />
    </div>
  );
  if (hasAccess) return <>{children}</>;

  return fallback || (
    <div className="max-w-md mx-auto mt-20 text-center space-y-6" dir="rtl">
      <div className="w-16 h-16 rounded-2xl bg-[#c9a84c]/20 flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-[#c9a84c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
        هذه الميزة للباقات المدفوعة
      </h2>
      <p className="text-[#a0aec0]">قم بترقية اشتراكك للوصول إلى هذه الميزات</p>
      <Link
        href="/dashboard/plans"
        className="inline-flex items-center gap-2 px-6 py-3 bg-[#c9a84c] hover:bg-[#d4a843] text-[#0a0f1e] rounded-xl font-bold text-sm transition-all"
      >
        ترقية الباقة
      </Link>
    </div>
  );
}
