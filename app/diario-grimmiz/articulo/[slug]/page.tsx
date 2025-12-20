import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import BlogArticleCard from '@/components/BlogArticleCard'
import ArticleContent from '@/components/ArticleContent'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { buildBlogListUrl, buildProductListUrl } from '@/lib/url-builder'
import { Metadata } from 'next'

interface ArticlePageProps {
  params: {
    slug: string
  }
}

/**
 * Genera los metadatos de la página de artículo (incluyendo title y canonical)
 */
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const supabase = createClient()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const canonicalUrl = `${baseUrl}/diario-grimmiz/articulo/${params.slug}/`

  // Obtener el artículo con su categoría y extracto para construir el título y la meta description
  const { data: article } = await supabase
    .from('blog_article')
    .select(`
      title,
      excerpt,
      category:category_id (
        name
      )
    `)
    .eq('slug', params.slug)
    .eq('published', true)
    .single()

  // Normalizar la categoría (puede venir como array o objeto)
  const category = article ? (Array.isArray(article.category) ? article.category[0] : article.category) : null

  // Construir el título: "{nombre-del-artículo} | {categoria} | Diario Grimmiz"
  let title = 'Artículo | Diario Grimmiz' // Fallback por si falla la query
  let description = 'Artículo del Diario Grimmiz - Inspiración, tutoriales y consejos de manualidades.'
  
  if (article) {
    const categoryName = category?.name || 'Artículos'
    title = `${article.title} | ${categoryName} | Diario Grimmiz`
    
    // Usar el extracto como descripción si está disponible
    description = article.excerpt || description
  }
  
  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const supabase = createClient()

  // Obtener el artículo con su categoría
  const { data: article, error: articleError } = await supabase
    .from('blog_article')
    .select(`
      id,
      title,
      slug,
      excerpt,
      content,
      main_image_url,
      created_at,
      updated_at,
      category_id,
      category:category_id (
        id,
        name,
        slug
      )
    `)
    .eq('slug', params.slug)
    .eq('published', true)
    .single()

  // Si no se encuentra el artículo, retornar notFound
  if (articleError || !article) {
    notFound()
  }

  // Normalizar la categoría (puede venir como array o objeto)
  const category = Array.isArray(article.category) ? article.category[0] : article.category

  // Obtener imágenes adicionales del artículo
  const { data: additionalImages } = await supabase
    .from('blog_article_image')
    .select('*')
    .eq('blog_article_id', article.id)
    .order('display_order', { ascending: true })

  // Obtener etiquetas del artículo
  const { data: articleTagsData } = await supabase
    .from('blog_article_tag')
    .select(`
      tag:tag_id (
        id,
        name,
        slug
      )
    `)
    .eq('blog_article_id', article.id)

  const tags = articleTagsData?.map((item: any) => item.tag).filter(Boolean) || []

  // Preparar array de imágenes para la galería (imagen principal + adicionales)
  const allImages = []
  
  // Agregar imagen principal como primera imagen
  if (article.main_image_url) {
    allImages.push({
      id: 'main',
      url: article.main_image_url,
      alt: article.title
    })
  }
  
  // Agregar imágenes adicionales
  if (additionalImages && additionalImages.length > 0) {
    additionalImages.forEach((img: any) => {
      if (img.image_url) {
        allImages.push({
          id: img.id,
          url: img.image_url,
          alt: `${article.title} - imagen ${img.display_order || ''}`
        })
      }
    })
  }

  // Obtener artículos relacionados basados en categoría y etiquetas
  const tagIds = tags.map(t => t.id)
  
  // Obtener todos los artículos publicados con su categoría
  const { data: allArticles } = await supabase
    .from('blog_article')
    .select(`
      id,
      title,
      slug,
      excerpt,
      main_image_url,
      created_at,
      updated_at,
      category_id,
      category:category_id(id, name, slug)
    `)
    .eq('published', true)
    .neq('id', article.id)

  // Obtener las etiquetas de cada artículo
  const { data: allArticleTagsData } = await supabase
    .from('blog_article_tag')
    .select('blog_article_id, tag_id')

  // Crear un mapa de artículo_id -> tag_ids
  const articleTagsMap = new Map<number, number[]>()
  allArticleTagsData?.forEach(at => {
    if (!articleTagsMap.has(at.blog_article_id)) {
      articleTagsMap.set(at.blog_article_id, [])
    }
    articleTagsMap.get(at.blog_article_id)?.push(at.tag_id)
  })

  // Calcular relevancia de cada artículo
  const articlesWithRelevance = allArticles?.map(a => {
    let relevanceScore = 0

    // +10 puntos si coincide la categoría
    if (a.category_id === article.category_id) {
      relevanceScore += 10
    }

    // +1 punto por cada etiqueta coincidente
    const aTagIds = articleTagsMap.get(a.id) || []
    const matchingTags = aTagIds.filter(tagId => tagIds.includes(tagId))
    relevanceScore += matchingTags.length

    // Normalizar la categoría
    const normalizedCategory = Array.isArray(a.category) ? a.category[0] : a.category

    return {
      ...a,
      category: normalizedCategory,
      relevanceScore
    }
  }) || []

  // Filtrar artículos con relevancia > 0 y ordenar por relevancia y fecha
  const relatedArticles = articlesWithRelevance
    .filter(a => a.relevanceScore > 0)
    .sort((a, b) => {
      // Primero por relevancia (descendente)
      if (b.relevanceScore !== a.relevanceScore) {
        return b.relevanceScore - a.relevanceScore
      }
      // En caso de empate, por fecha de modificación (descendente)
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    })
    .slice(0, 4)

  // Obtener productos relacionados basados en categoría y etiquetas
  const { data: allProducts } = await supabase
    .from('product')
    .select(`
      id,
      title,
      description,
      price,
      main_image_url,
      slug,
      category_id
    `)

  // Obtener las etiquetas de cada producto
  const { data: productTagsData } = await supabase
    .from('product_tag')
    .select('product_id, tag_id')

  // Crear un mapa de producto_id -> tag_ids
  const productTagsMap = new Map<number, number[]>()
  productTagsData?.forEach(pt => {
    if (!productTagsMap.has(pt.product_id)) {
      productTagsMap.set(pt.product_id, [])
    }
    productTagsMap.get(pt.product_id)?.push(pt.tag_id)
  })

  // Calcular relevancia de cada producto
  const productsWithRelevance = allProducts?.map(p => {
    let relevanceScore = 0

    // +10 puntos si coincide la categoría
    if (p.category_id === article.category_id) {
      relevanceScore += 10
    }

    // +1 punto por cada etiqueta coincidente
    const pTagIds = productTagsMap.get(p.id) || []
    const matchingTags = pTagIds.filter(tagId => tagIds.includes(tagId))
    relevanceScore += matchingTags.length

    return {
      ...p,
      relevanceScore
    }
  }) || []

  // Filtrar productos con relevancia > 0 y ordenar por relevancia
  const relatedProducts = productsWithRelevance
    .filter(p => p.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 4)

  const formattedRelatedProducts = relatedProducts.map((p: any) => ({
    id: p.id?.toString() || '',
    name: p.title || `Producto ${p.id}`,
    price: Number(p.price) || 0,
    image: p.main_image_url || '',
    description: p.description || '',
    slug: p.slug || p.title?.toLowerCase().replace(/\s+/g, '-') || `producto-${p.id}`
  }))

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Breadcrumbs */}
        <div className="bg-gray-50 py-3">
          <div className="container mx-auto px-4">
            <nav className="flex items-center space-x-2 text-sm text-grimmiz-text-secondary">
              <Link href="/" className="hover:text-primary transition-colors">
                Inicio
              </Link>
              <span>/</span>
              <Link href="/diario-grimmiz/" className="hover:text-primary transition-colors">
                Diario Grimmiz
              </Link>
              {category && (
                <>
                  <span>/</span>
                  <Link
                    href={buildBlogListUrl({ categoria: category.slug })}
                    className="hover:text-primary transition-colors"
                  >
                    {category.name}
                  </Link>
                </>
              )}
              <span>/</span>
              <span className="text-grimmiz-text font-medium">{article.title}</span>
            </nav>
          </div>
        </div>

        {/* Artículo Principal */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            {/* Información del artículo */}
            <div className="space-y-6">
              {/* Categoría */}
              {category && (
                <Link
                  href={buildBlogListUrl({ categoria: category.slug })}
                  className="inline-block text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                >
                  {category.name}
                </Link>
              )}

              {/* Título */}
              <h1 className="text-4xl md:text-5xl font-bold text-grimmiz-text leading-tight">
                {article.title}
              </h1>

              {/* Fecha de publicación */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <time dateTime={article.created_at}>
                    {new Date(article.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
                {article.updated_at !== article.created_at && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Actualizado: {new Date(article.updated_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}</span>
                  </div>
                )}
              </div>

              {/* Extracto */}
              {article.excerpt && (
                <p className="text-lg md:text-xl text-gray-600 italic border-l-4 border-primary pl-6 leading-relaxed">
                  {article.excerpt}
                </p>
              )}

              {/* Etiquetas */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag: any) => (
                    <Link
                      key={tag.id}
                      href={buildBlogListUrl({ etiqueta: tag.slug })}
                      className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {tag.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Imagen principal */}
            {article.main_image_url && (
              <div className="mt-12">
                <div className="aspect-[16/9] sm:aspect-[21/9] overflow-hidden rounded-lg shadow-lg">
                  <img
                    src={article.main_image_url}
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            )}

            {/* Contenido del artículo (Markdown) */}
            <div className="mt-12">
              <ArticleContent content={article.content} />
            </div>

            {/* Imágenes adicionales en mosaico */}
            {additionalImages && additionalImages.length > 0 && (
              <div className="mt-16">
                <h3 className="text-2xl font-bold text-grimmiz-text mb-8 text-center">
                  Galería de imágenes
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {additionalImages.map((img: any) => (
                    <div key={img.id} className="group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={img.image_url}
                          alt={`${article.title} - imagen ${img.display_order || ''}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Artículos Relacionados */}
        {relatedArticles.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-grimmiz-text mb-4">
                  Más artículos que te pueden interesar
                </h2>
                <p className="text-grimmiz-text-secondary text-lg">
                  Descubre más contenido relacionado
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <BlogArticleCard key={relatedArticle.id} article={relatedArticle} />
                ))}
              </div>

              <div className="text-center mt-8">
                <Link
                  href={category ? buildBlogListUrl({ categoria: category.slug }) : '/diario-grimmiz/'}
                  className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                >
                  Ver más artículos
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Productos Relacionados */}
        {formattedRelatedProducts.length > 0 && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-grimmiz-text mb-4">
                  Productos relacionados
                </h2>
                <p className="text-grimmiz-text-secondary text-lg">
                  Descubre productos que complementan este artículo
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {formattedRelatedProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>

              <div className="text-center mt-8">
                <Link
                  href={category ? buildProductListUrl({ categoria: category.slug }) : '/mundo-grimmiz/'}
                  className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                >
                  Ver todos los productos
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}

