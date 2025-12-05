import { generateSlug } from '../utils'

describe('utils', () => {
  describe('generateSlug', () => {
    it('should convert text to lowercase', () => {
      expect(generateSlug('UPPERCASE TEXT')).toBe('uppercase-text')
    })

    it('should replace spaces with hyphens', () => {
      expect(generateSlug('hello world')).toBe('hello-world')
    })

    it('should remove accents', () => {
      expect(generateSlug('café résumé')).toBe('cafe-resume')
      expect(generateSlug('niño mañana')).toBe('nino-manana')
      expect(generateSlug('über façade')).toBe('uber-facade')
    })

    it('should remove special characters', () => {
      expect(generateSlug('hello!@#$%world')).toBe('helloworld')
      expect(generateSlug('test & test')).toBe('test-test')
    })

    it('should trim whitespace', () => {
      expect(generateSlug('  hello world  ')).toBe('hello-world')
    })

    it('should replace multiple spaces with single hyphen', () => {
      expect(generateSlug('hello    world')).toBe('hello-world')
    })

    it('should remove multiple consecutive hyphens', () => {
      expect(generateSlug('hello---world')).toBe('hello-world')
    })

    it('should handle text with numbers', () => {
      expect(generateSlug('Product 123')).toBe('product-123')
      expect(generateSlug('2024 Edition')).toBe('2024-edition')
    })

    it('should handle already hyphenated text', () => {
      expect(generateSlug('already-hyphenated-text')).toBe('already-hyphenated-text')
    })

    it('should handle empty string', () => {
      expect(generateSlug('')).toBe('')
    })

    it('should handle string with only special characters', () => {
      expect(generateSlug('!@#$%^&*()')).toBe('')
    })

    it('should handle mixed case with accents and special chars', () => {
      expect(generateSlug('¡Hola! ¿Cómo estás?')).toBe('hola-como-estas')
    })

    it('should handle product names realistically', () => {
      expect(generateSlug('Figura de Resina - Timo')).toBe('figura-de-resina-timo')
      expect(generateSlug('Lámina Personalizada 30x40cm')).toBe('lamina-personalizada-30x40cm')
    })

    it('should preserve numbers', () => {
      expect(generateSlug('test123test')).toBe('test123test')
    })

    it('should handle unicode characters correctly', () => {
      expect(generateSlug('héllo wörld')).toBe('hello-world')
    })
  })
})

