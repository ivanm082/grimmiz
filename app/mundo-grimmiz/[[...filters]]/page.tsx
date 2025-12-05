import { parseProductListUrl, isProductSlug, buildProductListUrl } from '@/lib/url-builder'
import { notFound, redirect } from 'next/navigation'
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

