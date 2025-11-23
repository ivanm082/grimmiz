import { createClient } from '@/lib/supabase/server'

const BUCKET_NAME = 'product-images'
const MAX_FILE_SIZE = 500 * 1024 // 500KB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif']

/**
 * Valida que el archivo sea una imagen válida
 */
export function validateImage(file: File): { valid: boolean; error?: string } {
    if (!ALLOWED_TYPES.includes(file.type)) {
        return {
            valid: false,
            error: 'Tipo de archivo no permitido. Solo se aceptan JPG, PNG, WebP y AVIF.'
        }
    }

    if (file.size > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: 'El archivo es demasiado grande. Tamaño máximo: 500KB.'
        }
    }

    return { valid: true }
}

/**
 * Genera un nombre único para el archivo
 */
export function generateUniqueFileName(originalName: string): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 15)
    const extension = originalName.split('.').pop()
    return `${timestamp}-${random}.${extension}`
}

/**
 * Sube una imagen a Supabase Storage
 */
export async function uploadImage(file: File, folder: string = 'products'): Promise<{ url: string; path: string } | { error: string }> {
    try {
        const supabase = createClient()

        // Validar imagen
        const validation = validateImage(file)
        if (!validation.valid) {
            return { error: validation.error! }
        }

        // Generar nombre único
        const fileName = generateUniqueFileName(file.name)
        const filePath = `${folder}/${fileName}`

        // Subir archivo
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            })

        if (error) {
            console.error('Error uploading image:', error)
            return { error: 'Error al subir la imagen. Por favor, inténtalo de nuevo.' }
        }

        // Obtener URL pública
        const { data: { publicUrl } } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath)

        return {
            url: publicUrl,
            path: filePath
        }
    } catch (error) {
        console.error('Error in uploadImage:', error)
        return { error: 'Error inesperado al subir la imagen.' }
    }
}

/**
 * Elimina una imagen de Supabase Storage
 */
export async function deleteImage(filePath: string): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = createClient()

        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([filePath])

        if (error) {
            console.error('Error deleting image:', error)
            return { success: false, error: 'Error al eliminar la imagen.' }
        }

        return { success: true }
    } catch (error) {
        console.error('Error in deleteImage:', error)
        return { success: false, error: 'Error inesperado al eliminar la imagen.' }
    }
}

/**
 * Obtiene la URL pública de una imagen
 */
export function getPublicUrl(filePath: string): string {
    const supabase = createClient()
    const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath)

    return publicUrl
}

export * from './image-utils'
