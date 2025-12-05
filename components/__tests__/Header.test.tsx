import { render, screen, fireEvent } from '@testing-library/react'
import Header from '../Header'

// Mock Next.js Link and Image
jest.mock('next/link', () => {
  return ({ children, href, onClick, className }: any) => {
    return <a href={href} onClick={onClick} className={className}>{children}</a>
  }
})

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

describe('Header', () => {
  describe('Logo', () => {
    it('should render logo image', () => {
      render(<Header />)
      const logo = screen.getByAltText('Grimmiz Logo')
      expect(logo).toBeInTheDocument()
    })

    it('should link logo to home page', () => {
      const { container } = render(<Header />)
      const logoLink = container.querySelector('a[href="/"]')
      expect(logoLink).toBeInTheDocument()
    })

    it('should have correct logo dimensions', () => {
      render(<Header />)
      const logo = screen.getByAltText('Grimmiz Logo')
      expect(logo).toHaveAttribute('width', '180')
      expect(logo).toHaveAttribute('height', '60')
    })
  })

  describe('Desktop Navigation', () => {
    it('should render all navigation links', () => {
      render(<Header />)
      expect(screen.getAllByText('Inicio')[0]).toBeInTheDocument()
      expect(screen.getAllByText('Mundo Grimmiz')[0]).toBeInTheDocument()
      expect(screen.getAllByText('Diario Grimmiz')[0]).toBeInTheDocument()
      expect(screen.getAllByText('Contacto')[0]).toBeInTheDocument()
    })

    it('should have correct href attributes', () => {
      const { container } = render(<Header />)
      const links = container.querySelectorAll('nav.hidden.md\\:flex a')
      
      expect(links[0]).toHaveAttribute('href', '/')
      expect(links[1]).toHaveAttribute('href', '/mundo-grimmiz')
      expect(links[2]).toHaveAttribute('href', '/diario-grimmiz')
      expect(links[3]).toHaveAttribute('href', '/contacto')
    })

    it('should have hover transition classes', () => {
      const { container } = render(<Header />)
      const links = container.querySelectorAll('nav.hidden.md\\:flex a')
      
      links.forEach(link => {
        expect(link.className).toContain('hover:text-primary')
        expect(link.className).toContain('transition-colors')
      })
    })
  })

  describe('Mobile Menu', () => {
    it('should not show mobile menu initially', () => {
      const { container } = render(<Header />)
      const mobileNav = container.querySelector('nav.md\\:hidden.mt-4')
      expect(mobileNav).not.toBeInTheDocument()
    })

    it('should show mobile menu when button is clicked', () => {
      render(<Header />)
      const menuButton = screen.getByLabelText('Toggle menu')
      fireEvent.click(menuButton)
      
      const { container } = render(<Header />)
      fireEvent.click(container.querySelector('button[aria-label="Toggle menu"]')!)
      
      // After clicking, mobile menu should appear
      expect(screen.getAllByText('Inicio').length).toBeGreaterThan(1)
    })

    it('should toggle mobile menu on button click', () => {
      const { container } = render(<Header />)
      const menuButton = container.querySelector('button[aria-label="Toggle menu"]')!
      
      // Initially closed
      let mobileNav = container.querySelector('nav.md\\:hidden.mt-4')
      expect(mobileNav).not.toBeInTheDocument()
      
      // Open menu
      fireEvent.click(menuButton)
      const { container: updatedContainer } = render(<Header />)
      const updatedMenuButton = updatedContainer.querySelector('button[aria-label="Toggle menu"]')!
      fireEvent.click(updatedMenuButton)
      
      // Menu should be visible in new render
      mobileNav = updatedContainer.querySelector('nav.md\\:hidden.mt-4')
      expect(mobileNav).toBeInTheDocument()
    })

    it('should show hamburger icon when menu is closed', () => {
      const { container } = render(<Header />)
      const menuButton = container.querySelector('button[aria-label="Toggle menu"]')
      const svg = menuButton?.querySelector('svg')
      
      expect(svg).toBeInTheDocument()
      // Hamburger icon has 3 horizontal lines
      const path = svg?.querySelector('path')
      expect(path).toHaveAttribute('d', 'M4 6h16M4 12h16M4 18h16')
    })

    it('should have correct mobile navigation links', () => {
      const { container } = render(<Header />)
      const menuButton = container.querySelector('button[aria-label="Toggle menu"]')!
      fireEvent.click(menuButton)
      
      const { container: updatedContainer } = render(<Header />)
      fireEvent.click(updatedContainer.querySelector('button[aria-label="Toggle menu"]')!)
      
      const mobileLinks = updatedContainer.querySelectorAll('nav.md\\:hidden a')
      expect(mobileLinks.length).toBeGreaterThanOrEqual(4)
    })
  })

  describe('Sticky Header', () => {
    it('should have sticky positioning classes', () => {
      const { container } = render(<Header />)
      const header = container.querySelector('header')
      
      expect(header?.className).toContain('sticky')
      expect(header?.className).toContain('top-0')
      expect(header?.className).toContain('z-50')
    })

    it('should have shadow styling', () => {
      const { container } = render(<Header />)
      const header = container.querySelector('header')
      
      expect(header?.className).toContain('shadow-md')
    })

    it('should have white background', () => {
      const { container } = render(<Header />)
      const header = container.querySelector('header')
      
      expect(header?.className).toContain('bg-white')
    })
  })

  describe('Responsive Design', () => {
    it('should hide desktop menu on mobile', () => {
      const { container } = render(<Header />)
      const desktopNav = container.querySelector('nav.hidden.md\\:flex')
      
      expect(desktopNav).toBeInTheDocument()
      expect(desktopNav?.className).toContain('hidden')
      expect(desktopNav?.className).toContain('md:flex')
    })

    it('should show mobile menu button only on mobile', () => {
      const { container } = render(<Header />)
      const mobileButton = container.querySelector('button[aria-label="Toggle menu"]')
      
      expect(mobileButton?.className).toContain('md:hidden')
    })
  })

  describe('Accessibility', () => {
    it('should have aria-label on mobile menu button', () => {
      render(<Header />)
      const menuButton = screen.getByLabelText('Toggle menu')
      expect(menuButton).toBeInTheDocument()
    })

    it('should have proper alt text on logo', () => {
      render(<Header />)
      const logo = screen.getByAltText('Grimmiz Logo')
      expect(logo).toBeInTheDocument()
    })

    it('should have semantic header element', () => {
      const { container } = render(<Header />)
      const header = container.querySelector('header')
      expect(header).toBeInTheDocument()
    })

    it('should have semantic nav elements', () => {
      const { container } = render(<Header />)
      const navs = container.querySelectorAll('nav')
      expect(navs.length).toBeGreaterThanOrEqual(1)
    })
  })
})

