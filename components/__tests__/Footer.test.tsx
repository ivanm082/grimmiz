import { render, screen } from '@testing-library/react'
import Footer from '../Footer'

// Mock Next.js Link
jest.mock('next/link', () => {
  const MockLink = ({ children, href, className }: any) => {
    return <a href={href} className={className}>{children}</a>
  }
  MockLink.displayName = 'MockLink'
  return MockLink
})

describe('Footer', () => {
  describe('About Section', () => {
    it('should render Grimmiz heading', () => {
      render(<Footer />)
      expect(screen.getByText('Grimmiz')).toBeInTheDocument()
    })

    it('should render about description', () => {
      render(<Footer />)
      expect(screen.getByText(/Tu tienda de manualidades hechas a mano/)).toBeInTheDocument()
    })

    it('should have social media links', () => {
      const { container } = render(<Footer />)
      const socialLinks = container.querySelectorAll('a[target="_blank"]')
      expect(socialLinks.length).toBeGreaterThanOrEqual(3)
    })
  })

  describe('Social Media Links', () => {
    it('should have Instagram link', () => {
      const { container } = render(<Footer />)
      const instagramLink = container.querySelector('a[href="https://instagram.com"]')
      expect(instagramLink).toBeInTheDocument()
      expect(instagramLink).toHaveAttribute('aria-label', 'Instagram')
    })

    it('should have Facebook link', () => {
      const { container } = render(<Footer />)
      const facebookLink = container.querySelector('a[href="https://facebook.com"]')
      expect(facebookLink).toBeInTheDocument()
      expect(facebookLink).toHaveAttribute('aria-label', 'Facebook')
    })

    it('should have Pinterest link', () => {
      const { container } = render(<Footer />)
      const pinterestLink = container.querySelector('a[href="https://pinterest.com"]')
      expect(pinterestLink).toBeInTheDocument()
      expect(pinterestLink).toHaveAttribute('aria-label', 'Pinterest')
    })

    it('should open social links in new tab', () => {
      const { container } = render(<Footer />)
      const socialLinks = container.querySelectorAll('a[target="_blank"]')
      
      socialLinks.forEach(link => {
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      })
    })

    it('should have social media icons', () => {
      const { container } = render(<Footer />)
      const socialIcons = container.querySelectorAll('a[target="_blank"] svg')
      expect(socialIcons.length).toBe(3)
    })
  })

  describe('Quick Links Section', () => {
    it('should render "Enlaces Rápidos" heading', () => {
      render(<Footer />)
      expect(screen.getByText('Enlaces Rápidos')).toBeInTheDocument()
    })

    it('should have link to home page', () => {
      const { container } = render(<Footer />)
      const quickLinks = container.querySelectorAll('ul')[0]
      const homeLink = quickLinks.querySelector('a[href="/"]')
      expect(homeLink).toBeInTheDocument()
      expect(homeLink?.textContent).toContain('Inicio')
    })

    it('should have link to Mundo Grimmiz', () => {
      const { container } = render(<Footer />)
      const mundoLink = container.querySelector('a[href="/mundo-grimmiz"]')
      expect(mundoLink).toBeInTheDocument()
    })

    it('should have link to Diario Grimmiz', () => {
      const { container } = render(<Footer />)
      const diarioLink = container.querySelector('a[href="/diario-grimmiz"]')
      expect(diarioLink).toBeInTheDocument()
    })

    it('should have link to Contacto', () => {
      const { container } = render(<Footer />)
      const contactLinks = container.querySelectorAll('a[href="/contacto"]')
      expect(contactLinks.length).toBeGreaterThan(0)
    })

    it('should have hover effects on quick links', () => {
      const { container } = render(<Footer />)
      const quickLinks = container.querySelectorAll('ul')[0].querySelectorAll('a')
      
      quickLinks.forEach(link => {
        expect(link.className).toContain('hover:text-white')
        expect(link.className).toContain('transition-colors')
      })
    })
  })

  describe('Legal Links Section', () => {
    it('should render "Legal" heading', () => {
      render(<Footer />)
      expect(screen.getByText('Legal')).toBeInTheDocument()
    })

    it('should have privacy policy link', () => {
      const { container } = render(<Footer />)
      const privacyLink = container.querySelector('a[href="/politica-privacidad"]')
      expect(privacyLink).toBeInTheDocument()
      expect(privacyLink?.textContent).toContain('Política de Privacidad')
    })

    it('should have cookies policy link', () => {
      const { container } = render(<Footer />)
      const cookiesLink = container.querySelector('a[href="/politica-cookies"]')
      expect(cookiesLink).toBeInTheDocument()
      expect(cookiesLink?.textContent).toContain('Política de Cookies')
    })

    it('should have terms of use link', () => {
      const { container } = render(<Footer />)
      const termsLink = container.querySelector('a[href="/condiciones-uso"]')
      expect(termsLink).toBeInTheDocument()
      expect(termsLink?.textContent).toContain('Condiciones de Uso')
    })
  })

  describe('Copyright Section', () => {
    it('should render copyright text', () => {
      render(<Footer />)
      expect(screen.getByText(/Grimmiz. Todos los derechos reservados/)).toBeInTheDocument()
    })

    it('should display current year', () => {
      render(<Footer />)
      const currentYear = new Date().getFullYear()
      expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument()
    })

    it('should have copyright symbol', () => {
      render(<Footer />)
      expect(screen.getByText(/©/)).toBeInTheDocument()
    })
  })

  describe('Styling and Layout', () => {
    it('should have dark background', () => {
      const { container } = render(<Footer />)
      const footer = container.querySelector('footer')
      expect(footer?.className).toContain('bg-gray-900')
    })

    it('should have light text color', () => {
      const { container } = render(<Footer />)
      const footer = container.querySelector('footer')
      expect(footer?.className).toContain('text-gray-300')
    })

    it('should have grid layout for sections', () => {
      const { container } = render(<Footer />)
      const grid = container.querySelector('.grid')
      expect(grid).toBeInTheDocument()
      expect(grid?.className).toContain('md:grid-cols-4')
    })

    it('should have border top on copyright section', () => {
      const { container } = render(<Footer />)
      const copyrightSection = container.querySelector('.border-t.border-gray-800')
      expect(copyrightSection).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('should have responsive grid columns', () => {
      const { container } = render(<Footer />)
      const grid = container.querySelector('.grid')
      expect(grid?.className).toContain('grid-cols-1')
      expect(grid?.className).toContain('md:grid-cols-4')
    })

    it('should have responsive spacing', () => {
      const { container } = render(<Footer />)
      const mainContainer = container.querySelector('.container')
      expect(mainContainer?.className).toContain('px-4')
      expect(mainContainer?.className).toContain('py-12')
    })
  })

  describe('Accessibility', () => {
    it('should have semantic footer element', () => {
      const { container } = render(<Footer />)
      const footer = container.querySelector('footer')
      expect(footer).toBeInTheDocument()
    })

    it('should have proper heading hierarchy', () => {
      const { container } = render(<Footer />)
      const h3 = container.querySelector('h3')
      const h4s = container.querySelectorAll('h4')
      
      expect(h3).toBeInTheDocument()
      expect(h4s.length).toBeGreaterThanOrEqual(2)
    })

    it('should have aria-labels on social links', () => {
      const { container } = render(<Footer />)
      const instagramLink = container.querySelector('a[href="https://instagram.com"]')
      const facebookLink = container.querySelector('a[href="https://facebook.com"]')
      const pinterestLink = container.querySelector('a[href="https://pinterest.com"]')
      
      expect(instagramLink).toHaveAttribute('aria-label')
      expect(facebookLink).toHaveAttribute('aria-label')
      expect(pinterestLink).toHaveAttribute('aria-label')
    })
  })
})




