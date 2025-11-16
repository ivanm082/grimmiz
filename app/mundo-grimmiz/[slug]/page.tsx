import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import ArticleCard from '@/components/ArticleCard'
import ProductImageGallery from '@/components/ProductImageGallery'
import AdoptButton from '@/components/AdoptButton'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

// Datos estáticos de artículos relacionados (igual que en la home)
const relatedArticles = [
  {
    id: '1',
    title: 'Cómo empezar en el mundo de las manualidades',
    excerpt: 'Descubre los primeros pasos para adentrarte en el fascinante mundo de las manualidades y crear tus propias obras de arte.',
    date: '15 de marzo, 2024',
    image: '/article1.jpg'
  },
  {
    id: '2',
    title: 'Técnicas básicas de costura para principiantes',
    excerpt: 'Aprende las técnicas fundamentales de costura que todo principiante debe conocer para crear proyectos increíbles.',
    date: '10 de marzo, 2024',
    image: '/article2.jpg'
  },
  {
    id: '3',
    title: 'Ideas creativas para decorar tu espacio',
    excerpt: 'Inspírate con estas ideas creativas para transformar cualquier espacio en un lugar único y acogedor.',
    date: '5 de marzo, 2024',
    image: '/article3.jpg'
  },
  {
    id: '4',
    title: 'Materiales esenciales para manualidades',
    excerpt: 'Conoce los materiales básicos que no pueden faltar en tu taller de manualidades para crear proyectos profesionales.',
    date: '1 de marzo, 2024',
    image: '/article4.jpg'
  }
]

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const supabase = createClient()

  // Extraer el ID del slug (formato: nombre-producto-123)
  const slugParts = params.slug.split('-')
  const productId = slugParts[slugParts.length - 1]

  // Validar que el último segmento sea un número
  if (!productId || isNaN(Number(productId))) {
    notFound()
  }

  // Obtener el producto con su categoría
  const { data: product, error: productError } = await supabase
    .from('product')
    .select(`
      *,
      category:category_id (
        id,
        name,
        slug
      )
    `)
    .eq('id', productId)
    .single()

  if (productError || !product) {
    notFound()
  }

  // Obtener imágenes adicionales
  const { data: additionalImages } = await supabase
    .from('additional_product_images')
    .select('*')
    .eq('product_id', product.id)
    .order('display_order', { ascending: true })

  // Preparar array de imágenes para la galería (imagen principal + adicionales)
  const allImages = []
  
  // Agregar imagen principal como primera imagen
  if (product.main_image_url) {
    allImages.push({
      id: 'main',
      url: product.main_image_url,
      alt: product.title
    })
  }
  
  // Agregar imágenes adicionales
  if (additionalImages && additionalImages.length > 0) {
    additionalImages.forEach((img: any) => {
      if (img.image_url) {
        allImages.push({
          id: img.id,
          url: img.image_url,
          alt: `${product.title} - imagen ${img.display_order || ''}`
        })
      }
    })
  }

  // Obtener productos relacionados de la misma categoría
  const { data: relatedProducts } = await supabase
    .from('product')
    .select('*')
    .eq('category_id', product.category_id)
    .neq('id', product.id)
    .limit(4)
    .order('updated_at', { ascending: false })

  const formattedRelatedProducts = relatedProducts?.map((p: any) => ({
    id: p.id?.toString() || '',
    name: p.title || `Producto ${p.id}`,
    price: Number(p.price) || 0,
    image: p.main_image_url || '',
    description: p.description || '',
    slug: p.slug || p.title?.toLowerCase().replace(/\s+/g, '-') || `producto-${p.id}`
  })) || []

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
              <Link href="/mundo-grimmiz" className="hover:text-primary transition-colors">
                Mundo Grimmiz
              </Link>
              {product.category && (
                <>
                  <span>/</span>
                  <Link 
                    href={`/mundo-grimmiz?categoria=${product.category.slug}`}
                    className="hover:text-primary transition-colors"
                  >
                    {product.category.name}
                  </Link>
                </>
              )}
              <span>/</span>
              <span className="text-grimmiz-text font-medium">{product.title}</span>
            </nav>
          </div>
        </div>

        {/* Producto Principal */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Galería de imágenes */}
              <ProductImageGallery images={allImages} />

              {/* Información del producto */}
              <div className="space-y-6">
                {/* Categoría */}
                {product.category && (
                  <Link 
                    href={`/mundo-grimmiz?categoria=${product.category.slug}`}
                    className="inline-block text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                  >
                    {product.category.name}
                  </Link>
                )}

                {/* Título */}
                <h1 className="text-4xl md:text-5xl font-bold text-grimmiz-text">
                  {product.title}
                </h1>

                {/* Precio */}
                <div className="text-4xl font-bold text-primary">
                  {Number(product.price).toFixed(2)}€
                </div>

                {/* Descripción */}
                {product.description && (
                  <div className="prose prose-lg max-w-none">
                    <p className="text-grimmiz-text-secondary leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* CTA */}
                <div className="pt-6">
                  <AdoptButton productTitle={product.title} />
                </div>

                {/* Información adicional */}
                <div className="pt-6 border-t border-gray-200">
                  <p className="text-sm text-grimmiz-text-secondary">
                    ✨ Producto único hecho a mano con dedicación y cariño
                  </p>
                  <p className="text-sm text-grimmiz-text-secondary mt-2">
                    📦 Envío cuidadoso para garantizar que llegue perfecto
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Productos Relacionados */}
        {formattedRelatedProducts.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-grimmiz-text mb-4">
                  Más productos de {product.category?.name || 'esta categoría'}
                </h2>
                <p className="text-grimmiz-text-secondary text-lg">
                  Descubre otras creaciones que te pueden gustar
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {formattedRelatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} {...relatedProduct} />
                ))}
              </div>

              <div className="text-center mt-8">
                <Link 
                  href={product.category ? `/mundo-grimmiz?categoria=${product.category.slug}` : '/mundo-grimmiz'}
                  className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                >
                  Ver todos los productos
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Artículos Relacionados */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-grimmiz-text mb-4">
                Inspírate con el Diario Grimmiz
              </h2>
              <p className="text-grimmiz-text-secondary text-lg">
                Artículos que te pueden interesar
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedArticles.map((article) => (
                <ArticleCard key={article.id} {...article} />
              ))}
            </div>

            <div className="text-center mt-8">
              <Link 
                href="/diario-grimmiz"
                className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
              >
                Ver Todos los Artículos
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

