import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="text-center px-4 py-16">
          <div className="text-6xl mb-6">🔍</div>
          <h1 className="text-4xl font-bold text-grimmiz-text mb-4">
            Producto no encontrado
          </h1>
          <p className="text-lg text-grimmiz-text-secondary mb-8">
            Lo sentimos, el producto que buscas no existe o ha sido eliminado.
          </p>
          <Link 
            href="/mundo-grimmiz"
            className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            Ver todos los productos
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

