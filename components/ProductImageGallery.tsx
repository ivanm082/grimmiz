'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ProductImage {
  id: string | number
  url: string
  alt: string
}

interface ProductImageGalleryProps {
  images: ProductImage[]
}

export default function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div className="relative w-full h-96 lg:h-[500px] rounded-lg overflow-hidden bg-gray-100">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
          <span className="text-6xl">🎨</span>
        </div>
      </div>
    )
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
  }

  return (
    <div className="space-y-4">
      {/* Imagen principal con flechas */}
      <div className="relative w-full h-96 lg:h-[500px] rounded-lg overflow-hidden bg-gray-100 group">
        <Image
          src={images[currentIndex].url}
          alt={images[currentIndex].alt}
          fill
          className="object-cover"
          priority
        />

        {/* Flechas de navegación - solo se muestran si hay más de 1 imagen */}
        {images.length > 1 && (
          <>
            {/* Flecha izquierda */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-grimmiz-text rounded-full p-3 shadow-lg transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
              aria-label="Imagen anterior"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 19l-7-7 7-7" 
                />
              </svg>
            </button>

            {/* Flecha derecha */}
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-grimmiz-text rounded-full p-3 shadow-lg transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
              aria-label="Imagen siguiente"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            </button>

            {/* Indicadores de posición */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex 
                      ? 'bg-white w-8' 
                      : 'bg-white/60 hover:bg-white/80'
                  }`}
                  aria-label={`Ir a imagen ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setCurrentIndex(index)}
              className={`relative h-20 md:h-24 rounded-lg overflow-hidden transition-all ${
                index === currentIndex
                  ? 'ring-4 ring-primary shadow-lg scale-105'
                  : 'ring-2 ring-gray-200 hover:ring-primary/50 hover:scale-105'
              }`}
            >
              <Image
                src={image.url}
                alt={`${image.alt} - miniatura ${index + 1}`}
                fill
                className="object-cover"
                sizes="120px"
              />
              {/* Overlay en la miniatura activa */}
              {index === currentIndex && (
                <div className="absolute inset-0 bg-primary/10" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

