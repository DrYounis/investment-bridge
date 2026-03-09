import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from './lib/supabase/middleware'
import { RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible'

// Rate limiter configuration
const RATE_LIMIT_ENABLED = process.env.RATE_LIMIT_ENABLED !== 'false'

// Create rate limiters
const apiRateLimiter = new RateLimiterMemory({
  points: 10,
  duration: 60,
  blockDuration: 60,
})

const authRateLimiter = new RateLimiterMemory({
  points: 5,
  duration: 300,
  blockDuration: 300,
})

const formRateLimiter = new RateLimiterMemory({
  points: 3,
  duration: 60,
  blockDuration: 120,
})

// Get client identifier (IP address or user ID)
function getClientId(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown'
  return `ip:${ip}`
}

// Apply rate limiting based on path
async function applyRateLimit(request: NextRequest): Promise<NextResponse | null> {
  if (!RATE_LIMIT_ENABLED) {
    return null
  }

  const clientId = getClientId(request)
  const path = request.nextUrl.pathname

  // Select appropriate rate limiter based on path
  let limiter: RateLimiterMemory
  let points: number

  if (path.startsWith('/api/auth') || path.startsWith('/login') || path.startsWith('/register')) {
    // Stricter limits for auth endpoints
    limiter = authRateLimiter
    points = 5
  } else if (path.startsWith('/api/meetings') || path.startsWith('/meetings')) {
    // Form submissions
    limiter = formRateLimiter
    points = 3
  } else if (path.startsWith('/api')) {
    // General API endpoints
    limiter = apiRateLimiter
    points = 10
  } else {
    // No rate limiting for non-API routes
    return null
  }

  try {
    await limiter.consume(clientId)
    return null
  } catch (error) {
    if (error instanceof RateLimiterRes) {
      const retryAfter = error.msBeforeNext || 60000
      
      return NextResponse.json(
        {
          error: 'Too Many Requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil(retryAfter / 1000),
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil(retryAfter / 1000)),
            'X-RateLimit-Limit': String(points),
            'X-RateLimit-Remaining': String(error.remainingPoints),
            'X-RateLimit-Reset': String(new Date(Date.now() + error.msBeforeNext).getTime()),
          },
        }
      )
    }
    throw error
  }
}

export async function middleware(request: NextRequest) {
  // Apply rate limiting first
  const rateLimitResponse = await applyRateLimit(request)
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  // Then handle session
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
