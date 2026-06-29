import { render, screen } from '@testing-library/react'
import Home from '../page'

// Mock the createClient from supabase/server
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() =>
    Promise.resolve({
      auth: {
        getUser: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      },
    })
  ),
}))

// Mock child components that may have external dependencies
jest.mock('@/app/components/ShipHero', () => ({
  __esModule: true,
  default: () => <div data-testid="ship-hero">ShipHero</div>,
}))

jest.mock('@/app/components/AuthAwarePathway', () => ({
  __esModule: true,
  default: () => <div data-testid="auth-pathway">AuthAwarePathway</div>,
}))

jest.mock('@/app/components/AuthAwareLinks', () => ({
  __esModule: true,
  default: () => <div data-testid="auth-links">AuthAwareLinks</div>,
}))

describe('Home', () => {
  it('renders the main heading', async () => {
    render(await Home())

    expect(screen.getByText(/الطموحات/)).toBeInTheDocument()
    const marfaElements = screen.getAllByText(/مرفأ/)
    expect(marfaElements.length).toBeGreaterThan(0)
  })

  it('renders the ship hero component', async () => {
    render(await Home())

    expect(screen.getByTestId('ship-hero')).toBeInTheDocument()
  })

  it('has proper RTL direction', async () => {
    const { container } = render(await Home())

    const mainDiv = container.querySelector('div[dir="rtl"]')
    expect(mainDiv).toBeInTheDocument()
  })
})
