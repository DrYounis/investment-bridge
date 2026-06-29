'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import GlassCard from '@/components/ui/GlassCard';
import Skeleton from '@/components/ui/Skeleton';

const steps = [
  { key: 'profile', label: 'أكمل ملفك الشخصي' },
  { key: 'phone', label: 'أضف رقم جوالك' },
  { key: 'pitch', label: 'ارفع عرضك التقديمي' },
  { key: 'meeting', label: 'احضر لقاءك الأول' },
  { key: 'investor', label: 'تواصل مع مستثمر' },
];

function CheckCircle() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="9" fill="rgba(201,168,76,0.15)" stroke="#c9a84c" strokeWidth="1.5" />
      <polyline points="6,10 9,13 14,7" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EmptyCircle() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="9" fill="none" stroke="#1a2540" strokeWidth="1.5" />
    </svg>
  );
}

export default function NextStepsChecklist() {
  const router = useRouter();
  const supabase = createClient();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      const uid = user.id;

      const result: Record<string, boolean> = {};

      try {
        const { data: profile } = await supabase.from('profiles').select('full_name,bio,avatar_url,phone').eq('id', uid).single();
        result.profile = !!(profile?.full_name && profile?.bio && profile?.avatar_url);
        result.phone = !!profile?.phone;
      } catch { result.profile = false; result.phone = false; }

      try {
        const { count } = await supabase.from('pitch_decks').select('*', { count: 'exact', head: true }).eq('user_id', uid);
        result.pitch = (count || 0) > 0;
      } catch { result.pitch = false; }

      try {
        const { count } = await supabase.from('meetings').select('*', { count: 'exact', head: true }).eq('user_id', uid).eq('attended', true);
        result.meeting = (count || 0) > 0;
      } catch { result.meeting = false; }

      try {
        const { count } = await supabase.from('investor_interests').select('*', { count: 'exact', head: true }).eq('entrepreneur_id', uid);
        result.investor = (count || 0) > 0;
      } catch { result.investor = false; }

      setChecked(result);
      setLoading(false);
    }
    load();
  }, [supabase, router]);

  const completed = Object.values(checked).filter(Boolean).length;
  const pct = (completed / 5) * 100;

  return (
    <GlassCard featured className="marfa-card-hover" dir="rtl">
      <h3 className="text-lg font-bold text-white mb-1 text-right" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
        خطواتك التالية
      </h3>
      <p className="text-sm text-[#a0aec0] mb-5 text-right" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
        أكمل هذه الخطوات للحصول على أفضل النتائج
      </p>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton width="20px" height="20px" circle />
              <Skeleton width="60%" height="16px" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-5">
            {steps.map((s) => {
              const done = checked[s.key];
              return (
                <div key={s.key} className="flex items-center gap-3">
                  {done ? <CheckCircle /> : <EmptyCircle />}
                  <span
                    className="text-sm"
                    style={{
                      fontFamily: 'var(--font-tajawal), sans-serif',
                      color: done ? '#64748b' : '#ffffff',
                      textDecoration: done ? 'line-through' : 'none',
                      textDecorationColor: '#c9a84c',
                    }}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div>
            <div className="h-2 rounded-full bg-[#1a2540] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#c9a84c]"
                style={{ width: `${pct}%`, transition: 'width 0.8s ease' }}
              />
            </div>
            <p className="text-sm text-[#a0aec0] mt-2 text-right" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
              {completed} من 5 مكتملة
            </p>
          </div>
        </>
      )}
    </GlassCard>
  );
}
