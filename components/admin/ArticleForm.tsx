'use client'

import { useState, useEffect, FormEvent, useRef } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import ImageUpload from './ImageUpload'
import AdditionalImagesManager, { AdditionalImagesManagerRef } from './AdditionalImagesManager'
import TagInput from './TagInput'
import { generateSlug } from '@/lib/utils'

// Importar el editor de Markdown dinámicamente para evitar errores de SSR
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
    ssr: false,
    loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>
})

interface Category {
    id: number
    name: string
}

interface Article {
    id?: number
    title: string
    excerpt: string
    content: string
    category_id: number
    main_image_url: string
    slug: string
    published: boolean
}

interface ArticleFormProps {
    article?: Article
    mode: 'create' | 'edit'
    returnUrl?: string | null
}

export default function ArticleForm({ article, mode, returnUrl }: ArticleFormProps) {
    const router = useRouter()
    const additionalImagesRef = useRef<AdditionalImagesManagerRef>(null)
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoadingCategories, setIsLoadingCategories] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState('')
    const [newlyUploadedImage, setNewlyUploadedImage] = useState<string | null>(null)
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])

    const [formData, setFormData] = useState({
        title: article?.title || '',
        excerpt: article?.excerpt || '',
        content: article?.content || '',
        category_id: article?.category_id?.toString() || '',
        main_image_url: article?.main_image_url || '',
        slug: article?.slug || '',
        published: article?.published?.toString() || 'false'
    })

    const [errors, setErrors] = useState({
        title: '',
        excerpt: '',
        content: '',
        category_id: '',
        slug: ''
    })

    // Cargar categorías
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/admin/categories')
                const data = await response.json()
                setCategories(data.categories || [])
            } catch (error) {
                console.error('Error loading categories:', error)
            } finally {
                setIsLoadingCategories(false)
            }
        }

        fetchCategories()
    }, [])

    // Cargar etiquetas del artículo en modo edición
    useEffect(() => {
        if (mode === 'edit' && article?.id) {
            const fetchArticleTags = async () => {
                try {
                    const response = await fetch(`/api/admin/blog/${article.id}/tags`)
                    const data = await response.json()
                    const tagIds = data.tags?.map((tag: any) => tag.id) || []
                    setSelectedTagIds(tagIds)
                } catch (error) {
                    console.error('Error loading article tags:', error)
                }
            }

            fetchArticleTags()
        }
    }, [mode, article?.id])

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))

        // Limpiar error del campo
        if (errors[field as keyof typeof errors] !== undefined) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }

        // Auto-generar slug cuando cambia el título (solo en modo creación)
        if (field === 'title' && mode === 'create') {
            const newSlug = generateSlug(value)
            setFormData(prev => ({ ...prev, slug: newSlug }))
        }

        setSubmitError('')

        // Si cambiamos la imagen, guardamos la URL para poder borrarla si cancelamos
        if (field === 'main_image_url') {
            setNewlyUploadedImage(value)
        }
    }

    const validate = () => {
        const newErrors = {
            title: '',
            excerpt: '',
            content: '',
            category_id: '',
            slug: ''
        }

        if (!formData.title.trim()) {
            newErrors.title = 'El título es obligatorio'
        }

        if (!formData.excerpt.trim()) {
            newErrors.excerpt = 'El extracto es obligatorio'
        }

        if (!formData.content.trim()) {
            newErrors.content = 'El contenido es obligatorio'
        }

        if (!formData.category_id) {
            newErrors.category_id = 'La categoría es obligatoria'
        }

        if (!formData.slug.trim()) {
            newErrors.slug = 'El slug es obligatorio'
        } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
            newErrors.slug = 'El slug solo puede contener letras minúsculas, números y guiones'
        }

        setErrors(newErrors)
        return !Object.values(newErrors).some(error => error !== '')
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (!validate()) {
            return
        }

        setIsSubmitting(true)
        setSubmitError('')

        try {
            const url = mode === 'create'
                ? '/api/admin/blog'
                : `/api/admin/blog/${article?.id}`

            const method = mode === 'create' ? 'POST' : 'PUT'

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: formData.title,
                    excerpt: formData.excerpt,
                    content: formData.content,
                    category_id: parseInt(formData.category_id),
                    main_image_url: formData.main_image_url || null,
                    slug: formData.slug,
                    published: formData.published === 'true',
                    tags: selectedTagIds
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al guardar el artículo')
            }

            // Las imágenes adicionales ya se guardan automáticamente cuando se suben
            // No necesitamos llamar a saveImages manualmente

            // Redirigir a la lista de artículos o URL de retorno
            if (returnUrl) {
                router.push(returnUrl)
            } else {
                router.push('/admin/blog')
            }
        } catch (error: any) {
            console.error('Error submitting form:', error)
            setSubmitError(error.message || 'Error al guardar el artículo')

            // Limpiar imágenes recién subidas si el guardado falló
            if (newlyUploadedImage && newlyUploadedImage !== article?.main_image_url) {
                try {
                    await fetch('/api/admin/upload', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ url: newlyUploadedImage }),
                    })
                } catch (error) {
                    console.error('Error deleting unused main image:', error)
                }
            }

            // Limpiar imágenes adicionales recién subidas
            if (additionalImagesRef.current) {
                try {
                    await additionalImagesRef.current.cleanupNewImages()
                } catch (error) {
                    console.error('Error cleaning up additional images:', error)
                }
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCancel = async () => {
        // Si hay una imagen principal recién subida y es diferente a la original, borrarla
        if (newlyUploadedImage && newlyUploadedImage !== article?.main_image_url) {
            try {
                await fetch('/api/admin/upload', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ url: newlyUploadedImage }),
                })
            } catch (error) {
                console.error('Error deleting unused main image:', error)
            }
        }

        // Limpiar imágenes adicionales recién subidas
        if (additionalImagesRef.current) {
            try {
                await additionalImagesRef.current.cleanupNewImages()
            } catch (error) {
                console.error('Error cleaning up additional images:', error)
            }
        }

        // Redirigir a la lista de artículos o URL de retorno
        if (returnUrl) {
            router.push(returnUrl)
        } else {
            router.push('/admin/blog')
        }
    }

    if (isLoadingCategories) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mr-3"></div>
                    <p className="text-grimmiz-text-secondary">Cargando formulario...</p>
                </div>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
            {submitError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">{submitError}</p>
                </div>
            )}

            <div className="space-y-6">
                {/* Título */}
                <div>
                    <label htmlFor="title" className="block text-sm font-semibold text-grimmiz-text mb-2">
                        Título *
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        placeholder="Título del artículo"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.title
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-primary focus:border-primary'
                            }`}
                    />
                    {errors.title && (
                        <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                    )}
                </div>

                {/* Slug */}
                <div>
                    <label htmlFor="slug" className="block text-sm font-semibold text-grimmiz-text mb-2">
                        Slug * <span className="text-xs font-normal text-grimmiz-text-secondary">(URL amigable)</span>
                    </label>
                    <input
                        type="text"
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => handleChange('slug', e.target.value)}
                        placeholder="articulo-ejemplo"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.slug
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-primary focus:border-primary'
                            }`}
                    />
                    {errors.slug && (
                        <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
                    )}
                    <p className="text-xs text-grimmiz-text-secondary mt-1">
                        Solo letras minúsculas, números y guiones. Se genera automáticamente desde el título.
                    </p>
                </div>

                {/* Extracto */}
                <div>
                    <label htmlFor="excerpt" className="block text-sm font-semibold text-grimmiz-text mb-2">
                        Extracto *
                    </label>
                    <textarea
                        id="excerpt"
                        value={formData.excerpt}
                        onChange={(e) => handleChange('excerpt', e.target.value)}
                        rows={3}
                        placeholder="Breve resumen del artículo (aparecerá en los listados)"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors resize-none ${errors.excerpt
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-primary focus:border-primary'
                            }`}
                    />
                    {errors.excerpt && (
                        <p className="text-red-500 text-sm mt-1">{errors.excerpt}</p>
                    )}
                </div>

                {/* Contenido (Editor Markdown) */}
                <div>
                    <label className="block text-sm font-semibold text-grimmiz-text mb-2">
                        Contenido *
                    </label>
                    <MDEditor
                        value={formData.content}
                        onChange={(value) => handleChange('content', value || '')}
                        preview="edit"
                        hideToolbar={false}
                        visibleDragbar={false}
                        height={400}
                        textareaProps={{
                            placeholder: 'Escribe el contenido del artículo en Markdown...'
                        }}
                    />
                    {errors.content && (
                        <p className="text-red-500 text-sm mt-1">{errors.content}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Categoría */}
                    <div>
                        <label htmlFor="category_id" className="block text-sm font-semibold text-grimmiz-text mb-2">
                            Categoría *
                        </label>
                        <select
                            id="category_id"
                            value={formData.category_id}
                            onChange={(e) => handleChange('category_id', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.category_id
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:ring-primary focus:border-primary'
                                }`}
                        >
                            <option value="">Selecciona una categoría</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {errors.category_id && (
                            <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>
                        )}
                    </div>

                    {/* Estado de publicación */}
                    <div>
                        <label className="block text-sm font-semibold text-grimmiz-text mb-2">
                            Estado
                        </label>
                        <div className="space-y-2">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="published"
                                    value="false"
                                    checked={formData.published === 'false'}
                                    onChange={(e) => handleChange('published', e.target.value)}
                                    className="text-primary focus:ring-primary"
                                />
                                <span className="ml-2 text-sm text-grimmiz-text">Borrador</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="published"
                                    value="true"
                                    checked={formData.published === 'true'}
                                    onChange={(e) => handleChange('published', e.target.value)}
                                    className="text-primary focus:ring-primary"
                                />
                                <span className="ml-2 text-sm text-grimmiz-text">Publicado</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Etiquetas */}
                <TagInput
                    productId={article?.id}
                    value={selectedTagIds}
                    onChange={setSelectedTagIds}
                />

                {/* Imagen principal */}
                <ImageUpload
                    value={formData.main_image_url}
                    onChange={(url) => handleChange('main_image_url', url)}
                    label="Imagen Principal"
                    folder="articles"
                />

                {/* Imágenes adicionales */}
                {mode === 'edit' ? (
                    <div className="pt-6 border-t border-gray-200">
                        {article?.id ? (
                            <AdditionalImagesManager ref={additionalImagesRef} entityId={article.id} entityType="blog_article" />
                        ) : (
                            <div className="bg-white rounded-lg shadow-sm p-8">
                                <div className="flex items-center justify-center">
                                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mr-3"></div>
                                    <p className="text-grimmiz-text-secondary">Cargando galería de imágenes...</p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-blue-800 text-sm">
                            💡 <strong>Tip:</strong> Guarda el artículo primero para poder añadir imágenes adicionales a la galería.
                        </p>
                    </div>
                )}

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
                        {isSubmitting
                            ? 'Guardando...'
                            : mode === 'create'
                                ? 'Crear Artículo'
                                : 'Actualizar Artículo'}
                    </button>
                </div>
            </div>
        </form>
    )
}