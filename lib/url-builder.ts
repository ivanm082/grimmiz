// lib/url-builder.ts

export interface ProductFilters {
  categoria?: string
  etiqueta?: string
  pagina?: number
  orden?: string
}

/**
 * Convierte los filtros en segmentos de URL SEO-friendly
 * Ejemplo: { categoria: 'figuras-de-resina', etiqueta: 'timo', pagina: 2, orden: 'precio-asc' }
 * → '/mundo-grimmiz/figuras-de-resina/etiqueta-timo/pagina-2/orden-precio-asc/'
 */
export function buildProductListUrl(filters: ProductFilters): string {
  const segments: string[] = ['/mundo-grimmiz']

  // Agregar categoría
  if (filters.categoria) {
    segments.push(filters.categoria)
  }

  // Agregar etiqueta
  if (filters.etiqueta) {
    segments.push(`etiqueta-${filters.etiqueta}`)
  }

  // Agregar paginación (solo si es mayor a 1)
  if (filters.pagina && filters.pagina > 1) {
    segments.push(`pagina-${filters.pagina}`)
  }

  // Agregar ordenación (solo si no es el predeterminado)
  if (filters.orden && filters.orden !== 'recientes') {
    segments.push(`orden-${filters.orden}`)
  }

  // Añadir trailing slash al final
  return segments.join('/') + '/'
}

/**
 * Parsea los segmentos de URL y extrae los filtros
 * Ejemplo: ['figuras-de-resina', 'etiqueta-timo', 'pagina-2', 'orden-precio-asc']
 * → { categoria: 'figuras-de-resina', etiqueta: 'timo', pagina: 2, orden: 'precio-asc' }
 */
export function parseProductListUrl(segments: string[] = []): ProductFilters {
  const filters: ProductFilters = {}

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]

    // Si el segmento empieza con un prefijo conocido, procesarlo
    if (segment.startsWith('etiqueta-')) {
      filters.etiqueta = segment.replace('etiqueta-', '')
    } else if (segment.startsWith('pagina-')) {
      const pageNum = parseInt(segment.replace('pagina-', ''), 10)
      if (!isNaN(pageNum)) {
        filters.pagina = pageNum
      }
    } else if (segment.startsWith('orden-')) {
      filters.orden = segment.replace('orden-', '')
    } else {
      // Si no tiene prefijo, asumimos que es una categoría
      // (solo si no hemos encontrado ya una categoría)
      if (!filters.categoria) {
        filters.categoria = segment
      }
    }
  }

  return filters
}

/**
 * Verifica si un slug es un producto individual o un filtro
 * Los productos tienen formato: nombre-producto-123 (terminan en número)
 */
export function isProductSlug(slug: string): boolean {
  const parts = slug.split('-')
  const lastPart = parts[parts.length - 1]
  return !isNaN(Number(lastPart)) && lastPart.length > 0
}

