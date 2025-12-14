'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { buildBlogListUrl } from '@/lib/url-builder'

interface BlogCategory {
  id: number
  name: string
  slug: string
}

interface BlogTag {
  id: number
  name: string
  slug: string
}

interface BlogFiltersProps {
  categories: BlogCategory[]
  currentCategory?: string
  currentTag?: BlogTag | null
  currentSort: string
  currentPage?: number
}

export default function BlogFilters({
  categories,
  currentCategory,
  currentTag,
  currentSort,
  currentPage = 1
}: BlogFiltersProps) {
  const router = useRouter()

  const handleSortChange = (value: string) => {
    const url = buildBlogListUrl({
      categoria: currentCategory,
      etiqueta: currentTag?.slug,
      orden: value,
      pagina: 1 // Resetear a página 1 al cambiar orden
    })
    router.push(url)
  }

  const handleRemoveFilter = (filterType: 'categoria' | 'etiqueta') => {
    if (filterType === 'categoria') {
      const url = buildBlogListUrl({
        etiqueta: currentTag?.slug,
        orden: currentSort,
        pagina: 1
      })
      router.push(url)
    } else if (filterType === 'etiqueta') {
      const url = buildBlogListUrl({
        categoria: currentCategory,
        orden: currentSort,
        pagina: 1
      })
      router.push(url)
    }
  }

  return (
    <div className="space-y-4">
      {/* Contenedor principal con flex */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        {/* Grupo izquierdo: Categorías + Etiqueta */}
        <div className="flex-grow min-w-[300px] space-y-4">
          {/* Filtro por Categoría - Enlaces para SEO */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-sm font-semibold text-grimmiz-text">Categorías:</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={buildBlogListUrl({
                  etiqueta: currentTag?.slug,
                  orden: currentSort
                })}
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
                const categoryUrl = buildBlogListUrl({
                  categoria: category.slug,
                  etiqueta: currentTag?.slug,
                  orden: currentSort
                })
                
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
        </div>

        {/* Grupo derecho: Ordenación */}
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
            <option value="antiguos">Más antiguos</option>
            <option value="titulo-asc">Título (A-Z)</option>
            <option value="titulo-desc">Título (Z-A)</option>
          </select>
        </div>
      </div>
    </div>
  )
}

