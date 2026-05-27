/**
 * Simple in-memory rate limiter for API routes.
 * Tracks requests per IP within a sliding window.
 * Suitable for single-instance Vercel deployments.
 */

interface RateEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit(
  ip: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const key = `rate:${ip}`;

  let entry = store.get(key);

  // Reset if window expired
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + config.windowMs };
    store.set(key, entry);
  }

  entry.count++;

  return {
    allowed: entry.count <= config.maxRequests,
    remaining: Math.max(0, config.maxRequests - entry.count),
    resetAt: entry.resetAt,
  };
}

/**
 * Extract client IP from Next.js request headers.
 * Handles Vercel's x-forwarded-for and x-real-ip headers.
 */
export function getClientIP(request: Request): string {
  const headers = request.headers;
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs; first is the client
    return forwarded.split(',')[0].trim();
  }
  const realIP = headers.get('x-real-ip');
  if (realIP) return realIP;
  return '127.0.0.1';
}

/**
 * Validate that the request origin is marfa.sa (or localhost for dev).
 */
export function isValidOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const host = request.headers.get('host') || '';

  // Allow localhost in development
  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    return true;
  }

  // Check origin header
  if (origin) {
    try {
      const url = new URL(origin);
      if (url.hostname === 'marfa.sa' || url.hostname.endsWith('.marfa.sa')) {
        return true;
      }
      // Also allow vercel preview deployments
      if (url.hostname.endsWith('.vercel.app')) {
        return true;
      }
    } catch {
      // Invalid URL, fall through
    }
  }

  // Check referer header as fallback
  if (referer) {
    try {
      const url = new URL(referer);
      if (url.hostname === 'marfa.sa' || url.hostname.endsWith('.marfa.sa')) {
        return true;
      }
      if (url.hostname.endsWith('.vercel.app')) {
        return true;
      }
    } catch {
      // Invalid URL, fall through
    }
  }

  return false;
}
