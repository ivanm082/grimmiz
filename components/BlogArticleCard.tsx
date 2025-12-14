'use client'

import Link from 'next/link'
import OptimizedImage from './OptimizedImage'

interface BlogCategory {
  id: number
  name: string
  slug: string
}

interface BlogArticle {
  id: number
  title: string
  slug: string
  excerpt: string
  main_image_url: string
  created_at: string
  category: BlogCategory
}

interface BlogArticleCardProps {
  article: BlogArticle
}

export default function BlogArticleCard({ article }: BlogArticleCardProps) {
  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      {/* Imagen principal */}
      <Link href={`/diario-grimmiz/articulo/${article.slug}/`} className="block relative aspect-[16/9] overflow-hidden">
        <OptimizedImage
          src={article.main_image_url}
          alt={article.title}
          width={400}
          height={225}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Contenido */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Fecha de creación */}
        <time className="text-sm text-gray-500 mb-2" dateTime={article.created_at}>
          {formatDate(article.created_at)}
        </time>

        {/* Título */}
        <Link href={`/diario-grimmiz/articulo/${article.slug}/`}>
          <h2 className="text-xl font-bold text-grimmiz-text mb-3 hover:text-grimmiz-primary transition-colors line-clamp-2">
            {article.title}
          </h2>
        </Link>

        {/* Extracto */}
        <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
          {article.excerpt}
        </p>

        {/* CTA "Leer más" */}
        <div className="mt-auto">
          <Link
            href={`/diario-grimmiz/articulo/${article.slug}/`}
            className="inline-flex items-center text-grimmiz-primary font-semibold hover:text-grimmiz-secondary transition-colors"
          >
            Leer más
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  )
}

