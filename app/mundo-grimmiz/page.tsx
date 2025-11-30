import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import ProductFilters from '@/components/ProductFilters'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

interface MundoGrimmizPageProps {
  searchParams: {
    categoria?: string
    orden?: string
    pagina?: string
  }
}

const PRODUCTS_PER_PAGE = 12

export default async function MundoGrimmizPage({ searchParams }: MundoGrimmizPageProps) {
  const supabase = createClient()

  // Obtener parámetros de búsqueda
  const categorySlug = searchParams.categoria
  const sortOrder = searchParams.orden || 'recientes'
  const currentPage = parseInt(searchParams.pagina || '1', 10)

  // Obtener todas las categorías para el filtro
  const { data: categories } = await supabase
    .from('category')
    .select('*')
    .order('name', { ascending: true })

  // Construir query de productos
  let query = supabase
    .from('product')
    .select('id, title, description, price, main_image_url, slug, category_id, updated_at, category:category_id(id, name, slug)', { count: 'exact' })

  // Filtrar por categoría si se especifica
  if (categorySlug) {
    const selectedCategory = categories?.find(cat => cat.slug === categorySlug)
    if (selectedCategory) {
      query = query.eq('category_id', selectedCategory.id)
    }
  }

  // Aplicar ordenación
  switch (sortOrder) {
    case 'precio-asc':
      query = query.order('price', { ascending: true })
      break
    case 'precio-desc':
      query = query.order('price', { ascending: false })
      break
    case 'recientes':
    default:
      query = query.order('updated_at', { ascending: false })
      break
  }

  // Aplicar paginación
  const from = (currentPage - 1) * PRODUCTS_PER_PAGE
  const to = from + PRODUCTS_PER_PAGE - 1
  query = query.range(from, to)

  // Ejecutar query
  const { data: products, error: productsError, count } = await query

  // Formatear productos
  const formattedProducts = products?.map((product: any) => ({
    id: product.id?.toString() || '',
    name: product.title || `Producto ${product.id}`,
    price: Number(product.price) || 0,
    image: product.main_image_url || '',
    description: product.description || '',
    slug: product.slug || product.title?.toLowerCase().replace(/\s+/g, '-') || `producto-${product.id}`
  })) || []

  // Calcular total de páginas
  const totalPages = count ? Math.ceil(count / PRODUCTS_PER_PAGE) : 1

  // Encontrar categoría seleccionada para las migas de pan
  const selectedCategory = categories?.find(cat => cat.slug === categorySlug)

  // Construir URL para paginación
  const buildPaginationUrl = (pageNum: number) => {
    const params = new URLSearchParams()
    if (categorySlug) params.set('categoria', categorySlug)
    if (sortOrder && sortOrder !== 'recientes') params.set('orden', sortOrder)
    if (pageNum > 1) params.set('pagina', pageNum.toString())

    const queryString = params.toString()
    return `/mundo-grimmiz${queryString ? `?${queryString}` : ''}`
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Breadcrumbs */}
        <div className="bg-gray-50 py-3 text-sm text-grimmiz-text-secondary">
          <div className="container mx-auto px-4">
            <nav className="flex items-center space-x-2">
              <Link href="/" className="hover:text-primary transition-colors">
                Inicio
              </Link>
              <span>/</span>
              {selectedCategory ? (
                <>
                  <Link href="/mundo-grimmiz" className="hover:text-primary transition-colors">
                    Mundo Grimmiz
                  </Link>
                  <span>/</span>
                  <span className="text-grimmiz-text font-medium">{selectedCategory.name}</span>
                </>
              ) : (
                <span className="text-grimmiz-text font-medium">Mundo Grimmiz</span>
              )}
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-gray-50 py-6">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl md:text-3xl font-bold text-grimmiz-text mb-2">
              {selectedCategory ? selectedCategory.name : 'Mundo Grimmiz'}
            </h1>
            <p className="text-sm md:text-base text-grimmiz-text-secondary">
              {selectedCategory
                ? `Descubre todos nuestros productos de ${selectedCategory.name.toLowerCase()}`
                : 'Explora nuestra colección completa de productos hechos a mano con amor'}
            </p>
          </div>
        </section>

        {/* Filtros y Ordenación */}
        <section className="bg-white border-b border-gray-200 sticky top-[72px] md:top-[96px] z-40 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <ProductFilters
              categories={categories || []}
              currentCategory={categorySlug}
              currentSort={sortOrder}
            />
          </div>
        </section>

        {/* Galería de Productos */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            {/* Contador de resultados */}
            <div className="mb-6 text-grimmiz-text-secondary">
              {count !== null && count !== undefined && (
                <p>
                  Mostrando {formattedProducts.length > 0 ? from + 1 : 0} - {Math.min(from + formattedProducts.length, count)} de {count} productos
                </p>
              )}
            </div>

            {/* Error al cargar productos */}
            {productsError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8 text-center">
                <p className="font-bold">Error al cargar productos:</p>
                <p>{productsError.message || 'No se pudieron cargar los productos'}</p>
              </div>
            )}

            {/* Sin productos */}
            {!productsError && formattedProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-2xl font-bold text-grimmiz-text mb-2">No hay productos disponibles</h2>
                <p className="text-grimmiz-text-secondary mb-6">
                  {categorySlug
                    ? 'No se encontraron productos en esta categoría.'
                    : 'No hay productos disponibles en este momento.'}
                </p>
                {categorySlug && (
                  <Link
                    href="/mundo-grimmiz"
                    className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                  >
                    Ver todos los productos
                  </Link>
                )}
              </div>
            )}

            {/* Grid de productos */}
            {!productsError && formattedProducts.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {formattedProducts.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center items-center gap-2">
                    {/* Botón anterior */}
                    {currentPage > 1 ? (
                      <Link
                        href={buildPaginationUrl(currentPage - 1)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-grimmiz-text"
                      >
                        ← Anterior
                      </Link>
                    ) : (
                      <span className="px-4 py-2 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed">
                        ← Anterior
                      </span>
                    )}

                    {/* Números de página */}
                    <div className="flex gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                        // Mostrar solo algunas páginas alrededor de la actual
                        const showPage =
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)

                        if (!showPage) {
                          // Mostrar puntos suspensivos
                          if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                            return (
                              <span key={pageNum} className="px-3 py-2 text-grimmiz-text-secondary">
                                ...
                              </span>
                            )
                          }
                          return null
                        }

                        return pageNum === currentPage ? (
                          <span
                            key={pageNum}
                            className="px-4 py-2 bg-primary text-white rounded-lg font-semibold"
                          >
                            {pageNum}
                          </span>
                        ) : (
                          <Link
                            key={pageNum}
                            href={buildPaginationUrl(pageNum)}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-grimmiz-text"
                          >
                            {pageNum}
                          </Link>
                        )
                      })}
                    </div>

                    {/* Botón siguiente */}
                    {currentPage < totalPages ? (
                      <Link
                        href={buildPaginationUrl(currentPage + 1)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-grimmiz-text"
                      >
                        Siguiente →
                      </Link>
                    ) : (
                      <span className="px-4 py-2 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed">
                        Siguiente →
                      </span>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

