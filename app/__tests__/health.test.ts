import { GET } from '../api/health/route'
import { NextResponse } from 'next/server'

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({ json: () => data, ...init })),
  },
}))

// Mock Supabase client
jest.mock('@/lib/supabase/server', () => ({
  createClient: () => ({
    auth: {
      getUser: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        limit: jest.fn(() => Promise.resolve({ error: null })),
      })),
    })),
  }),
}))

describe('Health API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Set required env vars for tests
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key'
    process.env.STRAVA_CLIENT_ID = 'test-client-id'
    process.env.RESEND_API_KEY = 'test-resend-key'
  })

  it('returns healthy status when all checks pass', async () => {
    const response = await GET()
    
    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'healthy',
        checks: expect.objectContaining({
          supabase: expect.objectContaining({ status: 'ok' }),
          environment: expect.objectContaining({ status: 'ok' }),
        }),
      }),
      expect.any(Object)
    )
  })

  it('returns degraded status when environment variables are missing', async () => {
    delete process.env.RESEND_API_KEY
    
    const response = await GET()
    
    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'degraded',
        checks: expect.objectContaining({
          environment: expect.objectContaining({
            status: 'error',
            missingVars: expect.arrayContaining(['RESEND_API_KEY']),
          }),
        }),
      }),
      expect.any(Object)
    )
  })

  it('includes timestamp and version in response', async () => {
    await GET()
    
    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        timestamp: expect.any(String),
        version: expect.any(String),
      }),
      expect.any(Object)
    )
  })
})
