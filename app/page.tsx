import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import ArticleCard from '@/components/ArticleCard'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

// Datos estáticos de artículos recientes
const recentArticles = [
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

export default async function Home() {
  // Obtener productos destacados de Supabase
  let featuredProducts: any[] = []
  let productsError = null

  try {
    const supabase = createClient()
    
    // Intentar con order, si falla intentar sin order
    let query = supabase
      .from('product')
      .select('id, title, description, price, main_image_url, slug, category_id')
      .limit(4)
    
    let { data, error } = await query.order('created_at', { ascending: false })
    
    // Si falla por el campo created_at, intentar sin order
    if (error && error.message?.includes('created_at')) {
      const result = await supabase
        .from('product')
        .select('id, title, description, price, main_image_url, slug, category_id')
        .limit(4)
      data = result.data
      error = result.error
    }
    
    if (error) {
      productsError = error
    } else if (data) {
      // Mapear los datos de Supabase al formato esperado por ProductCard
      featuredProducts = data
        .filter((product: any) => product !== null && product !== undefined)
        .map((product: any) => ({
          id: product.id?.toString() || '',
          name: product.title || `Producto ${product.id}`,
          price: Number(product.price) || 0,
          image: product.main_image_url || '',
          description: product.description || '',
          slug: product.slug || product.title?.toLowerCase().replace(/\s+/g, '-') || `producto-${product.id}`
        }))
    }
  } catch (err: any) {
    productsError = { message: err.message || 'Error desconocido al cargar productos' }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary via-primary/95 to-primary-dark text-white py-20 overflow-hidden">
          {/* Estrellas decorativas */}
          <div className="absolute inset-0">
            {/* Estrella 1 */}
            <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full opacity-80 animate-pulse"></div>
            {/* Estrella 2 */}
            <div className="absolute top-20 right-20 w-1.5 h-1.5 bg-white rounded-full opacity-60"></div>
            {/* Estrella 3 */}
            <div className="absolute top-32 left-1/4 w-1 h-1 bg-white rounded-full opacity-70 animate-pulse"></div>
            {/* Estrella 4 */}
            <div className="absolute bottom-20 right-1/4 w-2 h-2 bg-white rounded-full opacity-80"></div>
            {/* Estrella 5 */}
            <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-white rounded-full opacity-60 animate-pulse"></div>
            {/* Estrella 6 */}
            <div className="absolute top-1/2 right-10 w-1 h-1 bg-white rounded-full opacity-70"></div>
            {/* Estrella 7 */}
            <div className="absolute top-1/3 left-10 w-1.5 h-1.5 bg-white rounded-full opacity-80 animate-pulse"></div>
            {/* Estrella 8 */}
            <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-white rounded-full opacity-60"></div>
            
            {/* Planetas decorativos */}
            {/* Planeta grande con anillos (Saturno) */}
            <div className="absolute top-5 right-10">
              <svg width="80" height="80" viewBox="0 0 80 80" className="opacity-80">
                <defs>
                  <linearGradient id="planetGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#93c020" stopOpacity="0.4"/>
                    <stop offset="100%" stopColor="#93c020" stopOpacity="0.2"/>
                  </linearGradient>
                </defs>
                {/* Anillos */}
                <ellipse cx="40" cy="40" rx="35" ry="8" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
                <ellipse cx="40" cy="40" rx="38" ry="10" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                <ellipse cx="40" cy="40" rx="32" ry="6" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
                {/* Planeta */}
                <circle cx="40" cy="40" r="20" fill="url(#planetGradient1)"/>
              </svg>
            </div>
            
            {/* Planeta mediano con anillos (Saturno pequeño) */}
            <div className="absolute bottom-10 left-20">
              <svg width="60" height="60" viewBox="0 0 60 60" className="opacity-70">
                {/* Anillos */}
                <ellipse cx="30" cy="30" rx="26" ry="6" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
                <ellipse cx="30" cy="30" rx="28" ry="7" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8"/>
                {/* Planeta */}
                <circle cx="30" cy="30" r="15" fill="rgba(255,255,255,0.15)"/>
              </svg>
            </div>
            
            {/* Planeta pequeño normal */}
            <div className="absolute top-1/3 right-1/4 w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/15"></div>
            
            {/* Planeta pequeño con anillos */}
            <div className="absolute bottom-1/3 left-1/4">
              <svg width="50" height="50" viewBox="0 0 50 50" className="opacity-60">
                <defs>
                  <linearGradient id="planetGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#93c020" stopOpacity="0.5"/>
                    <stop offset="100%" stopColor="#93c020" stopOpacity="0.3"/>
                  </linearGradient>
                </defs>
                {/* Anillos */}
                <ellipse cx="25" cy="25" rx="22" ry="5" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8"/>
                {/* Planeta */}
                <circle cx="25" cy="25" r="12" fill="url(#planetGradient2)"/>
              </svg>
            </div>
            
            {/* OVNI decorativo (como en el logo) */}
            <div className="absolute top-16 right-1/3">
              <svg width="50" height="30" viewBox="0 0 50 30" className="opacity-80">
                <defs>
                  <linearGradient id="ufoGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#93c020" stopOpacity="0.9"/>
                    <stop offset="100%" stopColor="#7da01b" stopOpacity="0.8"/>
                  </linearGradient>
                  <linearGradient id="ufoTopGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#a3d326" stopOpacity="0.7"/>
                    <stop offset="100%" stopColor="#93c020" stopOpacity="0.6"/>
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                {/* Sombra del OVNI */}
                <ellipse cx="25" cy="26" rx="16" ry="3" fill="rgba(0,0,0,0.2)"/>
                {/* Parte inferior del OVNI */}
                <ellipse cx="25" cy="18" rx="20" ry="9" fill="url(#ufoGradient)"/>
                {/* Borde inferior */}
                <ellipse cx="25" cy="18" rx="20" ry="9" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
                {/* Parte superior del OVNI */}
                <ellipse cx="25" cy="10" rx="14" ry="5" fill="url(#ufoTopGradient)"/>
                {/* Borde superior */}
                <ellipse cx="25" cy="10" rx="14" ry="5" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5"/>
                {/* Ventanas/ventilaciones */}
                <circle cx="18" cy="14" r="1.5" fill="#7c5aa3" opacity="0.8" filter="url(#glow)"/>
                <circle cx="25" cy="14" r="1.5" fill="#7c5aa3" opacity="0.8" filter="url(#glow)"/>
                <circle cx="32" cy="14" r="1.5" fill="#7c5aa3" opacity="0.8" filter="url(#glow)"/>
                {/* Ventana central más grande */}
                <ellipse cx="25" cy="8" rx="3" ry="2" fill="#7c5aa3" opacity="0.6"/>
                {/* Luces en la parte inferior */}
                <circle cx="15" cy="20" r="0.8" fill="#93c020" opacity="0.9"/>
                <circle cx="25" cy="21" r="0.8" fill="#93c020" opacity="0.9"/>
                <circle cx="35" cy="20" r="0.8" fill="#93c020" opacity="0.9"/>
                {/* Detalles decorativos */}
                <line x1="12" y1="16" x2="38" y2="16" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/>
              </svg>
            </div>
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              ¡Hola! Bienvenido a <span className="text-secondary">Grimmiz</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light">Descubre manualidades únicas hechas con amor y dedicación ✨</p>
            <Link 
              href="/mundo-grimmiz"
              className="inline-block bg-secondary text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary-dark transition-colors shadow-lg hover:shadow-xl"
            >
              Explorar Productos
            </Link>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-grimmiz-text mb-4">Productos Destacados</h2>
              <p className="text-grimmiz-text-secondary text-lg">Descubre nuestras creaciones más populares</p>
            </div>
            
            {productsError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8 text-center">
                <p className="font-bold">Error al cargar productos:</p>
                <p>{productsError.message || 'No se pudieron cargar los productos'}</p>
              </div>
            )}
            
            {!productsError && featuredProducts.length === 0 && (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-8 text-center">
                <p>No hay productos disponibles en este momento.</p>
                <p className="text-sm mt-2">Si acabas de crear productos, verifica que las políticas RLS en Supabase permitan la lectura pública.</p>
              </div>
            )}
            
            {!productsError && featuredProducts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            )}

            <div className="text-center">
              <Link 
                href="/mundo-grimmiz"
                className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
              >
                Ver Todos los Productos
              </Link>
            </div>
          </div>
        </section>

        {/* Recent Articles Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-grimmiz-text mb-4">Últimos Artículos del Diario Grimmiz</h2>
              <p className="text-grimmiz-text-secondary text-lg">Inspírate con nuestros últimos contenidos</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {recentArticles.map((article) => (
                <ArticleCard key={article.id} {...article} />
              ))}
            </div>

            <div className="text-center">
              <Link 
                href="/diario-grimmiz"
                className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
              >
                Ver Todos los Artículos
              </Link>
            </div>
          </div>
        </section>

        {/* About Grimmiz Section */}
        <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-grimmiz-text mb-6">¿Qué es Grimmiz?</h2>
              <div className="prose prose-lg mx-auto text-grimmiz-text">
                <p className="text-lg leading-relaxed mb-4">
                  Grimmiz es más que una tienda de manualidades. Es un espacio donde la creatividad cobra vida, 
                  donde cada pieza está hecha con dedicación y pasión. Creemos en el valor de lo hecho a mano, 
                  en la singularidad de cada creación y en el poder de las manualidades para transformar espacios 
                  y vidas.
                </p>
                <p className="text-lg leading-relaxed mb-4">
                  Nuestro mundo se divide en dos espacios principales: <strong>Mundo Grimmiz</strong>, donde 
                  encontrarás productos únicos y personalizados, y <strong>Diario Grimmiz</strong>, un blog 
                  lleno de inspiración, tutoriales y consejos para que tú también puedas crear.
                </p>
                <p className="text-lg leading-relaxed">
                  Cada producto que encuentres aquí ha sido cuidadosamente seleccionado y creado pensando en 
                  ofrecerte algo especial, único y lleno de significado. Bienvenido a nuestro mundo creativo.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
