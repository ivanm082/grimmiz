import Link from 'next/link'
import Image from 'next/image'

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
  description?: string
}

export default function ProductCard({ name, price, image, description }: ProductCardProps) {
  return (
    <Link href={`/mundo-grimmiz/${name.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
        <div className="relative h-64 bg-gray-200">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
              <span className="text-4xl">🎨</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-grimmiz-text mb-2 group-hover:text-primary transition-colors">
            {name}
          </h3>
          {description && (
            <p className="text-sm text-grimmiz-text-secondary mb-3 line-clamp-2">{description}</p>
          )}
          <div className="flex items-center justify-between">
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

