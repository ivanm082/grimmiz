import Link from 'next/link'
import OptimizedImage from '@/components/OptimizedImage'

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
  description?: string
  slug?: string
}

export default function ProductCard({ id, name, price, image, description, slug }: ProductCardProps) {
  const productSlug = slug || name.toLowerCase().replace(/\s+/g, '-')
  const urlSlug = `${productSlug}-${id}`

  return (
    <Link href={`/mundo-grimmiz/producto/${urlSlug}`} className="h-full">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group h-full flex flex-col">
        <div className="relative h-64 bg-gray-200 flex-shrink-0">
          {image ? (
            <OptimizedImage
              src={image}
              alt={name}
              fill
              className="object-cover"
              size="small"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
              <span className="text-4xl">🎨</span>
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-grimmiz-text mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {name}
          </h3>
          {description && (
            <p className="text-sm text-grimmiz-text-secondary mb-3 line-clamp-2">{description}</p>
          )}
          <div className="flex items-center justify-between mt-auto">
            <span className="text-xl font-bold text-primary">{price}€</span>
            <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors text-sm font-semibold">
              Ver más
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

