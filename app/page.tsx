import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import ArticleCard from '@/components/ArticleCard'
import Link from 'next/link'

// Datos estáticos de productos destacados
const featuredProducts = [
  {
    id: '1',
    name: 'Joyería Artesanal',
    price: 25,
    image: '/product1.jpg',
    description: 'Piezas únicas hechas a mano con materiales de calidad'
  },
  {
    id: '2',
    name: 'Bolsos Personalizados',
    price: 35,
    image: '/product2.jpg',
    description: 'Bolsos de tela con diseños exclusivos y personalizables'
  },
  {
    id: '3',
    name: 'Decoración para el Hogar',
    price: 20,
    image: '/product3.jpg',
    description: 'Elementos decorativos únicos para dar personalidad a tu hogar'
  },
  {
    id: '4',
    name: 'Accesorios de Papelería',
    price: 15,
    image: '/product4.jpg',
    description: 'Organizadores y accesorios creativos para tu escritorio'
  }
]

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

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-4">Bienvenido a Grimmiz</h1>
            <p className="text-xl mb-8">Descubre manualidades únicas hechas con amor y dedicación</p>
            <Link 
              href="/mundo-grimmiz"
              className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>

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
