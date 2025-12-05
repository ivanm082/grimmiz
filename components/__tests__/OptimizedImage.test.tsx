import { render } from '@testing-library/react'
import OptimizedImage from '../OptimizedImage'

describe('OptimizedImage', () => {
  const SUPABASE_URL = 'https://project.supabase.co/storage/v1/object/public/product-images/test.jpg'
  const EXTERNAL_URL = 'https://example.com/image.jpg'

  describe('with Supabase URLs', () => {
    it('should render with thumbnail size', () => {
      const { container } = render(
        <OptimizedImage src={SUPABASE_URL} alt="Test" size="thumbnail" fill />
      )
      const img = container.querySelector('img')
      expect(img).toBeInTheDocument()
    })

    it('should render with small size', () => {
      const { container } = render(
        <OptimizedImage src={SUPABASE_URL} alt="Test" size="small" fill />
      )
      const img = container.querySelector('img')
      expect(img).toBeInTheDocument()
    })

    it('should render with medium size', () => {
      const { container } = render(
        <OptimizedImage src={SUPABASE_URL} alt="Test" size="medium" fill />
      )
      const img = container.querySelector('img')
      expect(img).toBeInTheDocument()
    })

    it('should render with large size', () => {
      const { container } = render(
        <OptimizedImage src={SUPABASE_URL} alt="Test" size="large" fill />
      )
      const img = container.querySelector('img')
      expect(img).toBeInTheDocument()
    })

    it('should render with original size', () => {
      const { container } = render(
        <OptimizedImage src={SUPABASE_URL} alt="Test" size="original" fill />
      )
      const img = container.querySelector('img')
      expect(img).toBeInTheDocument()
    })

    it('should use medium as default size', () => {
      const { container } = render(
        <OptimizedImage src={SUPABASE_URL} alt="Test" fill />
      )
      const img = container.querySelector('img')
      expect(img).toBeInTheDocument()
    })
  })

  describe('with external URLs', () => {
    it('should render external images', () => {
      const { container } = render(
        <OptimizedImage src={EXTERNAL_URL} alt="Test" fill />
      )
      const img = container.querySelector('img')
      expect(img).toBeInTheDocument()
    })

    it('should not apply transformation params to external URLs', () => {
      const { container } = render(
        <OptimizedImage src={EXTERNAL_URL} alt="Test" size="thumbnail" fill />
      )
      const img = container.querySelector('img')
      expect(img).toBeInTheDocument()
    })
  })

  describe('with alt text', () => {
    it('should render with provided alt text', () => {
      const { container } = render(
        <OptimizedImage src={SUPABASE_URL} alt="Product image" fill />
      )
      const img = container.querySelector('img')
      expect(img).toHaveAttribute('alt', 'Product image')
    })

    it('should handle empty alt text', () => {
      const { container } = render(
        <OptimizedImage src={SUPABASE_URL} alt="" fill />
      )
      const img = container.querySelector('img')
      expect(img).toHaveAttribute('alt', '')
    })
  })

  describe('with fill prop', () => {
    it('should render with fill layout', () => {
      const { container } = render(
        <OptimizedImage src={SUPABASE_URL} alt="Test" fill />
      )
      const img = container.querySelector('img')
      expect(img).toBeInTheDocument()
    })
  })

  describe('with width and height', () => {
    it('should render with specific dimensions', () => {
      const { container } = render(
        <OptimizedImage src={SUPABASE_URL} alt="Test" width={400} height={300} />
      )
      const img = container.querySelector('img')
      expect(img).toBeInTheDocument()
    })

    it('should accept large dimensions', () => {
      const { container } = render(
        <OptimizedImage src={SUPABASE_URL} alt="Test" width={1920} height={1080} />
      )
      const img = container.querySelector('img')
      expect(img).toBeInTheDocument()
    })
  })

  describe('with className', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <OptimizedImage 
          src={SUPABASE_URL} 
          alt="Test" 
          fill 
          className="custom-class another-class" 
        />
      )
      const img = container.querySelector('img')
      expect(img).toHaveClass('custom-class')
      expect(img).toHaveClass('another-class')
    })

    it('should handle multiple classes', () => {
      const { container } = render(
        <OptimizedImage 
          src={SUPABASE_URL} 
          alt="Test" 
          fill 
          className="class1 class2 class3" 
        />
      )
      const img = container.querySelector('img')
      expect(img?.className).toContain('class1')
      expect(img?.className).toContain('class2')
      expect(img?.className).toContain('class3')
    })
  })

  describe('with priority', () => {
    it('should render with priority true', () => {
      const { container } = render(
        <OptimizedImage src={SUPABASE_URL} alt="Test" fill priority />
      )
      const img = container.querySelector('img')
      expect(img).toBeInTheDocument()
    })

    it('should render with priority false', () => {
      const { container } = render(
        <OptimizedImage src={SUPABASE_URL} alt="Test" fill priority={false} />
      )
      const img = container.querySelector('img')
      expect(img).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('should handle very long URLs', () => {
      const longUrl = SUPABASE_URL + '?' + 'x'.repeat(1000)
      const { container } = render(
        <OptimizedImage src={longUrl} alt="Test" fill />
      )
      const img = container.querySelector('img')
      expect(img).toBeInTheDocument()
    })

    it('should handle URLs with special characters', () => {
      const specialUrl = 'https://project.supabase.co/storage/v1/object/public/product-images/file%20with%20spaces.jpg'
      const { container } = render(
        <OptimizedImage src={specialUrl} alt="Test" fill />
      )
      const img = container.querySelector('img')
      expect(img).toBeInTheDocument()
    })

    it('should handle URLs with query parameters', () => {
      const urlWithParams = SUPABASE_URL + '?existing=param'
      const { container } = render(
        <OptimizedImage src={urlWithParams} alt="Test" size="small" fill />
      )
      const img = container.querySelector('img')
      expect(img).toBeInTheDocument()
    })
  })

  describe('all size presets', () => {
    const sizes: Array<'thumbnail' | 'small' | 'medium' | 'large' | 'original'> = [
      'thumbnail', 'small', 'medium', 'large', 'original'
    ]

    sizes.forEach(size => {
      it(`should render correctly with ${size} size`, () => {
        const { container } = render(
          <OptimizedImage src={SUPABASE_URL} alt={`Test ${size}`} size={size} fill />
        )
        const img = container.querySelector('img')
        expect(img).toBeInTheDocument()
        expect(img).toHaveAttribute('alt', `Test ${size}`)
      })
    })
  })

  describe('placeholder when no src', () => {
    it('should render placeholder when src is null', () => {
      const { container } = render(
        <OptimizedImage src={null} alt="Test" fill />
      )
      const placeholder = container.querySelector('div.bg-gray-200')
      expect(placeholder).toBeInTheDocument()
      
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should not render img element when src is null', () => {
      const { container } = render(
        <OptimizedImage src={null} alt="Test" fill />
      )
      const img = container.querySelector('img')
      expect(img).not.toBeInTheDocument()
    })

    it('should apply className to placeholder', () => {
      const { container } = render(
        <OptimizedImage src={null} alt="Test" fill className="custom-class" />
      )
      const placeholder = container.querySelector('div.bg-gray-200')
      expect(placeholder).toHaveClass('custom-class')
    })

    it('should render fallback with width and height', () => {
      const { container } = render(
        <OptimizedImage src={null} alt="Test" width={400} height={300} />
      )
      const placeholder = container.querySelector('div.bg-gray-200')
      expect(placeholder).toBeInTheDocument()
    })

    it('should render placeholder icon', () => {
      const { container } = render(
        <OptimizedImage src={null} alt="Test" fill />
      )
      const svg = container.querySelector('svg')
      const path = svg?.querySelector('path')
      
      expect(svg).toHaveClass('w-12')
      expect(svg).toHaveClass('h-12')
      expect(path).toBeInTheDocument()
    })
  })

  describe('default behavior and fallbacks', () => {
    it('should default to fill when no dimensions specified', () => {
      const { container } = render(
        <OptimizedImage src={SUPABASE_URL} alt="Test" />
      )
      const img = container.querySelector('img')
      expect(img).toBeInTheDocument()
    })

    it('should render with only width (no height)', () => {
      const { container } = render(
        <OptimizedImage src={SUPABASE_URL} alt="Test" width={400} />
      )
      const img = container.querySelector('img')
      expect(img).toBeInTheDocument()
    })

    it('should render with only height (no width)', () => {
      const { container } = render(
        <OptimizedImage src={SUPABASE_URL} alt="Test" height={300} />
      )
      const img = container.querySelector('img')
      expect(img).toBeInTheDocument()
    })
  })
})

