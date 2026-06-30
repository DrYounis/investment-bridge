'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'الآن';
  if (mins < 60) return `منذ ${arabicUnit(mins, 'دقيقة', 'دقيقتان', 'دقائق')}`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `منذ ${arabicUnit(hours, 'ساعة', 'ساعتان', 'ساعات')}`;
  const days = Math.floor(hours / 24);
  return `منذ ${arabicUnit(days, 'يوم', 'يومان', 'أيام')}`;
}

function arabicUnit(num: number, singular: string, dual: string, plural: string): string {
  if (num === 1) return `${num} ${singular}`;
  if (num === 2) return `${dual}`;
  if (num >= 3 && num <= 10) return `${num} ${plural}`;
  return `${num} ${singular}`;
}

interface Notification {
  id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function NotificationBell() {
  const router = useRouter();
  const supabase = createClient();

  const [userId, setUserId] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  const bellRef = useRef<HTMLDivElement>(null);

  // Auth gate + initial count fetch
  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUserId(user.id);

      // Fetch initial unread count
      try {
        const { count, error } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_read', false);

        if (!error && count != null) {
          setUnreadCount(count);
        }
      } catch {
        // Table may not exist yet — gracefully degrade
      }
    }
    init();
  }, [supabase, router]);

  // Realtime subscription
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('notifications-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        async () => {
          // Refetch count on any change
          try {
            const { count, error } = await supabase
              .from('notifications')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', userId)
              .eq('is_read', false);

            if (!error && count != null) {
              setUnreadCount(count);
            }
          } catch {
            // ignore
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  // Click outside to close dropdown
  useEffect(() => {
    if (!dropdownOpen) return;

    function handleClick(e: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  const handleBellClick = useCallback(async () => {
    if (!userId) return;

    if (dropdownOpen) {
      setDropdownOpen(false);
      return;
    }

    setDropdownOpen(true);
    setLoadingList(true);

    try {
      // Fetch latest 5
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      setNotifications(data || []);

      // Mark all as read
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      setUnreadCount(0);
    } catch {
      // table may not exist
    }
    setLoadingList(false);
  }, [dropdownOpen, userId, supabase]);

  return (
    <div
      ref={bellRef}
      className="relative"
      dir="rtl"
      style={{ fontFamily: 'var(--font-tajawal), sans-serif' }}
      onKeyDown={(e) => { if (e.key === 'Escape') setDropdownOpen(false); }}
    >
      <style>{`
        @keyframes badgePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.18); }
        }
      `}</style>

      {/* Bell button */}
      <button
        onClick={handleBellClick}
        className="relative p-2 rounded-lg hover:bg-white/5 transition-colors"
        aria-label="الإشعارات"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#a0aec0"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {/* Badge */}
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center rounded-full px-1 text-[11px] font-black"
            style={{
              backgroundColor: '#c9a84c',
              color: '#0a0f1e',
              animation: 'badgePulse 1.5s ease-in-out infinite',
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {dropdownOpen && (
        <div
          className="absolute top-full right-0 mt-2 w-80 rounded-xl shadow-xl z-50 border border-[#1a2540] overflow-hidden"
          style={{ background: '#0d1628' }}
        >
          <div className="p-4 border-b border-[#1a2540]/50">
            <h4
              className="font-bold text-sm"
              style={{ color: '#ffffff', fontFamily: 'var(--font-tajawal), sans-serif' }}
            >
              الإشعارات
            </h4>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loadingList ? (
              <div className="p-6 text-center">
                <span style={{ color: '#64748b', fontFamily: 'var(--font-tajawal), sans-serif' }}>
                  جاري التحميل...
                </span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center">
                <span style={{ color: '#64748b', fontFamily: 'var(--font-tajawal), sans-serif' }}>
                  لا توجد إشعارات جديدة
                </span>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  role="button"
                  tabIndex={0}
                  className="py-3 px-4 border-b border-[#1a2540]/50 last:border-b-0 cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: '#ffffff', fontFamily: 'var(--font-tajawal), sans-serif' }}
                  >
                    {n.message}
                  </p>
                  <span
                    className="text-xs mt-1 block"
                    style={{ color: '#64748b', fontFamily: 'var(--font-tajawal), sans-serif' }}
                  >
                    {timeAgo(n.created_at)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
