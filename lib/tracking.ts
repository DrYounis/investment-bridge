// Client-side event tracking. Fire-and-forget; must never throw or break the UI.
// Posts to /api/track which stores events in page_views (event_name/event_data/variant).

export function trackEvent(
  event: string,
  data?: Record<string, unknown>,
  variant?: string,
): void {
  if (typeof window === 'undefined') return;

  const payload: Record<string, unknown> = {
    path: window.location.pathname,
    event,
  };
  if (data) payload.event_data = data;
  if (variant) payload.variant = variant;

  try {
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }));
    } else {
      fetch('/api/track', { method: 'POST', body, keepalive: true }).catch(() => {});
    }
  } catch {
    // silently ignore — tracking must never affect the user experience
  }
}
