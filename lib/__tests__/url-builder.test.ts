import { buildProductListUrl, parseProductListUrl, isProductSlug } from '../url-builder'

describe('url-builder', () => {
  describe('buildProductListUrl', () => {
    it('should build base URL without filters', () => {
      expect(buildProductListUrl({})).toBe('/mundo-grimmiz/')
    })

    it('should build URL with category only', () => {
      expect(buildProductListUrl({ categoria: 'figuras-de-resina' }))
        .toBe('/mundo-grimmiz/figuras-de-resina/')
    })

    it('should build URL with tag only', () => {
      expect(buildProductListUrl({ etiqueta: 'timo' }))
        .toBe('/mundo-grimmiz/etiqueta-timo/')
    })

    it('should build URL with category and tag', () => {
      expect(buildProductListUrl({ 
        categoria: 'figuras-de-resina', 
        etiqueta: 'timo' 
      })).toBe('/mundo-grimmiz/figuras-de-resina/etiqueta-timo/')
    })

    it('should build URL with pagination (page 2)', () => {
      expect(buildProductListUrl({ pagina: 2 }))
        .toBe('/mundo-grimmiz/pagina-2/')
    })

    it('should not include pagination for page 1', () => {
      expect(buildProductListUrl({ pagina: 1 }))
        .toBe('/mundo-grimmiz/')
    })

    it('should build URL with ordering (precio-asc)', () => {
      expect(buildProductListUrl({ orden: 'precio-asc' }))
        .toBe('/mundo-grimmiz/orden-precio-asc/')
    })

    it('should not include default ordering (recientes)', () => {
      expect(buildProductListUrl({ orden: 'recientes' }))
        .toBe('/mundo-grimmiz/')
    })

    it('should build complete URL with all filters', () => {
      expect(buildProductListUrl({
        categoria: 'figuras-de-resina',
        etiqueta: 'timo',
        pagina: 3,
        orden: 'precio-desc'
      })).toBe('/mundo-grimmiz/figuras-de-resina/etiqueta-timo/pagina-3/orden-precio-desc/')
    })

    it('should handle category with pagination', () => {
      expect(buildProductListUrl({
        categoria: 'laminas',
        pagina: 2
      })).toBe('/mundo-grimmiz/laminas/pagina-2/')
    })

    it('should handle category with ordering', () => {
      expect(buildProductListUrl({
        categoria: 'laminas',
        orden: 'precio-asc'
      })).toBe('/mundo-grimmiz/laminas/orden-precio-asc/')
    })

    it('should always end with trailing slash', () => {
      const urls = [
        buildProductListUrl({}),
        buildProductListUrl({ categoria: 'test' }),
        buildProductListUrl({ etiqueta: 'test' }),
        buildProductListUrl({ pagina: 2 }),
        buildProductListUrl({ orden: 'precio-desc' }),
      ]
      
      urls.forEach(url => {
        expect(url.endsWith('/')).toBe(true)
      })
    })
  })

  describe('parseProductListUrl', () => {
    it('should parse empty segments', () => {
      expect(parseProductListUrl([])).toEqual({})
    })

    it('should parse category segment', () => {
      expect(parseProductListUrl(['figuras-de-resina']))
        .toEqual({ categoria: 'figuras-de-resina' })
    })

    it('should parse tag segment', () => {
      expect(parseProductListUrl(['etiqueta-timo']))
        .toEqual({ etiqueta: 'timo' })
    })

    it('should parse pagination segment', () => {
      expect(parseProductListUrl(['pagina-2']))
        .toEqual({ pagina: 2 })
    })

    it('should parse ordering segment', () => {
      expect(parseProductListUrl(['orden-precio-asc']))
        .toEqual({ orden: 'precio-asc' })
    })

    it('should parse category and tag', () => {
      expect(parseProductListUrl(['figuras-de-resina', 'etiqueta-timo']))
        .toEqual({ 
          categoria: 'figuras-de-resina', 
          etiqueta: 'timo' 
        })
    })

    it('should parse all segments together', () => {
      expect(parseProductListUrl([
        'figuras-de-resina',
        'etiqueta-timo',
        'pagina-3',
        'orden-precio-desc'
      ])).toEqual({
        categoria: 'figuras-de-resina',
        etiqueta: 'timo',
        pagina: 3,
        orden: 'precio-desc'
      })
    })

    it('should handle only the first category segment', () => {
      expect(parseProductListUrl(['categoria1', 'categoria2']))
        .toEqual({ categoria: 'categoria1' })
    })

    it('should handle invalid pagination numbers', () => {
      expect(parseProductListUrl(['pagina-abc']))
        .toEqual({})
    })

    it('should parse multi-word category slugs', () => {
      expect(parseProductListUrl(['figuras-de-resina-pintadas']))
        .toEqual({ categoria: 'figuras-de-resina-pintadas' })
    })

    it('should parse multi-word tag slugs', () => {
      expect(parseProductListUrl(['etiqueta-timo-y-pumba']))
        .toEqual({ etiqueta: 'timo-y-pumba' })
    })

    it('should handle mixed order of segments', () => {
      expect(parseProductListUrl([
        'pagina-2',
        'figuras-de-resina',
        'orden-precio-asc',
        'etiqueta-disney'
      ])).toEqual({
        categoria: 'figuras-de-resina',
        etiqueta: 'disney',
        pagina: 2,
        orden: 'precio-asc'
      })
    })
  })

  describe('isProductSlug', () => {
    it('should return true for valid product slugs ending in number', () => {
      expect(isProductSlug('figura-timo-123')).toBe(true)
      expect(isProductSlug('producto-1')).toBe(true)
      expect(isProductSlug('mi-producto-increible-456')).toBe(true)
    })

    it('should return false for slugs not ending in number', () => {
      expect(isProductSlug('figuras-de-resina')).toBe(false)
      expect(isProductSlug('etiqueta-timo')).toBe(false)
      expect(isProductSlug('categoria')).toBe(false)
    })

    it('should return false for slugs ending in non-numeric text', () => {
      expect(isProductSlug('producto-abc')).toBe(false)
      expect(isProductSlug('test-123abc')).toBe(false)
    })

    it('should return true for single number slug', () => {
      expect(isProductSlug('123')).toBe(true)
    })

    it('should return false for empty string', () => {
      expect(isProductSlug('')).toBe(false)
    })

    it('should handle slugs with multiple dashes', () => {
      expect(isProductSlug('mi-super-producto-especial-789')).toBe(true)
      expect(isProductSlug('mi-super-categoria-especial')).toBe(false)
    })
  })

  describe('round-trip conversion', () => {
    it('should maintain data through build and parse', () => {
      const filters = {
        categoria: 'figuras-de-resina',
        etiqueta: 'timo',
        pagina: 2,
        orden: 'precio-asc'
      }
      
      const url = buildProductListUrl(filters)
      // Remove /mundo-grimmiz/ prefix and trailing slash, then split
      const segments = url.replace('/mundo-grimmiz/', '').replace(/\/$/, '').split('/')
      const parsed = parseProductListUrl(segments)
      
      expect(parsed).toEqual(filters)
    })

    it('should handle simple category round-trip', () => {
      const filters = { categoria: 'laminas' }
      const url = buildProductListUrl(filters)
      const segments = url.replace('/mundo-grimmiz/', '').replace(/\/$/, '').split('/')
      const parsed = parseProductListUrl(segments.filter(s => s !== ''))
      
      expect(parsed).toEqual(filters)
    })
  })
})


