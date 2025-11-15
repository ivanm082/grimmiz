import Link from 'next/link'

interface ArticleCardProps {
  id: string
  title: string
  excerpt: string
  date: string
  image?: string
}

export default function ArticleCard({ title, excerpt, date, image }: ArticleCardProps) {
  return (
    <Link href={`/diario-grimmiz/${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
        {image ? (
          <div className="relative h-48 bg-gray-200">
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-secondary/10 to-primary/10">
              <span className="text-3xl">📝</span>
            </div>
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-secondary/10 to-primary/10 flex items-center justify-center">
            <span className="text-3xl">📝</span>
          </div>
        )}
        <div className="p-4">
          <time className="text-sm text-grimmiz-text-secondary">{date}</time>
          <h3 className="text-lg font-semibold text-grimmiz-text mt-2 mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-grimmiz-text-secondary line-clamp-3">{excerpt}</p>
        </div>
      </article>
    </Link>
  )
}

