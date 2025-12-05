import { parseProductListUrl, isProductSlug, buildProductListUrl } from '@/lib/url-builder'
import { notFound, redirect } from 'next/navigation'
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import MundoGrimmizContent from '../MundoGrimmizContent'

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

const PRODUCTS_PER_PAGE = 12

/**
 * Genera los metadatos de la página (incluyendo title, robots meta tag y canonical)
 * Se ejecuta en el servidor (SSR)
 */
export async function generateMetadata({ params }: FilterPageProps): Promise<Metadata> {
  const segments = params.filters || []
  const filters = parseProductListUrl(segments)
  const supabase = createClient()

  // Obtener el dominio base desde variables de entorno o usar valor por defecto en desarrollo
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  // Extraer filtros
  const categorySlug = filters.categoria
  const tagSlug = filters.etiqueta
  const currentPage = filters.pagina || 1
  const hasOrdering = filters.orden && filters.orden !== 'recientes'

  // Obtener datos para construir el título (se necesita siempre, con o sin ordenación)
  let categoryName = null
  let tagName = null
  let totalPages = 1

  // Obtener categoría si existe
  if (categorySlug) {
    const { data: category } = await supabase
      .from('category')
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
      .from('tag')
      .select('id, name')
      .eq('slug', tagSlug)
      .single()
    
    if (tag) {
      tagName = tag.name
    }
  }

  // Calcular total de páginas si estamos en página > 1
  if (currentPage > 1) {
    // Construir query para contar productos
    let countQuery = supabase
      .from('product')
      .select('id', { count: 'exact', head: true })

    // Filtrar por categoría
    if (categorySlug) {
      const { data: categories } = await supabase
        .from('category')
        .select('id')
        .eq('slug', categorySlug)
        .single()
      
      if (categories) {
        countQuery = countQuery.eq('category_id', categories.id)
      }
    }

    // Filtrar por etiqueta
    if (tagSlug) {
      const { data: tag } = await supabase
        .from('tag')
        .select('id')
        .eq('slug', tagSlug)
        .single()

      if (tag) {
        const { data: productTags } = await supabase
          .from('product_tag')
          .select('product_id')
          .eq('tag_id', tag.id)

        const productIds = productTags?.map(pt => pt.product_id) || []
        if (productIds.length === 0) {
          countQuery = countQuery.eq('id', -1)
        } else {
          countQuery = countQuery.in('id', productIds)
        }
      }
    }

    const { count } = await countQuery
    if (count) {
      totalPages = Math.ceil(count / PRODUCTS_PER_PAGE)
    }
  }

  // Construir el título
  let title = categoryName || 'Mundo Grimmiz'
  
  // Añadir etiqueta si existe
  if (tagName) {
    title += ` #${tagName}`
  }
  
  // Añadir paginación si no es página 1
  if (currentPage > 1) {
    title += ` - página ${currentPage} de ${totalPages}`
  }
  
  // Añadir " | Grimmiz" al final
  title += ' | Grimmiz'

  // Construir la descripción dinámica
  let description = ''
  
  if (categoryName && tagName) {
    description = `Explora nuestra colección de ${categoryName.toLowerCase()} con la etiqueta ${tagName}`
  } else if (categoryName) {
    description = `Descubre todos nuestros productos de ${categoryName.toLowerCase()} hechos a mano con dedicación y cariño`
  } else if (tagName) {
    description = `Productos de manualidades artesanales con la etiqueta ${tagName}`
  } else {
    description = 'Explora nuestra colección completa de productos artesanales hechos a mano. Figuras de resina, láminas personalizadas y mucho más'
  }

  // Añadir información de ordenación a la descripción
  if (hasOrdering) {
    const ordenTexto = filters.orden === 'precio-asc' 
      ? 'ordenados por precio ascendente'
      : filters.orden === 'precio-desc'
      ? 'ordenados por precio descendente'
      : 'ordenados por más recientes'
    description += `, ${ordenTexto}`
  }

  // Añadir información de paginación si aplica
  if (currentPage > 1) {
    description += `. Página ${currentPage} de ${totalPages}`
  }

  description += '.'

  // Si hay parámetro de ordenación (y no es el default), añadir noindex, nofollow
  if (hasOrdering) {
    return {
      title,
      description,
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  // Para páginas indexables, añadir canonical
  const canonicalPath = buildProductListUrl(filters)
  const canonicalUrl = `${baseUrl}${canonicalPath}`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

export default function FilterPage({ params, searchParams }: FilterPageProps) {
  const segments = params.filters || []

  // Si hay searchParams (URLs antiguas con query params), redirigir a la nueva estructura
  if (Object.keys(searchParams).length > 0) {
    const newUrl = buildProductListUrl({
      categoria: searchParams.categoria,
      etiqueta: searchParams.etiqueta,
      pagina: searchParams.pagina ? parseInt(searchParams.pagina, 10) : undefined,
      orden: searchParams.orden
    })
    redirect(newUrl)
  }

  // Parsear los filtros desde los segmentos de URL
  const filters = parseProductListUrl(segments)

  return <MundoGrimmizContent filters={filters} />
}

