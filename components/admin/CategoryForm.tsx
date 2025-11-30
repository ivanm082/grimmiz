'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import ImageUpload from './ImageUpload'
import { generateSlug } from '@/lib/utils'

interface Category {
    id?: number
    name: string
    image_url: string | null
    slug: string
}

interface CategoryFormProps {
    category?: Category
    mode: 'create' | 'edit'
}

export default function CategoryForm({ category, mode }: CategoryFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [newlyUploadedImage, setNewlyUploadedImage] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: category?.name || '',
        image_url: category?.image_url || '',
        slug: category?.slug || ''
    })

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        setError('')

        if (field === 'name') {
            setFormData(prev => ({ ...prev, slug: generateSlug(value) }))
        }

        if (field === 'image_url') {
            setNewlyUploadedImage(value)
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (!formData.name.trim()) {
            setError('El nombre es obligatorio')
            return
        }

        setIsSubmitting(true)
        setError('')

        try {
            const url = mode === 'create'
                ? '/api/admin/categories'
                : `/api/admin/categories/${category?.id}`

            const method = mode === 'create' ? 'POST' : 'PUT'

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al guardar la categoría')
            }

            // Forzar recarga completa para asegurar que se ven los datos nuevos
            window.location.href = '/admin/categories'

        } catch (err: any) {
            console.error('Error saving category:', err)
            setError(err.message || 'Error al guardar la categoría')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCancel = async () => {
        // Limpiar imagen si se subió pero no se guardó
        if (newlyUploadedImage && newlyUploadedImage !== category?.image_url) {
            try {
                await fetch('/api/admin/upload', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: newlyUploadedImage }),
                })
            } catch (err) {
                console.error('Error cleaning up image:', err)
            }
        }
        router.back()
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">{error}</p>
                </div>
            )}

            <div className="space-y-6">
                {/* Nombre */}
                <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-grimmiz-text mb-2">
                        Nombre *
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Nombre de la categoría"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                        required
                    />
                </div>

                {/* Slug */}
                <div>
                    <label htmlFor="slug" className="block text-sm font-semibold text-grimmiz-text mb-2">
                        Slug <span className="text-xs font-normal text-grimmiz-text-secondary">(URL amigable)</span>
                    </label>
                    <input
                        type="text"
                        id="slug"
                        value={formData.slug}
                        readOnly
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-grimmiz-text-secondary mt-1">
                        Se genera automáticamente desde el nombre.
                    </p>
                </div>

                {/* Imagen */}
                <ImageUpload
                    value={formData.image_url}
                    onChange={(url) => handleChange('image_url', url)}
                    label="Imagen de la Categoría"
                    folder="categories"
                />

                {/* Botones */}
                <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="flex-1 px-6 py-3 border-2 border-gray-300 text-grimmiz-text rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-secondary text-white rounded-lg font-semibold hover:bg-secondary-dark transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Guardando...' : (mode === 'create' ? 'Crear Categoría' : 'Actualizar Categoría')}
                    </button>
                </div>
            </div>
        </form>
    )
}
