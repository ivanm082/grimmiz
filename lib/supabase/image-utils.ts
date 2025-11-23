/**
 * Tipos de transformación de imagen
 */
export type ImageSize = 'thumbnail' | 'small' | 'medium' | 'large' | 'original'

interface ImageTransformOptions {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'avif' | 'origin'
}

/**
 * Configuraciones predefinidas para diferentes tamaños
 */
const IMAGE_PRESETS: Record<ImageSize, ImageTransformOptions> = {
    thumbnail: { width: 150, height: 150, quality: 80, format: 'webp' },
    small: { width: 400, quality: 85, format: 'webp' },
    medium: { width: 800, quality: 85, format: 'webp' },
    large: { width: 1200, quality: 90, format: 'webp' },
    original: { quality: 95, format: 'origin' }
}

/**
 * Genera una URL optimizada usando las transformaciones de Supabase Storage
 * @param url - URL original de la imagen
 * @param size - Tamaño predefinido o opciones personalizadas
 * @returns URL optimizada con parámetros de transformación
 */
export function getOptimizedImageUrl(
    url: string | null,
    size: ImageSize | ImageTransformOptions = 'medium'
): string {
    if (!url) return ''

    // Si la URL no es de Supabase, devolverla sin cambios
    if (!url.includes('supabase.co/storage')) {
        return url
    }

    // Obtener opciones de transformación
    const options: ImageTransformOptions = typeof size === 'string'
        ? IMAGE_PRESETS[size]
        : size

    // Construir parámetros de transformación
    const params = new URLSearchParams()

    if (options.width) params.append('width', options.width.toString())
    if (options.height) params.append('height', options.height.toString())
    if (options.quality) params.append('quality', options.quality.toString())
    if (options.format && options.format !== 'origin') {
        params.append('format', options.format)
    }

    // Si no hay parámetros, devolver URL original
    if (params.toString() === '') {
        return url
    }

    // Añadir parámetros a la URL
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}${params.toString()}`
}

/**
 * Genera un srcset para imágenes responsive
 * @param url - URL original de la imagen
 * @returns String con srcset para diferentes tamaños
 */
export function getImageSrcSet(url: string | null): string {
    if (!url) return ''

    const sizes = [400, 800, 1200, 1600]
    return sizes
        .map(width => {
            const optimizedUrl = getOptimizedImageUrl(url, { width, quality: 85, format: 'webp' })
            return `${optimizedUrl} ${width}w`
        })
        .join(', ')
}

/**
 * Extrae el path de una URL pública de Supabase
 */
export function extractPathFromUrl(url: string): string | null {
    try {
        // URL format: https://[project].supabase.co/storage/v1/object/public/product-images/[path]
        const match = url.match(/\/product-images\/(.+)$/)
        return match ? match[1] : null
    } catch (error) {
        return null
    }
}
