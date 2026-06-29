'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { createClient } from '@/lib/supabase/client';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
  }, []);

  async function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);

    if (userId) {
      try {
        await supabase.from('profiles').update({ theme_preference: next }).eq('id', userId);
      } catch {}
    }
  }

  if (!mounted) return <div className="w-10 h-10" />;

  return (
    <button
      onClick={toggle}
      className="w-10 h-10 rounded-full flex items-center justify-center border border-[#1a2540] hover:border-[#c9a84c]/40 transition-all"
      style={{ background: '#0d1628' }}
      aria-label={theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}
    >
      {theme === 'dark' ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
