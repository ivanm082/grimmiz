import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BlogArticleCard from '@/components/BlogArticleCard'
import BlogFilters from '@/components/BlogFilters'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { buildBlogListUrl, type BlogFilters as Filters } from '@/lib/url-builder'

// Re-export the BlogFilters type for use in other files
export type BlogFilters = Filters

interface DiarioGrimmizContentProps {
  filters: Filters
}

const ARTICLES_PER_PAGE = 12

export default async function DiarioGrimmizContent({ filters }: DiarioGrimmizContentProps) {
  const supabase = createClient()

  // Extraer filtros
  const categorySlug = filters.categoria
  const tagSlug = filters.etiqueta
  const sortOrder = filters.orden || 'recientes'
  const currentPage = filters.pagina || 1

  // Obtener IDs de categorías que tienen artículos publicados
  const { data: categoriesWithArticles } = await supabase
    .from('blog_article')
    .select('category_id')
    .eq('published', true)

  const categoryIdsWithArticles = Array.from(new Set(categoriesWithArticles?.map(a => a.category_id) || []))

  // Obtener todas las categorías que tienen artículos publicados
  const { data: categories } = await supabase
    .from('category')
    .select('*')
    .in('id', categoryIdsWithArticles.length > 0 ? categoryIdsWithArticles : [-1])
    .order('name', { ascending: true })

  // Si hay filtro por etiqueta, obtener los IDs de artículos con esa etiqueta
  let articleIdsWithTag: number[] | null = null
  let selectedTag = null
  
  if (tagSlug) {
    // Obtener la etiqueta por slug
    const { data: tag } = await supabase
      .from('tag')
      .select('*')
      .eq('slug', tagSlug)
      .single()

    if (tag) {
      selectedTag = tag
      
      // Obtener los IDs de artículos que tienen esta etiqueta
      const { data: articleTags } = await supabase
        .from('blog_article_tag')
        .select('blog_article_id')
        .eq('tag_id', tag.id)

      articleIdsWithTag = articleTags?.map(at => at.blog_article_id) || []
    }
  }

  // Construir query de artículos
  let query = supabase
    .from('blog_article')
    .select('id, title, excerpt, main_image_url, slug, category_id, created_at, updated_at, category:category_id(id, name, slug)', { count: 'exact' })
    .eq('published', true)

  // Filtrar por categoría si se especifica
  if (categorySlug) {
    const selectedCategory = categories?.find(cat => cat.slug === categorySlug)
    if (selectedCategory) {
      query = query.eq('category_id', selectedCategory.id)
    }
  }

  // Filtrar por etiqueta si se especifica
  if (articleIdsWithTag !== null) {
    if (articleIdsWithTag.length === 0) {
      // Si no hay artículos con esa etiqueta, retornar vacío
      query = query.eq('id', -1) // ID que nunca existirá
    } else {
      query = query.in('id', articleIdsWithTag)
    }
  }

  // Aplicar ordenación
  switch (sortOrder) {
    case 'antiguos':
      query = query.order('created_at', { ascending: true })
      break
    case 'titulo-asc':
      query = query.order('title', { ascending: true })
      break
    case 'titulo-desc':
      query = query.order('title', { ascending: false })
      break
    case 'recientes':
    default:
      query = query.order('updated_at', { ascending: false })
      break
  }

  // Aplicar paginación
  const from = (currentPage - 1) * ARTICLES_PER_PAGE
  const to = from + ARTICLES_PER_PAGE - 1
  query = query.range(from, to)

  // Ejecutar query
  const { data: articles, error: articlesError, count } = await query

  // Calcular total de páginas
  const totalPages = count ? Math.ceil(count / ARTICLES_PER_PAGE) : 1

  // Encontrar categoría seleccionada para las migas de pan
  const selectedCategory = categories?.find(cat => cat.slug === categorySlug)

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
                  <Link href="/diario-grimmiz/" className="hover:text-primary transition-colors">
                    Diario Grimmiz
                  </Link>
                  <span>/</span>
                  <span className="text-grimmiz-text font-medium">{selectedCategory.name}</span>
                </>
              ) : selectedTag ? (
                <>
                  <Link href="/diario-grimmiz/" className="hover:text-primary transition-colors">
                    Diario Grimmiz
                  </Link>
                  <span>/</span>
                  <span className="text-grimmiz-text font-medium flex items-center">
                    <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {selectedTag.name}
                  </span>
                </>
              ) : (
                <span className="text-grimmiz-text font-medium">Diario Grimmiz</span>
              )}
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-gray-50 py-6">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl md:text-3xl font-bold text-grimmiz-text mb-2">
              {selectedCategory ? selectedCategory.name : 'Diario Grimmiz'}
              {selectedTag && ` #${selectedTag.name}`}
              {currentPage > 1 && ` - página ${currentPage}`}
            </h1>
            <p className="text-sm md:text-base text-grimmiz-text-secondary">
              {selectedCategory
                ? `Artículos de ${selectedCategory.name.toLowerCase()}`
                : 'Historias, tutoriales y novedades del mundo de las manualidades'}
            </p>
          </div>
        </section>

        {/* Filtros y Ordenación */}
        <section className="bg-white border-b border-gray-200 sticky top-[72px] md:top-[96px] z-40 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <BlogFilters
              categories={categories || []}
              currentCategory={categorySlug}
              currentTag={selectedTag}
              currentSort={sortOrder}
              currentPage={currentPage}
            />
          </div>
        </section>

        {/* Galería de Artículos */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            {/* Contador de resultados */}
            <div className="mb-6 text-grimmiz-text-secondary">
              {count !== null && count !== undefined && (
                <p>
                  Mostrando {articles && articles.length > 0 ? from + 1 : 0} - {articles ? Math.min(from + articles.length, count) : 0} de {count} artículos
                </p>
              )}
            </div>

            {/* Error al cargar artículos */}
            {articlesError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8 text-center">
                <p className="font-bold">Error al cargar artículos:</p>
                <p>{articlesError.message || 'No se pudieron cargar los artículos'}</p>
              </div>
            )}

            {/* Sin artículos */}
            {!articlesError && (!articles || articles.length === 0) && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-2xl font-bold text-grimmiz-text mb-2">No hay artículos disponibles</h2>
                <p className="text-grimmiz-text-secondary mb-6">
                  {categorySlug
                    ? 'No se encontraron artículos en esta categoría.'
                    : 'No hay artículos disponibles en este momento.'}
                </p>
                {categorySlug && (
                  <Link
                    href="/diario-grimmiz/"
                    className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                  >
                    Ver todos los artículos
                  </Link>
                )}
              </div>
            )}

            {/* Grid de artículos */}
            {!articlesError && articles && articles.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {articles.map((article: any) => (
                    <BlogArticleCard key={article.id} article={article} />
                  ))}
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center items-center gap-2">
                    {/* Botón anterior */}
                    {currentPage > 1 ? (
                      <Link
                        href={buildBlogListUrl({ ...filters, pagina: currentPage - 1 })}
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
                            href={buildBlogListUrl({ ...filters, pagina: pageNum })}
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
                        href={buildBlogListUrl({ ...filters, pagina: currentPage + 1 })}
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

