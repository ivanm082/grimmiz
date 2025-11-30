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
        <form onSubmit={handleSubmit} className="max-w-2xl bg-white rounded-lg shadow p-6">
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                </div>
            )}

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-grimmiz-text mb-1">
                        Nombre
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="Nombre de la categoría"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-grimmiz-text mb-1">
                        Slug (URL)
                    </label>
                    <input
                        type="text"
                        value={formData.slug}
                        readOnly
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
                    />
                </div>

                <div>
                    <ImageUpload
                        value={formData.image_url}
                        onChange={(url) => handleChange('image_url', url)}
                        label="Imagen de la categoría (Opcional)"
                        folder="categories"
                    />
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-grimmiz-text hover:bg-gray-50 transition-colors"
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Guardando...' : (mode === 'create' ? 'Crear Categoría' : 'Guardar Cambios')}
                    </button>
                </div>
            </div>
        </form>
    )
}
