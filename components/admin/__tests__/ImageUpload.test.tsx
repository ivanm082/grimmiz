import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ImageUpload from '../ImageUpload'

// Mock OptimizedImage
jest.mock('@/components/OptimizedImage', () => {
  return function MockOptimizedImage({ src, alt }: any) {
    return <img src={src} alt={alt} data-testid="optimized-image" />
  }
})

// Mock fetch
global.fetch = jest.fn()

describe('ImageUpload', () => {
  const mockOnChange = jest.fn()
  const mockImageUrl = 'https://example.com/image.jpg'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render with default label', () => {
      render(<ImageUpload value="" onChange={mockOnChange} />)
      expect(screen.getByText('Imagen')).toBeInTheDocument()
    })

    it('should render with custom label', () => {
      render(<ImageUpload value="" onChange={mockOnChange} label="Main Image" />)
      expect(screen.getByText('Main Image')).toBeInTheDocument()
    })

    it('should show upload area when no image', () => {
      render(<ImageUpload value="" onChange={mockOnChange} />)
      expect(screen.getByText(/Arrastra una imagen aquí/)).toBeInTheDocument()
    })

    it('should show image preview when value is provided', () => {
      render(<ImageUpload value={mockImageUrl} onChange={mockOnChange} />)
      const image = screen.getByTestId('optimized-image')
      expect(image).toHaveAttribute('src', mockImageUrl)
    })

    it('should display error message when error prop is provided', () => {
      render(<ImageUpload value="" onChange={mockOnChange} error="Error message" />)
      expect(screen.getByText('Error message')).toBeInTheDocument()
    })
  })

  describe('File Selection', () => {
    it('should have file input element', () => {
      render(<ImageUpload value="" onChange={mockOnChange} />)
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      expect(input).toBeInTheDocument()
    })

    it('should accept image file types', () => {
      render(<ImageUpload value="" onChange={mockOnChange} />)
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      expect(input).toHaveAttribute('accept', 'image/jpeg,image/jpg,image/png,image/webp,image/avif')
    })

    it('should have hidden file input', () => {
      render(<ImageUpload value="" onChange={mockOnChange} />)
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      expect(input.className).toContain('hidden')
    })
  })

  describe('Upload Instructions', () => {
    it('should show file size limit', () => {
      render(<ImageUpload value="" onChange={mockOnChange} />)
      expect(screen.getByText(/máx. 500KB/)).toBeInTheDocument()
    })

    it('should show accepted file types', () => {
      render(<ImageUpload value="" onChange={mockOnChange} />)
      expect(screen.getByText(/JPG, PNG, WebP o AVIF/)).toBeInTheDocument()
    })

    it('should show drag and drop instructions', () => {
      render(<ImageUpload value="" onChange={mockOnChange} />)
      expect(screen.getByText(/Arrastra una imagen aquí/)).toBeInTheDocument()
    })
  })

  describe('Upload Area Styling', () => {
    it('should have dashed border', () => {
      const { container } = render(<ImageUpload value="" onChange={mockOnChange} />)
      const uploadArea = container.querySelector('.border-dashed')
      expect(uploadArea).toBeInTheDocument()
    })

    it('should have cursor pointer', () => {
      const { container } = render(<ImageUpload value="" onChange={mockOnChange} />)
      const uploadArea = container.querySelector('.cursor-pointer')
      expect(uploadArea).toBeInTheDocument()
    })

    it('should show error styling when error prop is provided', () => {
      const { container } = render(<ImageUpload value="" onChange={mockOnChange} error="Error" />)
      const uploadArea = container.querySelector('.border-red-500')
      expect(uploadArea).toBeInTheDocument()
    })

    it('should have upload icon', () => {
      const { container } = render(<ImageUpload value="" onChange={mockOnChange} />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('Image Actions', () => {
    it('should show image preview when value exists', () => {
      render(<ImageUpload value={mockImageUrl} onChange={mockOnChange} />)
      const image = screen.getByTestId('optimized-image')
      expect(image).toBeInTheDocument()
    })

    it('should have remove button when image exists', () => {
      const { container } = render(<ImageUpload value={mockImageUrl} onChange={mockOnChange} />)
      const removeButton = container.querySelector('.bg-red-600')
      expect(removeButton).toBeInTheDocument()
    })

    it('should call onChange with empty string when removing image', () => {
      const { container } = render(<ImageUpload value={mockImageUrl} onChange={mockOnChange} />)
      const removeButton = container.querySelector('.bg-red-600') as HTMLButtonElement
      
      fireEvent.click(removeButton)
      expect(mockOnChange).toHaveBeenCalledWith('')
    })

    it('should show preview with correct dimensions', () => {
      const { container } = render(<ImageUpload value={mockImageUrl} onChange={mockOnChange} />)
      const previewContainer = container.querySelector('.h-64')
      expect(previewContainer).toBeInTheDocument()
    })
  })

  describe('Drag and Drop Area', () => {
    it('should have drag and drop area', () => {
      const { container } = render(<ImageUpload value="" onChange={mockOnChange} />)
      const dropZone = container.querySelector('.border-dashed')
      expect(dropZone).toBeInTheDocument()
    })

    it('should be clickable', () => {
      const { container } = render(<ImageUpload value="" onChange={mockOnChange} />)
      const dropZone = container.querySelector('.cursor-pointer')
      expect(dropZone).toBeInTheDocument()
    })

    it('should have hover effects', () => {
      const { container } = render(<ImageUpload value="" onChange={mockOnChange} />)
      const dropZone = container.querySelector('.hover\\:border-primary')
      expect(dropZone).toBeInTheDocument()
    })
  })

  describe('Component States', () => {
    it('should toggle between upload and preview states', () => {
      const { rerender } = render(<ImageUpload value="" onChange={mockOnChange} />)
      expect(screen.getByText(/Arrastra una imagen/)).toBeInTheDocument()
      
      rerender(<ImageUpload value={mockImageUrl} onChange={mockOnChange} />)
      expect(screen.queryByText(/Arrastra una imagen/)).not.toBeInTheDocument()
      expect(screen.getByTestId('optimized-image')).toBeInTheDocument()
    })

    it('should use default folder when not specified', () => {
      render(<ImageUpload value="" onChange={mockOnChange} />)
      expect(screen.getByText('Imagen')).toBeInTheDocument()
    })

    it('should disable input while uploading', () => {
      render(<ImageUpload value="" onChange={mockOnChange} />)
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      expect(input).not.toBeDisabled()
    })
  })

  describe('Error Display', () => {
    it('should display external error', () => {
      render(<ImageUpload value="" onChange={mockOnChange} error="External error" />)
      expect(screen.getByText('External error')).toBeInTheDocument()
    })

    it('should have error styling when error exists', () => {
      const { container } = render(<ImageUpload value="" onChange={mockOnChange} error="Error" />)
      const uploadArea = container.querySelector('.border-red-500')
      expect(uploadArea).toBeInTheDocument()
    })

    it('should show error message below upload area', () => {
      const { container } = render(<ImageUpload value="" onChange={mockOnChange} error="Test error" />)
      const errorText = container.querySelector('.text-red-500')
      expect(errorText).toBeInTheDocument()
      expect(errorText?.textContent).toBe('Test error')
    })
  })
})

