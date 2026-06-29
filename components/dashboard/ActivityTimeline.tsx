'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import GlassCard from '@/components/ui/GlassCard';
import Skeleton from '@/components/ui/Skeleton';

const actionIcons: Record<string, string> = {
  login: '🔐',
  profile_edit: '✏️',
  meeting_join: '🤝',
  pitch_upload: '📤',
};
const fallbackIcon = '📌';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'الآن';
  if (mins < 60) return `منذ ${mins} دقيقة`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `منذ ${hours} ساعة`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `منذ ${days} يوم`;
  const months = Math.floor(days / 30);
  return `منذ ${months} شهر`;
}

export default function ActivityTimeline() {
  const router = useRouter();
  const supabase = createClient();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUserId(user.id);

      try {
        const { data } = await supabase
          .from('activity_log')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);
        setActivities(data || []);
      } catch {}
      setLoading(false);
    }
    init();
  }, [supabase, router]);

  // Log current session as a login activity
  useEffect(() => {
    if (!userId) return;
    async function logLogin() {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('activity_log')
        .select('id')
        .eq('user_id', userId)
        .eq('action', 'login')
        .gte('created_at', today)
        .limit(1);
      if (!data || data.length === 0) {
        await supabase.from('activity_log').insert({
          user_id: userId,
          action: 'login',
          description: 'تسجيل الدخول إلى المنصة',
        });
      }
    }
    logLogin();
  }, [userId, supabase]);

  return (
    <GlassCard className="marfa-card-hover" dir="rtl">
      <h3 className="text-lg font-bold text-white mb-6 text-right" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
        آخر النشاطات
      </h3>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton width="10px" height="10px" circle />
              <div className="flex-1 space-y-2">
                <Skeleton width="80%" height="14px" />
                <Skeleton width="40%" height="12px" />
              </div>
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <p className="text-center text-[#64748b]" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          لا توجد نشاطات بعد
        </p>
      ) : (
        <div className="relative pr-6">
          {/* Gold vertical line */}
          <div
            className="absolute right-0 top-2 bottom-2 w-0.5 rounded-full"
            style={{ background: 'rgba(201,168,76,0.3)' }}
          />
          <div className="space-y-6">
            {activities.map((a) => (
              <div key={a.id} className="relative flex gap-4">
                {/* Dot on line */}
                <div
                  className="absolute right-[-23px] top-2 w-2.5 h-2.5 rounded-full z-10"
                  style={{ background: '#c9a84c' }}
                />
                {/* Content */}
                <div className="flex-1">
                  <p className="text-white text-sm leading-relaxed" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                    {actionIcons[a.action] || fallbackIcon} {a.description}
                  </p>
                  <span className="text-xs text-[#64748b] mt-1 block" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                    {timeAgo(a.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </GlassCard>
  );
}
