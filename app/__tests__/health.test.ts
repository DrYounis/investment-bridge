import { GET } from '../api/health/route'

// Mock next/server
jest.mock('next/server', () => {
  const actualNextServer = jest.requireActual('next/server')
  return {
    ...actualNextServer,
    NextResponse: {
      json: jest.fn((data, init) => ({
        ...data,
        _init: init,
        json: () => Promise.resolve(data),
      })),
    },
  }
})

// Mock Supabase
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() =>
    Promise.resolve({
      auth: {
        getUser: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      },
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          limit: jest.fn(() => Promise.resolve({ error: null })),
        })),
      })),
    })
  ),
}))

const { NextResponse } = require('next/server') as { NextResponse: { json: jest.Mock } }

describe('Health API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key'
  })

  it('returns healthy status when all checks pass', async () => {
    await GET()

    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'healthy' }),
      expect.objectContaining({ status: 200 })
    )
  })

  it('returns degraded status when Supabase is unreachable', async () => {
    const { createClient } = await import('@/lib/supabase/server')
    ;(createClient as jest.Mock).mockResolvedValueOnce({
      auth: {
        getUser: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      },
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          limit: jest.fn(() => Promise.resolve({ error: { message: 'fail' } })),
        })),
      })),
    })

    await GET()

    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'degraded' }),
      expect.objectContaining({ status: 503 })
    )
  })

  it('includes timestamp in response', async () => {
    await GET()

    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ timestamp: expect.any(String) }),
      expect.any(Object)
    )
  })
})
