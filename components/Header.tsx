'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center" onClick={closeMobileMenu}>
            <Image 
              src="/logo-horizontal.png" 
              alt="Grimmiz Logo" 
              width={180} 
              height={60}
              className="h-12 w-auto md:h-16"
              priority
            />
          </Link>

          {/* Desktop Navigation Menu */}
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
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden text-grimmiz-text hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4 space-y-3">
            <Link 
              href="/" 
              className="block text-grimmiz-text hover:text-primary transition-colors font-medium py-2"
              onClick={closeMobileMenu}
            >
              Inicio
            </Link>
            <Link 
              href="/mundo-grimmiz" 
              className="block text-grimmiz-text hover:text-primary transition-colors font-medium py-2"
              onClick={closeMobileMenu}
            >
              Mundo Grimmiz
            </Link>
            <Link 
              href="/diario-grimmiz" 
              className="block text-grimmiz-text hover:text-primary transition-colors font-medium py-2"
              onClick={closeMobileMenu}
            >
              Diario Grimmiz
            </Link>
            <Link 
              href="/contacto" 
              className="block text-grimmiz-text hover:text-primary transition-colors font-medium py-2"
              onClick={closeMobileMenu}
            >
              Contacto
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}

