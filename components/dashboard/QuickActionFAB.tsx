'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const actions = [
  {
    label: 'جمع تمويل',
    path: '/dashboard/funding',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
  {
    label: 'حضور لقاء',
    path: '/dashboard/meetings',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    label: 'تحميل تقرير',
    path: '/dashboard/reports',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
  },
  {
    label: 'غرف الصفقات',
    path: '/dashboard/deals',
    icon: <span className="text-xl">🤝</span>,
  },
];

export default function QuickActionFAB() {
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const fabRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/login');
      else setAuthed(true);
    });
  }, [supabase, router]);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (fabRef.current && !fabRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  if (!authed) return null;

  return (
    <div ref={fabRef} className="fixed bottom-8 right-8 z-50 flex flex-col-reverse items-center gap-3" dir="rtl">
      {/* Action buttons */}
      {actions.map((a, i) => (
        <div
          key={a.label}
          className="relative group"
          style={{
            opacity: open ? 1 : 0,
            transform: open ? `translateY(${-(i + 1) * 60}px)` : 'translateY(0)',
            transition: `transform 200ms ease-out ${(2 - i) * 80}ms, opacity 200ms ease ${(2 - i) * 80}ms`,
            pointerEvents: open ? 'auto' : 'none',
          }}
        >
          <button
            onClick={() => router.push(a.path)}
            className="w-11 h-11 rounded-full flex items-center justify-center border border-[#c9a84c]/50 transition-all duration-200 hover:scale-110"
            style={{ background: '#0d1628' }}
          >
            {a.icon}
          </button>
          <span
            className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{ background: '#0d1628', color: '#c9a84c', fontFamily: 'var(--font-tajawal), sans-serif' }}
          >
            {a.label}
          </span>
        </div>
      ))}

      {/* Main FAB button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300"
        style={{
          background: '#c9a84c',
          color: '#0a0f1e',
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </div>
  );
}
