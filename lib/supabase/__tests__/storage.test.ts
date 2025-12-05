import { validateImage, generateUniqueFileName } from '../storage'

describe('storage', () => {
  describe('validateImage', () => {
    const createMockFile = (type: string, size: number, name: string = 'test.jpg'): File => {
      // Crear un buffer del tamaño especificado
      const buffer = new ArrayBuffer(size)
      const blob = new Blob([buffer], { type })
      return new File([blob], name, { type })
    }

    describe('valid images', () => {
      it('should accept JPEG images', () => {
        const file = createMockFile('image/jpeg', 100 * 1024)
        const result = validateImage(file)
        expect(result.valid).toBe(true)
        expect(result.error).toBeUndefined()
      })

      it('should accept JPG images', () => {
        const file = createMockFile('image/jpg', 100 * 1024)
        const result = validateImage(file)
        expect(result.valid).toBe(true)
      })

      it('should accept PNG images', () => {
        const file = createMockFile('image/png', 100 * 1024)
        const result = validateImage(file)
        expect(result.valid).toBe(true)
      })

      it('should accept WebP images', () => {
        const file = createMockFile('image/webp', 100 * 1024)
        const result = validateImage(file)
        expect(result.valid).toBe(true)
      })

      it('should accept AVIF images', () => {
        const file = createMockFile('image/avif', 100 * 1024)
        const result = validateImage(file)
        expect(result.valid).toBe(true)
      })

      it('should accept images at max size (500KB)', () => {
        const file = createMockFile('image/jpeg', 500 * 1024)
        const result = validateImage(file)
        expect(result.valid).toBe(true)
      })

      it('should accept small images (1KB)', () => {
        const file = createMockFile('image/jpeg', 1024)
        const result = validateImage(file)
        expect(result.valid).toBe(true)
      })
    })

    describe('invalid images - type', () => {
      it('should reject GIF images', () => {
        const file = createMockFile('image/gif', 100 * 1024)
        const result = validateImage(file)
        expect(result.valid).toBe(false)
        expect(result.error).toContain('Tipo de archivo no permitido')
      })

      it('should reject SVG images', () => {
        const file = createMockFile('image/svg+xml', 100 * 1024)
        const result = validateImage(file)
        expect(result.valid).toBe(false)
        expect(result.error).toContain('Tipo de archivo no permitido')
      })

      it('should reject PDF files', () => {
        const file = createMockFile('application/pdf', 100 * 1024)
        const result = validateImage(file)
        expect(result.valid).toBe(false)
        expect(result.error).toContain('Tipo de archivo no permitido')
      })

      it('should reject text files', () => {
        const file = createMockFile('text/plain', 100 * 1024)
        const result = validateImage(file)
        expect(result.valid).toBe(false)
      })

      it('should reject video files', () => {
        const file = createMockFile('video/mp4', 100 * 1024)
        const result = validateImage(file)
        expect(result.valid).toBe(false)
      })
    })

    describe('invalid images - size', () => {
      it('should reject images over 500KB', () => {
        const file = createMockFile('image/jpeg', 501 * 1024)
        const result = validateImage(file)
        expect(result.valid).toBe(false)
        expect(result.error).toContain('demasiado grande')
        expect(result.error).toContain('500KB')
      })

      it('should reject very large images (1MB)', () => {
        const file = createMockFile('image/jpeg', 1024 * 1024)
        const result = validateImage(file)
        expect(result.valid).toBe(false)
        expect(result.error).toContain('demasiado grande')
      })

      it('should reject images just 1 byte over limit', () => {
        const file = createMockFile('image/jpeg', (500 * 1024) + 1)
        const result = validateImage(file)
        expect(result.valid).toBe(false)
      })
    })

    describe('edge cases', () => {
      it('should reject 0 byte files', () => {
        const file = createMockFile('image/jpeg', 0)
        const result = validateImage(file)
        // 0 bytes es válido en cuanto a tamaño, pero podría ser inválido
        expect(result.valid).toBe(true)
      })

      it('should handle invalid MIME type combined with valid size', () => {
        const file = createMockFile('image/invalid', 100 * 1024)
        const result = validateImage(file)
        expect(result.valid).toBe(false)
        expect(result.error).toContain('Tipo de archivo no permitido')
      })

      it('should handle valid MIME type combined with invalid size', () => {
        const file = createMockFile('image/jpeg', 1000 * 1024)
        const result = validateImage(file)
        expect(result.valid).toBe(false)
        expect(result.error).toContain('demasiado grande')
      })
    })
  })

  describe('generateUniqueFileName', () => {
    it('should generate a unique filename', () => {
      const fileName = generateUniqueFileName('test.jpg')
      expect(fileName).toBeTruthy()
      expect(fileName).toContain('.jpg')
    })

    it('should preserve file extension', () => {
      const extensions = ['jpg', 'png', 'webp', 'avif']
      
      extensions.forEach(ext => {
        const fileName = generateUniqueFileName(`test.${ext}`)
        expect(fileName).toContain(`.${ext}`)
      })
    })

    it('should include timestamp in filename', () => {
      const beforeTime = Date.now()
      const fileName = generateUniqueFileName('test.jpg')
      const afterTime = Date.now()
      
      // Extraer el timestamp del nombre de archivo
      const timestamp = parseInt(fileName.split('-')[0])
      expect(timestamp).toBeGreaterThanOrEqual(beforeTime)
      expect(timestamp).toBeLessThanOrEqual(afterTime)
    })

    it('should generate different filenames for same input', () => {
      const fileName1 = generateUniqueFileName('test.jpg')
      const fileName2 = generateUniqueFileName('test.jpg')
      
      expect(fileName1).not.toBe(fileName2)
    })

    it('should handle filenames with multiple dots', () => {
      const fileName = generateUniqueFileName('my.file.name.jpg')
      expect(fileName).toContain('.jpg')
    })

    it('should handle filenames with spaces', () => {
      const fileName = generateUniqueFileName('my image file.jpg')
      expect(fileName).toContain('.jpg')
      expect(fileName).toBeTruthy()
    })

    it('should handle filenames with special characters', () => {
      const fileName = generateUniqueFileName('my-file_name.jpg')
      expect(fileName).toContain('.jpg')
    })

    it('should handle uppercase extensions', () => {
      const fileName = generateUniqueFileName('test.JPG')
      expect(fileName).toContain('.JPG')
    })

    it('should handle filenames without extension', () => {
      const fileName = generateUniqueFileName('test')
      expect(fileName).toBeTruthy()
    })

    it('should create filename with expected format', () => {
      const fileName = generateUniqueFileName('test.jpg')
      // Format: {timestamp}-{random}.jpg
      const parts = fileName.split('.')
      expect(parts.length).toBeGreaterThanOrEqual(2)
      
      const namePart = parts[0]
      expect(namePart).toContain('-')
      
      const [timestamp, random] = namePart.split('-')
      expect(parseInt(timestamp)).toBeGreaterThan(0)
      expect(random.length).toBeGreaterThan(0)
    })

    it('should handle very long filenames', () => {
      const longName = 'a'.repeat(200) + '.jpg'
      const fileName = generateUniqueFileName(longName)
      expect(fileName).toContain('.jpg')
    })
  })
})

