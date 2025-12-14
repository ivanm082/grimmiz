import { parseBlogListUrl, buildBlogListUrl } from '@/lib/url-builder'
import { notFound, redirect } from 'next/navigation'
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import DiarioGrimmizContent, { type BlogFilters } from '../DiarioGrimmizContent'

interface FilterPageProps {
  params: {
    filters?: string[]
  }
  searchParams: {
    categoria?: string
    etiqueta?: string
    orden?: string
    pagina?: string
  }
}

const ARTICLES_PER_PAGE = 12

/**
 * Genera los metadatos de la página (incluyendo title, robots meta tag y canonical)
 * Se ejecuta en el servidor (SSR)
 */
export async function generateMetadata({ params }: FilterPageProps): Promise<Metadata> {
  const segments = params.filters || []
  const filters = parseBlogListUrl(segments)
  const supabase = createClient()

  // Obtener el dominio base desde variables de entorno o usar valor por defecto en desarrollo
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  // Extraer filtros
  const categorySlug = filters.categoria
  const tagSlug = filters.etiqueta
  const currentPage = filters.pagina || 1
  const hasOrdering = filters.orden && filters.orden !== 'recientes'

  // Obtener datos para construir el título
  let categoryName = null
  let tagName = null
  let totalPages = 1

  // Obtener categoría si existe
  if (categorySlug) {
    const { data: category } = await supabase
      .from('blog_category')
      .select('name')
      .eq('slug', categorySlug)
      .single()

    if (category) {
      categoryName = category.name
    }
  }

  // Obtener etiqueta si existe
  if (tagSlug) {
    const { data: tag } = await supabase
      .from('blog_tag')
      .select('name')
      .eq('slug', tagSlug)
      .single()

    if (tag) {
      tagName = tag.name
    }
  }

  // Calcular total de páginas si estamos en una página específica
  if (currentPage > 1) {
    let query = supabase.from('blog_article').select('id', { count: 'exact' }).eq('published', true)

    // Filtrar por categoría
    if (categorySlug) {
      const { data: category } = await supabase
        .from('blog_category')
        .select('id')
        .eq('slug', categorySlug)
        .single()

      if (category) {
        query = query.eq('blog_category_id', category.id)
      }
    }

    // Filtrar por etiqueta
    if (tagSlug) {
      const { data: tag } = await supabase
        .from('blog_tag')
        .select('id')
        .eq('slug', tagSlug)
        .single()

      if (tag) {
        const { data: articleTags } = await supabase
          .from('blog_article_tag')
          .select('blog_article_id')
          .eq('blog_tag_id', tag.id)

        const articleIds = articleTags?.map(at => at.blog_article_id) || []
        if (articleIds.length === 0) {
          query = query.eq('id', -1)
        } else {
          query = query.in('id', articleIds)
        }
      }
    }

    const { count } = await query
    totalPages = count ? Math.ceil(count / ARTICLES_PER_PAGE) : 1
  }

  // Construir título
  let pageTitle = categoryName || 'Diario Grimmiz'
  if (tagName) {
    pageTitle += ` #${tagName}`
  }
  if (currentPage > 1) {
    pageTitle += ` - página ${currentPage} de ${totalPages}`
  }

  // Construir descripción
  let pageDescription = 'Descubre historias, tutoriales y novedades del mundo de las manualidades en el Diario Grimmiz.'
  if (categoryName) {
    pageDescription = `Artículos de ${categoryName.toLowerCase()} en el Diario Grimmiz.`
  }
  if (tagName) {
    pageDescription = `Explora artículos sobre ${tagName.toLowerCase()} en el Diario Grimmiz.`
  }
  if (currentPage > 1) {
    pageDescription += ` Página ${currentPage} de ${totalPages}.`
  }
  if (hasOrdering) {
    const ordenTexto = filters.orden === 'antiguos' ? 'más antiguos primero' : `ordenados por ${filters.orden}`
    pageDescription += ` Artículos ${ordenTexto}.`
  }

  // Si hay ordenación, añadir noindex
  if (hasOrdering) {
    return {
      title: `${pageTitle} | Grimmiz`,
      description: pageDescription,
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  // URL canónica (sin ordenación)
  const canonicalPath = buildBlogListUrl({
    categoria: filters.categoria,
    etiqueta: filters.etiqueta,
    pagina: filters.pagina,
    orden: undefined // Canonical no incluye ordenación
  })
  const canonicalUrl = `${baseUrl}${canonicalPath}`

  return {
    title: `${pageTitle} | Grimmiz`,
    description: pageDescription,
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

export default function FilterPage({ params, searchParams }: FilterPageProps) {
  const segments = params.filters || []

  // Si hay query params antiguos, redirigir a la nueva URL SEO-friendly
  if (Object.keys(searchParams).length > 0) {
    const newUrl = buildBlogListUrl({
      categoria: searchParams.categoria,
      etiqueta: searchParams.etiqueta,
      pagina: searchParams.pagina ? parseInt(searchParams.pagina, 10) : undefined,
      orden: searchParams.orden
    })
    redirect(newUrl)
  }

  // Parsear los segmentos a filtros
  const filters = parseBlogListUrl(segments)

  return <DiarioGrimmizContent filters={filters} />
}

