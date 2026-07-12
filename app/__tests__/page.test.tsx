import { render, screen } from '@testing-library/react'
import Home from '../page'

// Mock child components
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

jest.mock('@/app/components/PortfolioTeaser', () => ({
  __esModule: true,
  default: () => <div data-testid="portfolio-teaser">PortfolioTeaser</div>,
}))

describe('Home', () => {
  it('renders the main heading', () => {
    render(<Home />)

    expect(screen.getByText(/الطموحات/)).toBeInTheDocument()
    const marfaElements = screen.getAllByText(/مرفأ/)
    expect(marfaElements.length).toBeGreaterThan(0)
  })

  it('renders the ship hero component', () => {
    render(<Home />)

    expect(screen.getByTestId('ship-hero')).toBeInTheDocument()
  })

  it('has proper RTL direction', () => {
    const { container } = render(<Home />)

    const mainDiv = container.querySelector('div[dir="rtl"]')
    expect(mainDiv).toBeInTheDocument()
  })
})
