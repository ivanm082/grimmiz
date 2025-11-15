import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo-horizontal.png" 
              alt="Grimmiz Logo" 
              width={180} 
              height={60}
              className="h-12 w-auto md:h-16"
              priority
            />
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-grimmiz-text hover:text-primary transition-colors font-medium"
            >
              Inicio
            </Link>
            <Link 
              href="/mundo-grimmiz" 
              className="text-grimmiz-text hover:text-primary transition-colors font-medium"
            >
              Mundo Grimmiz
            </Link>
            <Link 
              href="/diario-grimmiz" 
              className="text-grimmiz-text hover:text-primary transition-colors font-medium"
            >
              Diario Grimmiz
            </Link>
            <Link 
              href="/contacto" 
              className="text-grimmiz-text hover:text-primary transition-colors font-medium"
            >
              Contacto
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-grimmiz-text hover:text-primary">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

