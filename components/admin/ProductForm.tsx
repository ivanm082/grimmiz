'use client'

import { useState, useEffect, FormEvent, useRef } from 'react'
import { useRouter } from 'next/navigation'
import ImageUpload from './ImageUpload'
import AdditionalImagesManager, { AdditionalImagesManagerRef } from './AdditionalImagesManager'
import { generateSlug } from '@/lib/utils'

interface Category {
    id: number
    name: string
}

interface Product {
    id?: number
    title: string
    description: string
    price: number
    category_id: number
    main_image_url: string
    slug: string
    internal_notes?: string
    materials?: string
    stock?: number
}

interface ProductFormProps {
    product?: Product
    mode: 'create' | 'edit'
    returnUrl?: string | null
}

export default function ProductForm({ product, mode, returnUrl }: ProductFormProps) {
    const router = useRouter()
    const additionalImagesRef = useRef<AdditionalImagesManagerRef>(null)
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoadingCategories, setIsLoadingCategories] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState('')
    const [newlyUploadedImage, setNewlyUploadedImage] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        title: product?.title || '',
        description: product?.description || '',
        price: product?.price?.toString() || '',
        category_id: product?.category_id?.toString() || '',
        main_image_url: product?.main_image_url || '',
        slug: product?.slug || '',
        internal_notes: product?.internal_notes || '',
        materials: product?.materials || '',
        stock: product?.stock?.toString() || ''
    })

    const [errors, setErrors] = useState({
        title: '',
        price: '',
        category_id: '',
        slug: '',
        stock: ''
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
            price: '',
            category_id: '',
            slug: '',
            stock: ''
        }

        if (!formData.title.trim()) {
            newErrors.title = 'El título es obligatorio'
        }

        if (!formData.price) {
            newErrors.price = 'El precio es obligatorio'
        } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
            newErrors.price = 'El precio debe ser un número mayor que 0'
        }

        if (!formData.category_id) {
            newErrors.category_id = 'La categoría es obligatoria'
        }

        if (!formData.slug.trim()) {
            newErrors.slug = 'El slug es obligatorio'
        } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
            newErrors.slug = 'El slug solo puede contener letras minúsculas, números y guiones'
        }

        // Validar stock si se proporciona
        if (formData.stock) {
            const stockValue = Number(formData.stock)
            if (isNaN(stockValue)) {
                newErrors.stock = 'El stock debe ser un número'
            } else if (!Number.isInteger(stockValue)) {
                newErrors.stock = 'El stock debe ser un número entero'
            } else if (stockValue < 0) {
                newErrors.stock = 'El stock no puede ser negativo'
            }
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
                ? '/api/admin/products'
                : `/api/admin/products/${product?.id}`

            const method = mode === 'create' ? 'POST' : 'PUT'

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description || null,
                    price: parseFloat(formData.price),
                    category_id: parseInt(formData.category_id),
                    main_image_url: formData.main_image_url || null,
                    slug: formData.slug,
                    internal_notes: formData.internal_notes || null,
                    materials: formData.materials || null,
                    stock: formData.stock ? parseInt(formData.stock) : null
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al guardar el producto')
            }

            // Redirigir a la lista de productos o URL de retorno
            if (returnUrl) {
                router.push(returnUrl)
            } else {
                router.push('/admin/products')
            }
        } catch (error: any) {
            console.error('Error submitting form:', error)
            setSubmitError(error.message || 'Error al guardar el producto')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCancel = async () => {
        // Si hay una imagen principal recién subida y es diferente a la original, borrarla
        if (newlyUploadedImage && newlyUploadedImage !== product?.main_image_url) {
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

        if (returnUrl) {
            router.push(returnUrl)
        } else {
            router.back()
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
                        placeholder="Nombre del producto"
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
                        placeholder="producto-ejemplo"
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

                {/* Descripción */}
                <div>
                    <label htmlFor="description" className="block text-sm font-semibold text-grimmiz-text mb-2">
                        Descripción
                    </label>
                    <textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        rows={5}
                        placeholder="Descripción detallada del producto"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Precio */}
                    <div>
                        <label htmlFor="price" className="block text-sm font-semibold text-grimmiz-text mb-2">
                            Precio (€) *
                        </label>
                        <input
                            type="number"
                            id="price"
                            value={formData.price}
                            onChange={(e) => handleChange('price', e.target.value)}
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.price
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:ring-primary focus:border-primary'
                                }`}
                        />
                        {errors.price && (
                            <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                        )}
                    </div>

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
                </div>

                {/* Sección de campos internos */}
                <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-grimmiz-text mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Información Interna
                    </h3>
                    <p className="text-sm text-grimmiz-text-secondary mb-4">
                        Esta información es solo para uso interno y no se mostrará en la página pública
                    </p>

                    <div className="space-y-6">
                        {/* Materiales */}
                        <div>
                            <label htmlFor="materials" className="block text-sm font-semibold text-grimmiz-text mb-2">
                                Materiales
                            </label>
                            <textarea
                                id="materials"
                                value={formData.materials}
                                onChange={(e) => handleChange('materials', e.target.value)}
                                rows={4}
                                placeholder="Lista de materiales utilizados en el producto"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none"
                            />
                        </div>

                        {/* Notas internas */}
                        <div>
                            <label htmlFor="internal_notes" className="block text-sm font-semibold text-grimmiz-text mb-2">
                                Notas Internas
                            </label>
                            <textarea
                                id="internal_notes"
                                value={formData.internal_notes}
                                onChange={(e) => handleChange('internal_notes', e.target.value)}
                                rows={4}
                                placeholder="Notas internas sobre el producto"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none"
                            />
                        </div>

                        {/* Stock */}
                        <div>
                            <label htmlFor="stock" className="block text-sm font-semibold text-grimmiz-text mb-2">
                                Stock
                            </label>
                            <input
                                type="number"
                                id="stock"
                                value={formData.stock}
                                onChange={(e) => handleChange('stock', e.target.value)}
                                placeholder="Unidades disponibles"
                                step="1"
                                min="0"
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.stock
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-primary focus:border-primary'
                                    }`}
                            />
                            {errors.stock && (
                                <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
                            )}
                            <p className="text-xs text-grimmiz-text-secondary mt-1">
                                Solo números enteros positivos
                            </p>
                        </div>
                    </div>
                </div>

                {/* Imagen principal */}
                <ImageUpload
                    value={formData.main_image_url}
                    onChange={(url) => handleChange('main_image_url', url)}
                    label="Imagen Principal"
                />

                {/* Imágenes adicionales - solo en modo edición */}
                {mode === 'edit' && product?.id && (
                    <div className="pt-6 border-t border-gray-200">
                        <AdditionalImagesManager ref={additionalImagesRef} productId={product.id} />
                    </div>
                )}

                {mode === 'create' && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-blue-800 text-sm">
                            💡 <strong>Tip:</strong> Guarda el producto primero para poder añadir imágenes adicionales a la galería.
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
                                ? 'Crear Producto'
                                : 'Actualizar Producto'}
                    </button>
                </div>
            </div>
        </form>
    )
}
