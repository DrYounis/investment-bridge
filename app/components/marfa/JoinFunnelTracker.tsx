'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/tracking';

export const SIGNUP_SURFACE_KEY = 'marfa_signup_surface';

// Fires the "join_view" funnel event for /join, tagged with the entry surface
// (the `?src=` query param set by upstream registration CTAs), and persists the
// surface so the downstream signup step can attribute the completion.
export default function JoinFunnelTracker() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const surface = params.get('src') || 'direct';
    try {
      sessionStorage.setItem(SIGNUP_SURFACE_KEY, surface);
    } catch {
      // ignore — sessionStorage may be unavailable in private mode
    }
    trackEvent('join_view', { surface });
  }, []);

  return null;
}
