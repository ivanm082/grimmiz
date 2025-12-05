import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CategoriesTable from '../CategoriesTable'

// Mock next/navigation
const mockRefresh = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: mockRefresh,
  }),
}))

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href, className }: any) => {
    return <a href={href} className={className}>{children}</a>
  }
})

// Mock OptimizedImage
jest.mock('@/components/OptimizedImage', () => {
  return function MockOptimizedImage({ src, alt }: any) {
    return <img src={src} alt={alt} data-testid="optimized-image" />
  }
})

// Mock window.confirm
global.confirm = jest.fn()

describe('CategoriesTable', () => {
  const mockCategories = [
    {
      id: 1,
      name: 'Category 1',
      slug: 'category-1',
      image_url: 'https://example.com/cat1.jpg',
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 2,
      name: 'Category 2',
      slug: 'category-2',
      image_url: null,
      created_at: '2024-01-02T00:00:00Z'
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Empty State', () => {
    it('should show empty state when no categories', () => {
      render(<CategoriesTable categories={[]} />)
      expect(screen.getByText('No hay categorías creadas')).toBeInTheDocument()
    })

    it('should have link to create first category', () => {
      render(<CategoriesTable categories={[]} />)
      const link = screen.getByText('Crear primera categoría')
      expect(link.closest('a')).toHaveAttribute('href', '/admin/categories/new')
    })
  })

  describe('Table Rendering', () => {
    it('should render table with categories', () => {
      render(<CategoriesTable categories={mockCategories} />)
      expect(screen.getByText('Category 1')).toBeInTheDocument()
      expect(screen.getByText('Category 2')).toBeInTheDocument()
    })

    it('should render table headers', () => {
      render(<CategoriesTable categories={mockCategories} />)
      expect(screen.getByText('Imagen')).toBeInTheDocument()
      expect(screen.getByText('Nombre')).toBeInTheDocument()
      expect(screen.getByText('Slug')).toBeInTheDocument()
      expect(screen.getByText('Acciones')).toBeInTheDocument()
    })

    it('should display category slugs', () => {
      render(<CategoriesTable categories={mockCategories} />)
      expect(screen.getByText('category-1')).toBeInTheDocument()
      expect(screen.getByText('category-2')).toBeInTheDocument()
    })

    it('should render images when available', () => {
      render(<CategoriesTable categories={mockCategories} />)
      const images = screen.getAllByTestId('optimized-image')
      expect(images.length).toBeGreaterThan(0)
    })
  })

  describe('Actions', () => {
    it('should have edit button for each category', () => {
      const { container } = render(<CategoriesTable categories={mockCategories} />)
      const editButtons = container.querySelectorAll('[title="Editar"]')
      expect(editButtons).toHaveLength(2)
    })

    it('should have delete button for each category', () => {
      const { container } = render(<CategoriesTable categories={mockCategories} />)
      const deleteButtons = container.querySelectorAll('[title="Eliminar"]')
      expect(deleteButtons).toHaveLength(2)
    })

    it('should link to edit page', () => {
      const { container } = render(<CategoriesTable categories={mockCategories} />)
      const editLinks = container.querySelectorAll('a[href*="/admin/categories/"]')
      expect(editLinks.length).toBeGreaterThan(0)
    })
  })

  describe('Delete Functionality', () => {
    it('should show confirmation dialog when deleting', () => {
      ;(global.confirm as jest.Mock).mockReturnValue(false)
      
      const { container } = render(<CategoriesTable categories={mockCategories} />)
      const deleteButtons = container.querySelectorAll('[title="Eliminar"]')
      fireEvent.click(deleteButtons[0])
      
      expect(global.confirm).toHaveBeenCalledWith(
        '¿Estás seguro de que quieres eliminar esta categoría?'
      )
    })

    it('should not delete if user cancels confirmation', () => {
      ;(global.confirm as jest.Mock).mockReturnValue(false)
      global.fetch = jest.fn()
      
      const { container } = render(<CategoriesTable categories={mockCategories} />)
      const deleteButtons = container.querySelectorAll('[title="Eliminar"]')
      fireEvent.click(deleteButtons[0])
      
      expect(global.fetch).not.toHaveBeenCalled()
    })
  })

  describe('Responsive Design', () => {
    it('should have table with overflow wrapper', () => {
      const { container } = render(<CategoriesTable categories={mockCategories} />)
      const wrapper = container.querySelector('.overflow-hidden')
      expect(wrapper).toBeInTheDocument()
    })

    it('should have proper table styling', () => {
      const { container } = render(<CategoriesTable categories={mockCategories} />)
      const table = container.querySelector('table')
      expect(table?.className).toContain('min-w-full')
    })
  })

  describe('Edge Cases', () => {
    it('should handle categories without images', () => {
      render(<CategoriesTable categories={mockCategories} />)
      expect(screen.getByText('Category 2')).toBeInTheDocument()
    })

    it('should handle single category', () => {
      render(<CategoriesTable categories={[mockCategories[0]]} />)
      expect(screen.getByText('Category 1')).toBeInTheDocument()
      expect(screen.queryByText('Category 2')).not.toBeInTheDocument()
    })

    it('should render all categories', () => {
      const manyCategories = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `Category ${i + 1}`,
        slug: `category-${i + 1}`,
        image_url: null,
        created_at: '2024-01-01T00:00:00Z'
      }))
      
      render(<CategoriesTable categories={manyCategories} />)
      expect(screen.getByText('Category 1')).toBeInTheDocument()
      expect(screen.getByText('Category 10')).toBeInTheDocument()
    })
  })
})

