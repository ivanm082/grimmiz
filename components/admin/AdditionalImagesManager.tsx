'use client'

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import ImageUpload from './ImageUpload'
import OptimizedImage from '@/components/OptimizedImage'

interface AdditionalImage {
    id: number
    image_url: string
    alt_text: string | null
    caption: string | null
    display_order: number
}

interface AdditionalImagesManagerProps {
    productId?: number
    onImagesChange?: (images: AdditionalImage[]) => void
}

export interface AdditionalImagesManagerRef {
    cleanupNewImages: () => Promise<void>
}

const MAX_IMAGES = 8

const AdditionalImagesManager = forwardRef<AdditionalImagesManagerRef, AdditionalImagesManagerProps>(
    ({ productId, onImagesChange }, ref) => {
        const [images, setImages] = useState<AdditionalImage[]>([])
        const [isLoading, setIsLoading] = useState(false)
        const [isUploading, setIsUploading] = useState(false)
        const [error, setError] = useState('')
        const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
        const [newlyUploadedUrls, setNewlyUploadedUrls] = useState<string[]>([])
        const [newlyCreatedImageIds, setNewlyCreatedImageIds] = useState<number[]>([])

        // Cargar imágenes existentes si estamos en modo edición
        useEffect(() => {
            if (productId) {
                loadImages()
            }
        }, [productId])

        const loadImages = async () => {
            if (!productId) return

            setIsLoading(true)
            setError('')

            try {
                const response = await fetch(`/api/admin/products/${productId}/images`)
                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.error || 'Error al cargar las imágenes')
                }

                setImages(data.images || [])
            } catch (err: any) {
                console.error('Error loading images:', err)
                setError(err.message || 'Error al cargar las imágenes')
            } finally {
                setIsLoading(false)
            }
        }

        const handleImageUpload = async (url: string) => {
            if (!productId) {
                setError('Debes guardar el producto antes de añadir imágenes adicionales')
                return
            }

            if (images.length >= MAX_IMAGES) {
                setError(`Máximo ${MAX_IMAGES} imágenes adicionales permitidas`)
                return
            }

            setIsUploading(true)
            setError('')

            try {
                const response = await fetch(`/api/admin/products/${productId}/images`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        image_url: url,
                        alt_text: null,
                        caption: null
                    }),
                })

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.error || 'Error al añadir la imagen')
                }

                // Añadir a la lista de URLs e IDs recién creados para poder limpiar si se cancela
                setNewlyUploadedUrls(prev => [...prev, url])
                setNewlyCreatedImageIds(prev => [...prev, data.image.id])

                // Actualizar la lista de imágenes
                const newImages = [...images, data.image]
                setImages(newImages)
                onImagesChange?.(newImages)

            } catch (err: any) {
                console.error('Error uploading additional image:', err)
                setError(err.message || 'Error al añadir la imagen')

                // Si falla, eliminar la imagen del storage
                try {
                    await fetch('/api/admin/upload', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ url }),
                    })
                } catch (deleteErr) {
                    console.error('Error deleting failed upload:', deleteErr)
                }
            } finally {
                setIsUploading(false)
            }
        }

        const handleDelete = async (imageId: number, imageUrl: string) => {
            if (!productId) return

            if (!confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
                return
            }

            setError('')

            try {
                const response = await fetch(`/api/admin/products/${productId}/images/${imageId}`, {
                    method: 'DELETE',
                })

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.error || 'Error al eliminar la imagen')
                }

                // Actualizar la lista de imágenes
                const newImages = images.filter(img => img.id !== imageId)
                setImages(newImages)
                onImagesChange?.(newImages)

                // Remover de las listas de URLs e IDs recién creados si estaba ahí
                setNewlyUploadedUrls(prev => prev.filter(url => url !== imageUrl))
                setNewlyCreatedImageIds(prev => prev.filter(id => id !== imageId))

            } catch (err: any) {
                console.error('Error deleting image:', err)
                setError(err.message || 'Error al eliminar la imagen')
            }
        }

        const handleDragStart = (index: number) => {
            setDraggedIndex(index)
        }

        const handleDragOver = (e: React.DragEvent, index: number) => {
            e.preventDefault()

            if (draggedIndex === null || draggedIndex === index) return

            const newImages = [...images]
            const draggedImage = newImages[draggedIndex]

            // Remover el elemento arrastrado
            newImages.splice(draggedIndex, 1)
            // Insertar en la nueva posición
            newImages.splice(index, 0, draggedImage)

            setImages(newImages)
            setDraggedIndex(index)
        }

        const handleDragEnd = async () => {
            if (!productId || draggedIndex === null) {
                setDraggedIndex(null)
                return
            }

            setError('')

            try {
                // Actualizar display_order en el backend
                const updatedImages = images.map((img, index) => ({
                    id: img.id,
                    display_order: index + 1
                }))

                const response = await fetch(`/api/admin/products/${productId}/images`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ images: updatedImages }),
                })

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.error || 'Error al actualizar el orden')
                }

                // Actualizar display_order local
                const newImages = images.map((img, index) => ({
                    ...img,
                    display_order: index + 1
                }))
                setImages(newImages)
                onImagesChange?.(newImages)

            } catch (err: any) {
                console.error('Error updating order:', err)
                setError(err.message || 'Error al actualizar el orden')
                // Recargar imágenes en caso de error
                loadImages()
            } finally {
                setDraggedIndex(null)
            }
        }

        // Función para limpiar imágenes recién subidas si se cancela el formulario
        const cleanupNewImages = async () => {
            if (!productId) return

            // Eliminar registros de la base de datos
            for (const imageId of newlyCreatedImageIds) {
                try {
                    await fetch(`/api/admin/products/${productId}/images/${imageId}`, {
                        method: 'DELETE',
                    })
                } catch (err) {
                    console.error('Error deleting image record:', err)
                }
            }

            // Limpiar los estados
            setNewlyUploadedUrls([])
            setNewlyCreatedImageIds([])
        }

        // Exponer la función de limpieza al componente padre mediante ref
        useImperativeHandle(ref, () => ({
            cleanupNewImages
        }))

        if (!productId) {
            return (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-grimmiz-text-secondary font-medium">
                        Guarda el producto primero para poder añadir imágenes adicionales
                    </p>
                </div>
            )
        }

        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-grimmiz-text">
                            Galería de Imágenes Adicionales
                        </h3>
                        <p className="text-sm text-grimmiz-text-secondary mt-1">
                            {images.length} de {MAX_IMAGES} imágenes • Arrastra para reordenar
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800 text-sm">{error}</p>
                    </div>
                )}

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mr-3"></div>
                        <p className="text-grimmiz-text-secondary">Cargando imágenes...</p>
                    </div>
                ) : (
                    <>
                        {/* Grid de imágenes */}
                        {images.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {images.map((image, index) => (
                                    <div
                                        key={image.id}
                                        draggable
                                        onDragStart={() => handleDragStart(index)}
                                        onDragOver={(e) => handleDragOver(e, index)}
                                        onDragEnd={handleDragEnd}
                                        className={`relative group cursor-move rounded-lg overflow-hidden border-2 transition-all ${draggedIndex === index
                                            ? 'border-primary shadow-lg scale-105 opacity-50'
                                            : 'border-gray-200 hover:border-primary'
                                            }`}
                                    >
                                        {/* Número de orden */}
                                        <div className="absolute top-2 left-2 bg-grimmiz-text/80 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold z-10">
                                            {index + 1}
                                        </div>

                                        {/* Imagen */}
                                        <div className="relative w-full h-40 bg-gray-100">
                                            <OptimizedImage
                                                src={image.image_url}
                                                alt={image.alt_text || `Imagen ${index + 1}`}
                                                fill
                                                className="object-cover"
                                                size="thumbnail"
                                            />
                                        </div>

                                        {/* Botón de eliminar */}
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(image.id, image.image_url)}
                                            className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg opacity-0 group-hover:opacity-100 z-10"
                                            title="Eliminar imagen"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>

                                        {/* Icono de arrastrar */}
                                        <div className="absolute bottom-2 right-2 p-1 bg-white/90 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            <svg className="w-4 h-4 text-grimmiz-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                                            </svg>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Botón de añadir imagen */}
                        {images.length < MAX_IMAGES && (
                            <div className="mt-4">
                                <ImageUpload
                                    value=""
                                    onChange={handleImageUpload}
                                    label={images.length === 0 ? "Añadir primera imagen" : "Añadir otra imagen"}
                                />
                                {isUploading && (
                                    <div className="mt-2 flex items-center text-primary">
                                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                                        <span className="text-sm">Añadiendo imagen...</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {images.length >= MAX_IMAGES && (
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-blue-800 text-sm">
                                    Has alcanzado el límite máximo de {MAX_IMAGES} imágenes adicionales.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        )
    })

AdditionalImagesManager.displayName = 'AdditionalImagesManager'

export default AdditionalImagesManager
export { type AdditionalImage }
