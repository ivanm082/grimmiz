import { render, screen, fireEvent } from '@testing-library/react'
import ProductImageGallery from '../ProductImageGallery'

// Mock OptimizedImage component
jest.mock('@/components/OptimizedImage', () => {
  return function MockOptimizedImage({ src, alt, size }: any) {
    return <img src={src} alt={alt} data-size={size} />
  }
})

describe('ProductImageGallery', () => {
  const mockImages = [
    { id: 1, url: '/image1.jpg', alt: 'Image 1' },
    { id: 2, url: '/image2.jpg', alt: 'Image 2' },
    { id: 3, url: '/image3.jpg', alt: 'Image 3' },
  ]

  describe('with no images', () => {
    it('should render placeholder when images array is empty', () => {
      const { container } = render(<ProductImageGallery images={[]} />)
      
      expect(container.textContent).toContain('🎨')
    })

    it('should not render navigation arrows when no images', () => {
      render(<ProductImageGallery images={[]} />)
      
      expect(screen.queryByLabelText('Imagen anterior')).not.toBeInTheDocument()
      expect(screen.queryByLabelText('Imagen siguiente')).not.toBeInTheDocument()
    })

    it('should have gradient background in placeholder', () => {
      const { container } = render(<ProductImageGallery images={[]} />)
      
      const placeholder = container.querySelector('.bg-gradient-to-br')
      expect(placeholder).toBeInTheDocument()
    })
  })

  describe('with single image', () => {
    const singleImage = [mockImages[0]]

    it('should render the image', () => {
      render(<ProductImageGallery images={singleImage} />)
      
      expect(screen.getByAltText('Image 1')).toBeInTheDocument()
    })

    it('should not show navigation arrows for single image', () => {
      render(<ProductImageGallery images={singleImage} />)
      
      expect(screen.queryByLabelText('Imagen anterior')).not.toBeInTheDocument()
      expect(screen.queryByLabelText('Imagen siguiente')).not.toBeInTheDocument()
    })

    it('should not show thumbnails for single image', () => {
      const { container } = render(<ProductImageGallery images={singleImage} />)
      
      const thumbnailGrid = container.querySelector('.grid.grid-cols-4')
      expect(thumbnailGrid).not.toBeInTheDocument()
    })

    it('should not show position indicators for single image', () => {
      const { container } = render(<ProductImageGallery images={singleImage} />)
      
      const indicators = container.querySelector('.absolute.bottom-4')
      expect(indicators).not.toBeInTheDocument()
    })
  })

  describe('with multiple images', () => {
    it('should render all images in thumbnails', () => {
      render(<ProductImageGallery images={mockImages} />)
      
      expect(screen.getByAltText('Image 1 - miniatura 1')).toBeInTheDocument()
      expect(screen.getByAltText('Image 2 - miniatura 2')).toBeInTheDocument()
      expect(screen.getByAltText('Image 3 - miniatura 3')).toBeInTheDocument()
    })

    it('should show first image by default', () => {
      render(<ProductImageGallery images={mockImages} />)
      
      const mainImage = screen.getByAltText('Image 1')
      expect(mainImage).toHaveAttribute('data-size', 'large')
    })

    it('should show navigation arrows', () => {
      render(<ProductImageGallery images={mockImages} />)
      
      expect(screen.getByLabelText('Imagen anterior')).toBeInTheDocument()
      expect(screen.getByLabelText('Imagen siguiente')).toBeInTheDocument()
    })

    it('should show position indicators', () => {
      const { container } = render(<ProductImageGallery images={mockImages} />)
      
      const indicators = container.querySelectorAll('button[aria-label^="Ir a imagen"]')
      expect(indicators).toHaveLength(3)
    })
  })

  describe('Navigation', () => {
    it('should go to next image when clicking next arrow', () => {
      render(<ProductImageGallery images={mockImages} />)
      
      const nextButton = screen.getByLabelText('Imagen siguiente')
      fireEvent.click(nextButton)
      
      // Should now show second image
      expect(screen.getByAltText('Image 2')).toHaveAttribute('data-size', 'large')
    })

    it('should go to previous image when clicking previous arrow', () => {
      render(<ProductImageGallery images={mockImages} />)
      
      const prevButton = screen.getByLabelText('Imagen anterior')
      fireEvent.click(prevButton)
      
      // Should wrap to last image
      expect(screen.getByAltText('Image 3')).toHaveAttribute('data-size', 'large')
    })

    it('should wrap to first image when clicking next on last image', () => {
      render(<ProductImageGallery images={mockImages} />)
      
      const nextButton = screen.getByLabelText('Imagen siguiente')
      
      // Go to last image
      fireEvent.click(nextButton)
      fireEvent.click(nextButton)
      expect(screen.getByAltText('Image 3')).toHaveAttribute('data-size', 'large')
      
      // Click next again should wrap to first
      fireEvent.click(nextButton)
      expect(screen.getByAltText('Image 1')).toHaveAttribute('data-size', 'large')
    })

    it('should change image when clicking thumbnail', () => {
      render(<ProductImageGallery images={mockImages} />)
      
      const thumbnail = screen.getByAltText('Image 3 - miniatura 3').closest('button')
      fireEvent.click(thumbnail!)
      
      expect(screen.getByAltText('Image 3')).toHaveAttribute('data-size', 'large')
    })

    it('should change image when clicking position indicator', () => {
      render(<ProductImageGallery images={mockImages} />)
      
      const indicator = screen.getByLabelText('Ir a imagen 2')
      fireEvent.click(indicator)
      
      expect(screen.getByAltText('Image 2')).toHaveAttribute('data-size', 'large')
    })
  })

  describe('Active states', () => {
    it('should highlight active thumbnail', () => {
      const { container } = render(<ProductImageGallery images={mockImages} />)
      
      const firstThumbnail = screen.getByAltText('Image 1 - miniatura 1').closest('button')
      expect(firstThumbnail?.className).toContain('ring-4')
      expect(firstThumbnail?.className).toContain('ring-primary')
    })

    it('should change active thumbnail when navigating', () => {
      render(<ProductImageGallery images={mockImages} />)
      
      const nextButton = screen.getByLabelText('Imagen siguiente')
      fireEvent.click(nextButton)
      
      const secondThumbnail = screen.getByAltText('Image 2 - miniatura 2').closest('button')
      expect(secondThumbnail?.className).toContain('ring-4')
    })

    it('should show overlay on active thumbnail', () => {
      const { container } = render(<ProductImageGallery images={mockImages} />)
      
      const overlays = container.querySelectorAll('.absolute.inset-0.bg-primary\\/10')
      expect(overlays.length).toBe(1)
    })

    it('should highlight active position indicator', () => {
      const { container } = render(<ProductImageGallery images={mockImages} />)
      
      const indicators = container.querySelectorAll('button[aria-label^="Ir a imagen"]')
      const firstIndicator = indicators[0]
      
      expect(firstIndicator.className).toContain('bg-white')
      expect(firstIndicator.className).toContain('w-8')
    })
  })

  describe('Image sizes', () => {
    it('should use large size for main image', () => {
      render(<ProductImageGallery images={mockImages} />)
      
      const mainImage = screen.getByAltText('Image 1')
      expect(mainImage).toHaveAttribute('data-size', 'large')
    })

    it('should use thumbnail size for thumbnails', () => {
      render(<ProductImageGallery images={mockImages} />)
      
      const thumbnail = screen.getByAltText('Image 1 - miniatura 1')
      expect(thumbnail).toHaveAttribute('data-size', 'thumbnail')
    })
  })

  describe('Styling and Layout', () => {
    it('should have responsive classes on main image container', () => {
      const { container } = render(<ProductImageGallery images={mockImages} />)
      
      const mainContainer = container.querySelector('.h-96.lg\\:h-\\[500px\\]')
      expect(mainContainer).toBeInTheDocument()
    })

    it('should have responsive grid for thumbnails', () => {
      const { container } = render(<ProductImageGallery images={mockImages} />)
      
      const thumbnailGrid = container.querySelector('.grid-cols-4.md\\:grid-cols-5.lg\\:grid-cols-6')
      expect(thumbnailGrid).toBeInTheDocument()
    })

    it('should have hover effects on navigation arrows', () => {
      const { container } = render(<ProductImageGallery images={mockImages} />)
      
      const prevButton = screen.getByLabelText('Imagen anterior')
      expect(prevButton.className).toContain('hover:scale-110')
      expect(prevButton.className).toContain('hover:bg-white')
    })

    it('should have group-hover effect for arrow visibility', () => {
      const { container } = render(<ProductImageGallery images={mockImages} />)
      
      const prevButton = screen.getByLabelText('Imagen anterior')
      expect(prevButton.className).toContain('opacity-0')
      expect(prevButton.className).toContain('group-hover:opacity-100')
    })
  })

  describe('Accessibility', () => {
    it('should have aria-labels on navigation buttons', () => {
      render(<ProductImageGallery images={mockImages} />)
      
      expect(screen.getByLabelText('Imagen anterior')).toBeInTheDocument()
      expect(screen.getByLabelText('Imagen siguiente')).toBeInTheDocument()
    })

    it('should have aria-labels on position indicators', () => {
      render(<ProductImageGallery images={mockImages} />)
      
      expect(screen.getByLabelText('Ir a imagen 1')).toBeInTheDocument()
      expect(screen.getByLabelText('Ir a imagen 2')).toBeInTheDocument()
      expect(screen.getByLabelText('Ir a imagen 3')).toBeInTheDocument()
    })

    it('should have proper alt text for all images', () => {
      render(<ProductImageGallery images={mockImages} />)
      
      expect(screen.getByAltText('Image 1')).toBeInTheDocument()
      expect(screen.getByAltText('Image 1 - miniatura 1')).toBeInTheDocument()
    })
  })

  describe('Edge cases', () => {
    it('should handle images with string IDs', () => {
      const imagesWithStringIds = [
        { id: 'abc', url: '/img1.jpg', alt: 'Img 1' },
        { id: 'def', url: '/img2.jpg', alt: 'Img 2' },
      ]
      
      render(<ProductImageGallery images={imagesWithStringIds} />)
      expect(screen.getByAltText('Img 1')).toBeInTheDocument()
    })

    it('should handle images with numeric IDs', () => {
      const imagesWithNumericIds = [
        { id: 123, url: '/img1.jpg', alt: 'Img 1' },
        { id: 456, url: '/img2.jpg', alt: 'Img 2' },
      ]
      
      render(<ProductImageGallery images={imagesWithNumericIds} />)
      expect(screen.getByAltText('Img 1')).toBeInTheDocument()
    })

    it('should handle many images', () => {
      const manyImages = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        url: `/image${i + 1}.jpg`,
        alt: `Image ${i + 1}`,
      }))
      
      render(<ProductImageGallery images={manyImages} />)
      
      const indicators = screen.getAllByLabelText(/Ir a imagen \d+/)
      expect(indicators).toHaveLength(10)
    })
  })
})

