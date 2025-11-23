'use client'

import Image from 'next/image'
import { getOptimizedImageUrl, type ImageSize } from '@/lib/supabase/image-utils'

interface OptimizedImageProps {
    src: string | null
    alt: string
    size?: ImageSize
    className?: string
    fill?: boolean
    width?: number
    height?: number
    priority?: boolean
}

/**
 * Componente de imagen optimizada que usa las transformaciones de Supabase Storage
 */
export default function OptimizedImage({
    src,
    alt,
    size = 'medium',
    className = '',
    fill = false,
    width,
    height,
    priority = false
}: OptimizedImageProps) {
    // Si no hay src, mostrar placeholder
    if (!src) {
        return (
            <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
                <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
            </div>
        )
    }

    // Obtener URL optimizada
    const optimizedSrc = getOptimizedImageUrl(src, size)

    // Props comunes
    const imageProps = {
        src: optimizedSrc,
        alt,
        className,
        priority
    }

    // Renderizar con fill o con dimensiones específicas
    if (fill) {
        return <Image {...imageProps} fill />
    }

    if (width && height) {
        return <Image {...imageProps} width={width} height={height} />
    }

    // Fallback: usar fill si no se especifican dimensiones
    return <Image {...imageProps} fill />
}
