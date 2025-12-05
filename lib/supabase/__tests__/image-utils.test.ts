import { getOptimizedImageUrl, getImageSrcSet, extractPathFromUrl } from '../image-utils'

describe('image-utils', () => {
  const SUPABASE_URL = 'https://project.supabase.co/storage/v1/object/public/product-images/test.jpg'
  const NON_SUPABASE_URL = 'https://example.com/image.jpg'

  describe('getOptimizedImageUrl', () => {
    describe('with null or empty URLs', () => {
      it('should return empty string for null', () => {
        expect(getOptimizedImageUrl(null)).toBe('')
      })

      it('should return empty string for empty string', () => {
        expect(getOptimizedImageUrl('')).toBe('')
      })
    })

    describe('with non-Supabase URLs', () => {
      it('should return URL unchanged for non-Supabase URLs', () => {
        expect(getOptimizedImageUrl(NON_SUPABASE_URL)).toBe(NON_SUPABASE_URL)
      })

      it('should not add transformation params to external URLs', () => {
        const result = getOptimizedImageUrl(NON_SUPABASE_URL, 'thumbnail')
        expect(result).toBe(NON_SUPABASE_URL)
        expect(result).not.toContain('width=')
      })
    })

    describe('with preset sizes', () => {
      it('should apply thumbnail preset', () => {
        const result = getOptimizedImageUrl(SUPABASE_URL, 'thumbnail')
        expect(result).toContain('width=150')
        expect(result).toContain('height=150')
        expect(result).toContain('quality=80')
        expect(result).toContain('format=webp')
      })

      it('should apply small preset', () => {
        const result = getOptimizedImageUrl(SUPABASE_URL, 'small')
        expect(result).toContain('width=400')
        expect(result).toContain('quality=85')
        expect(result).toContain('format=webp')
        expect(result).not.toContain('height=')
      })

      it('should apply medium preset', () => {
        const result = getOptimizedImageUrl(SUPABASE_URL, 'medium')
        expect(result).toContain('width=800')
        expect(result).toContain('quality=85')
      })

      it('should apply large preset', () => {
        const result = getOptimizedImageUrl(SUPABASE_URL, 'large')
        expect(result).toContain('width=1200')
        expect(result).toContain('quality=90')
      })

      it('should apply original preset without format', () => {
        const result = getOptimizedImageUrl(SUPABASE_URL, 'original')
        expect(result).toContain('quality=95')
        expect(result).not.toContain('format=')
      })
    })

    describe('with custom options', () => {
      it('should apply custom width', () => {
        const result = getOptimizedImageUrl(SUPABASE_URL, { width: 500 })
        expect(result).toContain('width=500')
      })

      it('should apply custom height', () => {
        const result = getOptimizedImageUrl(SUPABASE_URL, { height: 300 })
        expect(result).toContain('height=300')
      })

      it('should apply custom quality', () => {
        const result = getOptimizedImageUrl(SUPABASE_URL, { quality: 70 })
        expect(result).toContain('quality=70')
      })

      it('should apply custom format', () => {
        const result = getOptimizedImageUrl(SUPABASE_URL, { format: 'avif' })
        expect(result).toContain('format=avif')
      })

      it('should apply multiple custom options', () => {
        const result = getOptimizedImageUrl(SUPABASE_URL, {
          width: 600,
          height: 400,
          quality: 75,
          format: 'webp'
        })
        expect(result).toContain('width=600')
        expect(result).toContain('height=400')
        expect(result).toContain('quality=75')
        expect(result).toContain('format=webp')
      })

      it('should not add format param when format is origin', () => {
        const result = getOptimizedImageUrl(SUPABASE_URL, { format: 'origin' })
        expect(result).not.toContain('format=')
      })

      it('should return original URL when no options provided', () => {
        const result = getOptimizedImageUrl(SUPABASE_URL, {})
        expect(result).toBe(SUPABASE_URL)
      })
    })

    describe('URL construction', () => {
      it('should add params with ? separator when URL has no query string', () => {
        const result = getOptimizedImageUrl(SUPABASE_URL, 'small')
        expect(result).toContain('?')
        expect(result.indexOf('?')).toBeLessThan(result.indexOf('&'))
      })

      it('should add params with & separator when URL already has query string', () => {
        const urlWithParams = SUPABASE_URL + '?existing=param'
        const result = getOptimizedImageUrl(urlWithParams, 'small')
        expect(result).toContain('&width=')
      })

      it('should preserve existing query params', () => {
        const urlWithParams = SUPABASE_URL + '?token=abc123'
        const result = getOptimizedImageUrl(urlWithParams, 'small')
        expect(result).toContain('token=abc123')
        expect(result).toContain('width=400')
      })
    })
  })

  describe('getImageSrcSet', () => {
    it('should return empty string for null', () => {
      expect(getImageSrcSet(null)).toBe('')
    })

    it('should return empty string for empty string', () => {
      expect(getImageSrcSet('')).toBe('')
    })

    it('should generate srcset with multiple widths', () => {
      const result = getImageSrcSet(SUPABASE_URL)
      expect(result).toContain('400w')
      expect(result).toContain('800w')
      expect(result).toContain('1200w')
      expect(result).toContain('1600w')
    })

    it('should use webp format in srcset', () => {
      const result = getImageSrcSet(SUPABASE_URL)
      expect(result).toContain('format=webp')
    })

    it('should use quality 85 in srcset', () => {
      const result = getImageSrcSet(SUPABASE_URL)
      expect(result).toContain('quality=85')
    })

    it('should separate URLs with commas', () => {
      const result = getImageSrcSet(SUPABASE_URL)
      const parts = result.split(', ')
      expect(parts).toHaveLength(4)
    })

    it('should format each entry correctly', () => {
      const result = getImageSrcSet(SUPABASE_URL)
      const parts = result.split(', ')
      
      parts.forEach(part => {
        expect(part).toMatch(/\d+w$/)
      })
    })

    it('should include base URL in each srcset entry', () => {
      const result = getImageSrcSet(SUPABASE_URL)
      const parts = result.split(', ')
      
      parts.forEach(part => {
        expect(part).toContain('supabase.co')
      })
    })

    it('should work with non-Supabase URLs', () => {
      const result = getImageSrcSet(NON_SUPABASE_URL)
      expect(result).toBeTruthy()
      expect(result).toContain('example.com')
    })
  })

  describe('extractPathFromUrl', () => {
    it('should extract path from Supabase URL', () => {
      const url = 'https://project.supabase.co/storage/v1/object/public/product-images/products/test.jpg'
      const result = extractPathFromUrl(url)
      expect(result).toBe('products/test.jpg')
    })

    it('should extract path with subdirectories', () => {
      const url = 'https://project.supabase.co/storage/v1/object/public/product-images/subfolder/nested/file.png'
      const result = extractPathFromUrl(url)
      expect(result).toBe('subfolder/nested/file.png')
    })

    it('should decode URL-encoded characters', () => {
      const url = 'https://project.supabase.co/storage/v1/object/public/product-images/my%20file%20name.jpg'
      const result = extractPathFromUrl(url)
      expect(result).toBe('my file name.jpg')
    })

    it('should handle URLs with query params', () => {
      const url = 'https://project.supabase.co/storage/v1/object/public/product-images/test.jpg?width=400&quality=85'
      const result = extractPathFromUrl(url)
      expect(result).toBe('test.jpg')
    })

    it('should return null for invalid URLs', () => {
      const result = extractPathFromUrl('not-a-valid-url')
      expect(result).toBeNull()
    })

    it('should return null for URLs without product-images bucket', () => {
      const url = 'https://project.supabase.co/storage/v1/object/public/other-bucket/file.jpg'
      const result = extractPathFromUrl(url)
      expect(result).toBeNull()
    })

    it('should return null for malformed Supabase URLs', () => {
      const url = 'https://project.supabase.co/malformed/path'
      const result = extractPathFromUrl(url)
      expect(result).toBeNull()
    })

    it('should handle URLs with special characters', () => {
      const url = 'https://project.supabase.co/storage/v1/object/public/product-images/file-with-dashes_and_underscores.jpg'
      const result = extractPathFromUrl(url)
      expect(result).toBe('file-with-dashes_and_underscores.jpg')
    })

    it('should handle paths with timestamp prefixes', () => {
      const url = 'https://project.supabase.co/storage/v1/object/public/product-images/1234567890_image.jpg'
      const result = extractPathFromUrl(url)
      expect(result).toBe('1234567890_image.jpg')
    })
  })
})

