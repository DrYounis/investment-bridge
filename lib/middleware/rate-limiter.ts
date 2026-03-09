import { RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible'
import { NextResponse, type NextRequest } from 'next/server'

// Rate limiter configuration
const RATE_LIMITER_POINTS = 10 // Number of requests
const RATE_LIMITER_DURATION = 60 // Per 60 seconds (1 minute)

// Create rate limiter for API routes
export const apiRateLimiter = new RateLimiterMemory({
  points: RATE_LIMITER_POINTS,
  duration: RATE_LIMITER_DURATION,
  blockDuration: 60, // Block for 1 minute if limit exceeded
})

// Create stricter rate limiter for authentication endpoints
export const authRateLimiter = new RateLimiterMemory({
  points: 5, // 5 attempts
  duration: 300, // Per 5 minutes
  blockDuration: 300, // Block for 5 minutes
})

// Create rate limiter for form submissions
export const formRateLimiter = new RateLimiterMemory({
  points: 3, // 3 submissions
  duration: 60, // Per minute
  blockDuration: 120, // Block for 2 minutes
})

// Get client identifier (IP address or user ID)
function getClientId(request: NextRequest): string {
  // Try to get user ID from request headers (if authenticated)
  const userId = request.headers.get('x-user-id')
  
  // Fall back to IP address
  const forwardedFor = request.headers.get('x-forwarded-for')
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown'
  
  return userId ? `user:${userId}` : `ip:${ip}`
}

// Rate limiter middleware function
export async function withRateLimit(
  request: NextRequest,
  limiter: RateLimiterMemory,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  const clientId = getClientId(request)
  
  try {
    await limiter.consume(clientId)
    return await handler()
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
            'X-RateLimit-Limit': String(limiter.points),
            'X-RateLimit-Remaining': String(error.remainingPoints),
            'X-RateLimit-Reset': String(new Date(Date.now() + error.msBeforeNext).getTime()),
          },
        }
      )
    }
    
    // Re-throw unexpected errors
    throw error
  }
}

// Helper functions for different endpoint types
export const rateLimit = {
  // For general API endpoints
  api: (request: NextRequest, handler: () => Promise<NextResponse>) =>
    withRateLimit(request, apiRateLimiter, handler),
  
  // For authentication endpoints (login, register, etc.)
  auth: (request: NextRequest, handler: () => Promise<NextResponse>) =>
    withRateLimit(request, authRateLimiter, handler),
  
  // For form submissions (contact, meetings, etc.)
  form: (request: NextRequest, handler: () => Promise<NextResponse>) =>
    withRateLimit(request, formRateLimiter, handler),
}
