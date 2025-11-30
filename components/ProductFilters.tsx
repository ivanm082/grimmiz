'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Category {
  id: number
  name: string
  slug: string
}

interface Tag {
  id: number
  name: string
  slug: string
}

interface ProductFiltersProps {
  categories: Category[]
  currentCategory?: string
  currentTag?: Tag | null
  currentSort: string
}

export default function ProductFilters({
  categories,
  currentCategory,
  currentTag,
  currentSort
}: ProductFiltersProps) {
  const router = useRouter()

  // Construir URL para filtros
  const buildFilterUrl = (newParams: Record<string, string | null | undefined>) => {
    const params = new URLSearchParams()
    
    // Si está en newParams, usar ese valor (null = eliminar)
    // Si no está en newParams, usar el valor actual
    const categoria = 'categoria' in newParams ? newParams.categoria : currentCategory
    const etiqueta = 'etiqueta' in newParams ? newParams.etiqueta : currentTag?.slug
    const orden = 'orden' in newParams ? newParams.orden : currentSort
    const pagina = 'pagina' in newParams ? newParams.pagina : '1'

    if (categoria) params.set('categoria', categoria)
    if (etiqueta) params.set('etiqueta', etiqueta)
    if (orden && orden !== 'recientes') params.set('orden', orden)
    if (pagina && pagina !== '1') params.set('pagina', pagina)

    const queryString = params.toString()
    return `/mundo-grimmiz${queryString ? `?${queryString}` : ''}`
  }

  const handleSortChange = (value: string) => {
    const url = buildFilterUrl({ orden: value, pagina: '1' })
    router.push(url)
  }

  const handleRemoveFilter = (filterType: 'categoria' | 'etiqueta' | 'orden') => {
    if (filterType === 'categoria') {
      const url = buildFilterUrl({ categoria: null, pagina: '1' })
      router.push(url)
    } else if (filterType === 'etiqueta') {
      const url = buildFilterUrl({ etiqueta: null, pagina: '1' })
      router.push(url)
    } else {
      const url = buildFilterUrl({ orden: 'recientes', pagina: '1' })
      router.push(url)
    }
  }

  const selectedCategory = categories.find(cat => cat.slug === currentCategory)

  return (
    <div className="space-y-4">
      {/* Categorías y Ordenación en la misma línea */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        {/* Filtro por Categoría - Enlaces para SEO */}
        <div className="flex-grow min-w-[300px]">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-sm font-semibold text-grimmiz-text">Categorías:</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={buildFilterUrl({ categoria: null, pagina: '1' })}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !currentCategory
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-100 text-grimmiz-text hover:bg-gray-200'
              }`}
            >
              Todas
            </Link>
            {categories.map((category) => {
              const isActive = currentCategory === category.slug
              const categoryUrl = buildFilterUrl({ categoria: category.slug, pagina: '1' })
              
              return (
                <Link
                  key={category.id}
                  href={categoryUrl}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-grimmiz-text hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Ordenación */}
        <div className="shrink-0">
          <label htmlFor="sort-filter" className="block text-sm font-semibold text-grimmiz-text mb-2">
            Ordenar por:
          </label>
          <select
            id="sort-filter"
            value={currentSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-grimmiz-text"
          >
            <option value="recientes">Más recientes</option>
            <option value="precio-asc">Precio: menor a mayor</option>
            <option value="precio-desc">Precio: mayor a menor</option>
          </select>
        </div>
      </div>

      {/* Filtros activos */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Etiqueta activa */}
        {currentTag && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-grimmiz-text-secondary">Etiqueta:</span>
            <button
              onClick={() => handleRemoveFilter('etiqueta')}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm hover:bg-primary/20 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              {currentTag.name}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Ordenación activa */}
        {currentSort !== 'recientes' && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-grimmiz-text-secondary">Ordenación:</span>
            <button
              onClick={() => handleRemoveFilter('orden')}
              className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm hover:bg-secondary/20 transition-colors"
            >
              {currentSort === 'precio-asc' ? 'Precio: menor a mayor' : 'Precio: mayor a menor'}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

