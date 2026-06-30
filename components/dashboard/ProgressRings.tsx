'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface RingData {
  label: string;
  percent: number;
}

function Ring({ percent, label }: { percent: number; label: string }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="90" height="90" viewBox="0 0 90 90" className="-rotate-90">
        {/* Track */}
        <circle
          cx="45"
          cy="45"
          r={radius}
          fill="none"
          stroke="#1a2540"
          strokeWidth="6"
        />
        {/* Progress arc */}
        <circle
          cx="45"
          cy="45"
          r={radius}
          fill="none"
          stroke="#c9a84c"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
        />
        {/* Percentage text */}
        <text
          x="45"
          y="46"
          textAnchor="middle"
          fill="#c9a84c"
          fontSize="16"
          fontWeight="bold"
          fontFamily="var(--font-tajawal), sans-serif"
          transform="rotate(90, 45, 45)"
        >
          {percent}%
        </text>
      </svg>
      <span
        className="text-center text-[13px]"
        style={{ color: '#a0aec0', fontFamily: 'var(--font-tajawal), sans-serif' }}
      >
        {label}
      </span>
    </div>
  );
}

export default function ProgressRings() {
  const router = useRouter();
  const supabase = createClient();

  const [rings, setRings] = useState<RingData[]>([
    { label: 'اكتمال الملف', percent: 0 },
    { label: 'التمويل', percent: 0 },
    { label: 'الأكاديمية', percent: 0 },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const uid = user.id;

      // Batch all 3 queries
      const [profileResult, fundingResult, academyResult] = await Promise.allSettled([
        supabase.from('profiles').select('full_name, bio, avatar_url, phone, sector').eq('id', uid).maybeSingle(),
        supabase.from('funding_requests').select('progress_percent').eq('user_id', uid).maybeSingle(),
        supabase.from('academy_progress').select('completion_percent').eq('user_id', uid).maybeSingle(),
      ]);

      // Ring 1: Profile completion
      let profilePercent = 0;
      if (profileResult.status === 'fulfilled' && profileResult.value.data) {
        const profile = profileResult.value.data;
        const fields = [profile.full_name, profile.bio, profile.avatar_url, profile.phone, profile.sector];
        const filled = fields.filter((f) => f && f.length > 0).length;
        profilePercent = Math.round((filled / 5) * 100);
      }

      // Ring 2: Funding progress
      let fundingPercent = 0;
      if (fundingResult.status === 'fulfilled' && fundingResult.value.data?.progress_percent != null) {
        fundingPercent = Math.min(100, Math.max(0, fundingResult.value.data.progress_percent));
      }

      // Ring 3: Academy progress
      let academyPercent = 0;
      if (academyResult.status === 'fulfilled' && academyResult.value.data?.completion_percent != null) {
        academyPercent = Math.min(100, Math.max(0, academyResult.value.data.completion_percent));
      }

      // Animate from 0 after a short delay so the transition triggers
      setTimeout(() => {
        setRings([
          { label: 'اكتمال الملف', percent: profilePercent },
          { label: 'التمويل', percent: fundingPercent },
          { label: 'الأكاديمية', percent: academyPercent },
        ]);
        setLoading(false);
      }, 100);
    }
    load();
  }, [supabase, router]);

  return (
    <div
      className="rounded-2xl p-6 border border-[#1a2540]"
      style={{
        background: '#0d1628',
        fontFamily: 'var(--font-tajawal), sans-serif',
      }}
      dir="rtl"
    >
      <h3
        className="text-lg font-bold mb-6"
        style={{ color: '#ffffff', fontFamily: 'var(--font-tajawal), sans-serif' }}
      >
        مؤشرات الأداء
      </h3>

      {loading ? (
        <div className="flex justify-center gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="marfa-skeleton w-[90px] h-[90px] rounded-full" />
              <div className="marfa-skeleton h-4 w-16 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center gap-6 flex-wrap">
          {rings.map((ring) => (
            <Ring key={ring.label} percent={ring.percent} label={ring.label} />
          ))}
        </div>
      )}
    </div>
  );
}
