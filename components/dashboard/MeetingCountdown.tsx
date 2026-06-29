'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import GlassCard from '@/components/ui/GlassCard';
import Skeleton from '@/components/ui/Skeleton';

function calcRemaining(target: Date): { days: number; hours: number; minutes: number; seconds: number; total: number } {
  const total = target.getTime() - Date.now();
  if (total <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  return {
    days: Math.floor(total / 86400000),
    hours: Math.floor((total % 86400000) / 3600000),
    minutes: Math.floor((total % 3600000) / 60000),
    seconds: Math.floor((total % 60000) / 1000),
    total,
  };
}

function CountBox({ value, label }: { value: number; label: string }) {
  return (
    <div
      className="rounded-lg px-3 py-2 text-center min-w-[60px] border border-[#1a2540]"
      style={{ background: '#0a0f1e' }}
    >
      <div className="text-xl font-black text-[#c9a84c]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-xs text-[#a0aec0] mt-0.5" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
        {label}
      </div>
    </div>
  );
}

export default function MeetingCountdown() {
  const router = useRouter();
  const supabase = createClient();
  const [meeting, setMeeting] = useState<any>(null);
  const [remaining, setRemaining] = useState<ReturnType<typeof calcRemaining> | null>(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      try {
        const { data } = await supabase
          .from('meetings')
          .select('*')
          .eq('user_id', user.id)
          .gt('meeting_date', new Date().toISOString())
          .order('meeting_date', { ascending: true })
          .limit(1);
        setMeeting(data?.[0] || null);
      } catch {}
      setLoading(false);
    }
    load();
  }, [supabase, router]);

  useEffect(() => {
    if (!meeting) return;
    function tick() {
      const r = calcRemaining(new Date(meeting.meeting_date));
      setRemaining(r);
    }
    tick();
    intervalRef.current = setInterval(tick, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [meeting]);

  return (
    <GlassCard className="marfa-card-hover" dir="rtl">
      <h3 className="text-lg font-bold text-white mb-5 text-right" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
        اللقاء القادم
      </h3>

      {loading ? (
        <div className="space-y-3">
          <Skeleton height="20px" width="70%" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} width="55px" height="55px" />
            ))}
          </div>
        </div>
      ) : !meeting ? (
        <div className="text-center py-4">
          <span className="text-3xl block mb-2">📅</span>
          <p className="text-[#64748b] text-sm" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            لا توجد لقاءات قادمة
          </p>
        </div>
      ) : remaining && remaining.total <= 0 ? (
        <div className="text-center">
          <p className="text-[#c9a84c] font-bold text-lg" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            اللقاء يجري الآن
          </p>
          {meeting.meeting_url && (
            <a
              href={meeting.meeting_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 px-6 py-3 bg-[#c9a84c] text-[#0a0f1e] font-bold rounded-lg hover:scale-105 transition-all"
              style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
            >
              انضم الآن
            </a>
          )}
        </div>
      ) : (
        <div>
          <p className="text-white font-bold text-sm mb-4 text-right" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
            {meeting.title}
          </p>
          {remaining && (
            <div className="flex justify-center gap-2 flex-wrap">
              <CountBox value={remaining.days} label="يوم" />
              <CountBox value={remaining.hours} label="ساعة" />
              <CountBox value={remaining.minutes} label="دقيقة" />
              <CountBox value={remaining.seconds} label="ثانية" />
            </div>
          )}
          {remaining && remaining.total <= 3600000 && meeting.meeting_url && (
            <div className="text-center mt-4">
              <a
                href={meeting.meeting_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-[#c9a84c] text-[#0a0f1e] font-bold rounded-lg hover:scale-105 transition-all animate-pulse"
                style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
              >
                انضم الآن
              </a>
            </div>
          )}
        </div>
      )}
    </GlassCard>
  );
}
