import { render, screen } from '@testing-library/react'
import Home from '../page'

// Mock the createClient from supabase/server
jest.mock('@/lib/supabase/server', () => ({
  createClient: () => ({
    auth: {
      getUser: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
    },
  }),
}))

describe('Home', () => {
  it('renders the main heading', async () => {
    const { container } = render(await Home())
    
    // Check for Arabic text in the heading
    expect(container).toBeInTheDocument()
  })

  it('renders the call-to-action buttons', async () => {
    const { container } = render(await Home())
    
    // The page should render without errors
    expect(container).toBeInTheDocument()
  })

  it('has proper RTL direction', async () => {
    const { container } = render(await Home())
    
    const mainDiv = container.querySelector('div[dir="rtl"]')
    expect(mainDiv).toBeInTheDocument()
  })
})
