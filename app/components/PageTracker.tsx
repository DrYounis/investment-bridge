'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTracker() {
  const pathname = usePathname();
  const lastPath = useRef('');

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return;
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;

    const body = JSON.stringify({ path: pathname, referrer: document.referrer || undefined });
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }));
      } else {
        fetch('/api/track', { method: 'POST', body, keepalive: true }).catch(() => {});
      }
    } catch {
      // silently fail — tracking must never break navigation
    }
  }, [pathname]);

  return null;
}
