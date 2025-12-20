import { render, screen, fireEvent } from '@testing-library/react'
import ProductFilters from '../ProductFilters'

// Mock Next.js router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock Next.js Link
jest.mock('next/link', () => {
  const MockLink = ({ children, href, className }: any) => {
    return <a href={href} className={className}>{children}</a>
  }
  MockLink.displayName = 'MockLink'
  return MockLink
})

describe('ProductFilters', () => {
  const mockCategories = [
    { id: 1, name: 'Figuras de Resina', slug: 'figuras-de-resina' },
    { id: 2, name: 'Láminas', slug: 'laminas' },
    { id: 3, name: 'Otros', slug: 'otros' },
  ]

  const mockTag = {
    id: 1,
    name: 'Timo',
    slug: 'timo',
  }

  beforeEach(() => {
    mockPush.mockClear()
  })

  describe('Categories', () => {
    it('should render all categories', () => {
      render(
        <ProductFilters
          categories={mockCategories}
          currentSort="recientes"
        />
      )

      expect(screen.getByText('Figuras de Resina')).toBeInTheDocument()
      expect(screen.getByText('Láminas')).toBeInTheDocument()
      expect(screen.getByText('Otros')).toBeInTheDocument()
    })

    it('should render "Todas" option', () => {
      render(
        <ProductFilters
          categories={mockCategories}
          currentSort="recientes"
        />
      )

      expect(screen.getByText('Todas')).toBeInTheDocument()
    })

    it('should highlight current category', () => {
      const { container } = render(
        <ProductFilters
          categories={mockCategories}
          currentCategory="figuras-de-resina"
          currentSort="recientes"
        />
      )

      const activeLink = container.querySelector('a[href*="figuras-de-resina"]')
      expect(activeLink?.className).toContain('bg-primary')
      expect(activeLink?.className).toContain('text-white')
    })

    it('should highlight "Todas" when no category selected', () => {
      const { container } = render(
        <ProductFilters
          categories={mockCategories}
          currentSort="recientes"
        />
      )

      const todasLink = screen.getByText('Todas').closest('a')
      expect(todasLink?.className).toContain('bg-primary')
    })

    it('should have correct href for category links', () => {
      const { container } = render(
        <ProductFilters
          categories={mockCategories}
          currentSort="recientes"
        />
      )

      const link = container.querySelector('a[href*="figuras-de-resina"]')
      expect(link).toHaveAttribute('href', '/mundo-grimmiz/figuras-de-resina/')
    })
  })

  describe('Tag Filter', () => {
    it('should not show tag filter when no tag selected', () => {
      render(
        <ProductFilters
          categories={mockCategories}
          currentSort="recientes"
        />
      )

      expect(screen.queryByText('Etiqueta:')).not.toBeInTheDocument()
    })

    it('should show tag filter when tag is selected', () => {
      render(
        <ProductFilters
          categories={mockCategories}
          currentTag={mockTag}
          currentSort="recientes"
        />
      )

      expect(screen.getByText('Etiqueta:')).toBeInTheDocument()
      expect(screen.getByText('Timo')).toBeInTheDocument()
    })

    it('should remove tag filter when close button is clicked', () => {
      render(
        <ProductFilters
          categories={mockCategories}
          currentTag={mockTag}
          currentSort="recientes"
        />
      )

      const removeButton = screen.getByText('Timo').closest('button')
      fireEvent.click(removeButton!)

      expect(mockPush).toHaveBeenCalledWith('/mundo-grimmiz/')
    })

    it('should keep category when removing tag', () => {
      render(
        <ProductFilters
          categories={mockCategories}
          currentCategory="figuras-de-resina"
          currentTag={mockTag}
          currentSort="recientes"
        />
      )

      const removeButton = screen.getByText('Timo').closest('button')
      fireEvent.click(removeButton!)

      expect(mockPush).toHaveBeenCalledWith('/mundo-grimmiz/figuras-de-resina/')
    })

    it('should have tag icon', () => {
      const { container } = render(
        <ProductFilters
          categories={mockCategories}
          currentTag={mockTag}
          currentSort="recientes"
        />
      )

      const svgs = container.querySelectorAll('svg')
      expect(svgs.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Sort Filter', () => {
    it('should render sort dropdown', () => {
      render(
        <ProductFilters
          categories={mockCategories}
          currentSort="recientes"
        />
      )

      expect(screen.getByLabelText('Ordenar por:')).toBeInTheDocument()
    })

    it('should have all sort options', () => {
      render(
        <ProductFilters
          categories={mockCategories}
          currentSort="recientes"
        />
      )

      expect(screen.getByText('Más recientes')).toBeInTheDocument()
      expect(screen.getByText('Precio: menor a mayor')).toBeInTheDocument()
      expect(screen.getByText('Precio: mayor a menor')).toBeInTheDocument()
    })

    it('should show current sort value', () => {
      render(
        <ProductFilters
          categories={mockCategories}
          currentSort="precio-asc"
        />
      )

      const select = screen.getByLabelText('Ordenar por:') as HTMLSelectElement
      expect(select.value).toBe('precio-asc')
    })

    it('should call router.push when sort changes', () => {
      render(
        <ProductFilters
          categories={mockCategories}
          currentSort="recientes"
        />
      )

      const select = screen.getByLabelText('Ordenar por:')
      fireEvent.change(select, { target: { value: 'precio-asc' } })

      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('orden-precio-asc'))
    })

    it('should reset to page 1 when sort changes', () => {
      render(
        <ProductFilters
          categories={mockCategories}
          currentSort="recientes"
          currentPage={3}
        />
      )

      const select = screen.getByLabelText('Ordenar por:')
      fireEvent.change(select, { target: { value: 'precio-desc' } })

      const calledUrl = mockPush.mock.calls[0][0]
      expect(calledUrl).not.toContain('pagina-3')
    })

    it('should preserve category when changing sort', () => {
      render(
        <ProductFilters
          categories={mockCategories}
          currentCategory="figuras-de-resina"
          currentSort="recientes"
        />
      )

      const select = screen.getByLabelText('Ordenar por:')
      fireEvent.change(select, { target: { value: 'precio-asc' } })

      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('figuras-de-resina')
      )
    })

    it('should preserve tag when changing sort', () => {
      render(
        <ProductFilters
          categories={mockCategories}
          currentTag={mockTag}
          currentSort="recientes"
        />
      )

      const select = screen.getByLabelText('Ordenar por:')
      fireEvent.change(select, { target: { value: 'precio-asc' } })

      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('etiqueta-timo')
      )
    })
  })

  describe('Combined Filters', () => {
    it('should render with category and tag together', () => {
      render(
        <ProductFilters
          categories={mockCategories}
          currentCategory="figuras-de-resina"
          currentTag={mockTag}
          currentSort="recientes"
        />
      )

      expect(screen.getByText('Figuras de Resina')).toBeInTheDocument()
      expect(screen.getByText('Timo')).toBeInTheDocument()
    })

    it('should preserve sort when changing category', () => {
      const { container } = render(
        <ProductFilters
          categories={mockCategories}
          currentSort="precio-desc"
        />
      )

      const categoryLink = container.querySelector('a[href*="figuras-de-resina"]')
      expect(categoryLink).toHaveAttribute('href', expect.stringContaining('orden-precio-desc'))
    })
  })

  describe('Styling and Layout', () => {
    it('should have responsive layout classes', () => {
      const { container } = render(
        <ProductFilters
          categories={mockCategories}
          currentSort="recientes"
        />
      )

      const mainContainer = container.querySelector('.flex.flex-wrap')
      expect(mainContainer).toBeInTheDocument()
    })

    it('should have proper spacing', () => {
      const { container } = render(
        <ProductFilters
          categories={mockCategories}
          currentSort="recientes"
        />
      )

      const wrapper = container.querySelector('.space-y-4')
      expect(wrapper).toBeInTheDocument()
    })

    it('should have hover effects on inactive categories', () => {
      const { container } = render(
        <ProductFilters
          categories={mockCategories}
          currentCategory="figuras-de-resina"
          currentSort="recientes"
        />
      )

      const inactiveLinks = container.querySelectorAll('a.hover\\:bg-gray-200')
      expect(inactiveLinks.length).toBeGreaterThan(0)
    })
  })

  describe('Accessibility', () => {
    it('should have label for sort select', () => {
      render(
        <ProductFilters
          categories={mockCategories}
          currentSort="recientes"
        />
      )

      const label = screen.getByText('Ordenar por:')
      expect(label).toBeInTheDocument()
    })

    it('should have id on sort select matching label', () => {
      render(
        <ProductFilters
          categories={mockCategories}
          currentSort="recientes"
        />
      )

      const select = screen.getByLabelText('Ordenar por:')
      expect(select).toHaveAttribute('id', 'sort-filter')
    })

    it('should have semantic HTML structure', () => {
      const { container } = render(
        <ProductFilters
          categories={mockCategories}
          currentSort="recientes"
        />
      )

      const heading = container.querySelector('h3')
      expect(heading).toBeInTheDocument()
      expect(heading?.textContent).toContain('Categorías')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty categories array', () => {
      render(
        <ProductFilters
          categories={[]}
          currentSort="recientes"
        />
      )

      expect(screen.getByText('Todas')).toBeInTheDocument()
    })

    it('should handle undefined currentCategory', () => {
      render(
        <ProductFilters
          categories={mockCategories}
          currentCategory={undefined}
          currentSort="recientes"
        />
      )

      const todasLink = screen.getByText('Todas').closest('a')
      expect(todasLink?.className).toContain('bg-primary')
    })

    it('should handle null currentTag', () => {
      render(
        <ProductFilters
          categories={mockCategories}
          currentTag={null}
          currentSort="recientes"
        />
      )

      expect(screen.queryByText('Etiqueta:')).not.toBeInTheDocument()
    })
  })
})




