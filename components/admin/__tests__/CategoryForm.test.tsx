import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CategoryForm from '../CategoryForm'

// Mock next/navigation
const mockPush = jest.fn()
const mockBack = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}))

// Mock ImageUpload
jest.mock('../ImageUpload', () => {
  return function MockImageUpload({ value, onChange, label, error }: any) {
    return (
      <div>
        <label>{label}</label>
        <input
          data-testid="image-upload"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {error && <span>{error}</span>}
      </div>
    )
  }
})

// Mock fetch
global.fetch = jest.fn()

// Mock window.location
delete (window as any).location
;(window as any).location = { href: jest.fn() }

describe('CategoryForm', () => {
  const mockCategory = {
    id: 1,
    name: 'Test Category',
    slug: 'test-category',
    image_url: 'https://example.com/image.jpg'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Create Mode', () => {
    it('should render form in create mode', () => {
      render(<CategoryForm mode="create" />)
      expect(screen.getByText('Crear Categoría')).toBeInTheDocument()
    })

    it('should have empty fields in create mode', () => {
      render(<CategoryForm mode="create" />)
      const nameInput = screen.getByLabelText(/Nombre/) as HTMLInputElement
      expect(nameInput.value).toBe('')
    })

    it('should have create button', () => {
      render(<CategoryForm mode="create" />)
      expect(screen.getByText('Crear Categoría')).toBeInTheDocument()
    })
  })

  describe('Edit Mode', () => {
    it('should render form in edit mode', () => {
      render(<CategoryForm mode="edit" category={mockCategory} />)
      expect(screen.getByText('Actualizar Categoría')).toBeInTheDocument()
    })

    it('should populate fields with category data', () => {
      render(<CategoryForm mode="edit" category={mockCategory} />)
      const nameInput = screen.getByLabelText(/Nombre/) as HTMLInputElement
      expect(nameInput.value).toBe('Test Category')
    })

    it('should have update button', () => {
      render(<CategoryForm mode="edit" category={mockCategory} />)
      expect(screen.getByText('Actualizar Categoría')).toBeInTheDocument()
    })
  })

  describe('Form Fields', () => {
    it('should render name input', () => {
      render(<CategoryForm mode="create" />)
      expect(screen.getByLabelText(/Nombre/)).toBeInTheDocument()
    })

    it('should render slug input', () => {
      render(<CategoryForm mode="create" />)
      expect(screen.getByLabelText(/Slug/)).toBeInTheDocument()
    })

    it('should render image upload', () => {
      render(<CategoryForm mode="create" />)
      expect(screen.getByTestId('image-upload')).toBeInTheDocument()
    })

    it('should update name field', () => {
      render(<CategoryForm mode="create" />)
      const nameInput = screen.getByLabelText(/Nombre/) as HTMLInputElement
      fireEvent.change(nameInput, { target: { value: 'New Category' } })
      expect(nameInput.value).toBe('New Category')
    })

    it('should auto-generate slug from name', () => {
      render(<CategoryForm mode="create" />)
      const nameInput = screen.getByLabelText(/Nombre/)
      const slugInput = screen.getByLabelText(/Slug/) as HTMLInputElement
      
      fireEvent.change(nameInput, { target: { value: 'My Category' } })
      expect(slugInput.value).toBe('my-category')
    })
  })

  describe('Validation', () => {
    it('should have required attribute on name input', () => {
      render(<CategoryForm mode="create" />)
      const nameInput = screen.getByLabelText(/Nombre/) as HTMLInputElement
      expect(nameInput).toHaveAttribute('required')
    })

    it('should not submit when name is empty', async () => {
      render(<CategoryForm mode="create" />)
      
      fireEvent.click(screen.getByText('Crear Categoría'))
      
      await waitFor(() => {
        expect(global.fetch).not.toHaveBeenCalled()
      })
    })
  })

  describe('Form Submission', () => {
    it('should submit form with valid data in create mode', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      })

      render(<CategoryForm mode="create" />)
      
      fireEvent.change(screen.getByLabelText(/Nombre/), { target: { value: 'New Category' } })
      fireEvent.click(screen.getByText('Crear Categoría'))
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/admin/categories',
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          })
        )
      })
    })

    it('should submit form with valid data in edit mode', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      })

      render(<CategoryForm mode="edit" category={mockCategory} />)
      
      fireEvent.change(screen.getByLabelText(/Nombre/), { target: { value: 'Updated Name' } })
      fireEvent.click(screen.getByText('Actualizar Categoría'))
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/admin/categories/1',
          expect.objectContaining({
            method: 'PUT',
          })
        )
      })
    })

    it('should show loading state while submitting', async () => {
      ;(global.fetch as jest.Mock).mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({ ok: true, json: async () => ({}) }), 100))
      )

      render(<CategoryForm mode="create" />)
      
      fireEvent.change(screen.getByLabelText(/Nombre/), { target: { value: 'Test' } })
      fireEvent.click(screen.getByText('Crear Categoría'))
      
      await waitFor(() => {
        expect(screen.getByText('Guardando...')).toBeInTheDocument()
      })
    })

    it('should handle submission error', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Server error' })
      })

      render(<CategoryForm mode="create" />)
      
      fireEvent.change(screen.getByLabelText(/Nombre/), { target: { value: 'Test' } })
      fireEvent.click(screen.getByText('Crear Categoría'))
      
      await waitFor(() => {
        expect(screen.getByText('Server error')).toBeInTheDocument()
      })
    })
  })

  describe('Cancel Button', () => {
    it('should have cancel button', () => {
      render(<CategoryForm mode="create" />)
      expect(screen.getByText('Cancelar')).toBeInTheDocument()
    })

    it('should call router.back when clicking cancel', () => {
      render(<CategoryForm mode="create" />)
      fireEvent.click(screen.getByText('Cancelar'))
      expect(mockBack).toHaveBeenCalled()
    })
  })
})

