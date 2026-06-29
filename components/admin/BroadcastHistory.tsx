'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Skeleton from '@/components/ui/Skeleton';

interface Broadcast {
  id: string;
  title: string;
  body: string;
  audience: 'all' | 'investor' | 'entrepreneur';
  sent_in_app: boolean;
  sent_email: boolean;
  recipient_count: number;
  created_at: string;
}

const audienceBadge: Record<string, { bg: string; text: string; border: string; label: string }> = {
  all: { bg: 'rgba(201,168,76,0.1)', text: '#c9a84c', border: 'rgba(201,168,76,0.3)', label: 'الكل' },
  investor: { bg: 'rgba(96,165,250,0.15)', text: '#60a5fa', border: 'rgba(96,165,250,0.3)', label: 'المستثمرون' },
  entrepreneur: { bg: 'rgba(168,85,247,0.15)', text: '#a855f7', border: 'rgba(168,85,247,0.3)', label: 'رواد الأعمال' },
};

export default function BroadcastHistory() {
  const supabase = createClient();
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase
          .from('broadcasts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);
        setBroadcasts(data || []);
      } catch {}
      setLoading(false);
    }
    load();
  }, [supabase]);

  return (
    <div dir="rtl">
      <h2 className="text-xl font-bold text-white text-right mb-5" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
        سجل الإشعارات السابقة
      </h2>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between py-4 border-b border-[#1a2540]">
              <div className="space-y-2 flex-1">
                <Skeleton width="60%" height="18px" />
                <Skeleton width="80%" height="14px" />
              </div>
              <div className="space-y-2 text-left">
                <Skeleton width="60px" height="18px" />
                <Skeleton width="40px" height="14px" />
              </div>
            </div>
          ))}
        </div>
      ) : broadcasts.length === 0 ? (
        <p className="text-center text-[#64748b] py-8" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
          لم يتم إرسال أي إشعارات بعد
        </p>
      ) : (
        <div className="rounded-2xl border border-[#1a2540] overflow-hidden" style={{ background: '#0d1628' }}>
          {broadcasts.map((b) => {
            const badge = audienceBadge[b.audience];
            return (
              <div key={b.id} className="flex justify-between items-start py-4 px-6 border-b border-[#1a2540] last:border-b-0">
                {/* Right side */}
                <div className="flex-1 min-w-0 ml-4">
                  <p className="text-white font-medium text-right truncate" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                    {b.title}
                  </p>
                  <p className="text-[#64748b] text-sm text-right mt-1 line-clamp-1" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                    {b.body.length > 80 ? b.body.slice(0, 80) + '...' : b.body}
                  </p>
                  <div className="mt-2">
                    <span
                      className="inline-block px-3 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: badge.bg, color: badge.text, border: `1px solid ${badge.border}`, fontFamily: 'var(--font-tajawal), sans-serif' }}
                    >
                      {badge.label}
                    </span>
                  </div>
                </div>

                {/* Left side */}
                <div className="text-left shrink-0">
                  <p className="text-[#c9a84c] font-bold text-right" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                    {b.recipient_count} مستخدم
                  </p>
                  <div className="flex items-center gap-2 mt-1 justify-end">
                    {/* In-app icon */}
                    <svg
                      width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke={b.sent_in_app ? '#c9a84c' : '#64748b'}
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    {/* Email icon */}
                    <svg
                      width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke={b.sent_email ? '#c9a84c' : '#64748b'}
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <polyline points="2,8 12,15 22,8" />
                    </svg>
                  </div>
                  <p className="text-[#64748b] text-xs mt-1" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}>
                    {new Date(b.created_at).toLocaleDateString('ar-SA')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
