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

    const searchParams = new URLSearchParams(window.location.search);
    const utm_source = searchParams.get('utm_source');
    const utm_campaign = searchParams.get('utm_campaign');

    const payload: Record<string, string | undefined> = {
      path: pathname,
      referrer: document.referrer || undefined,
    };
    if (utm_source) payload.utm_source = utm_source;
    if (utm_campaign) payload.utm_campaign = utm_campaign;

    const body = JSON.stringify(payload);
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
