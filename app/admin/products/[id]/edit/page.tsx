'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import ProductForm from '@/components/admin/ProductForm'

export default function EditProductPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const returnUrl = searchParams.get('returnUrl')
    const productId = params.id as string
    const [product, setProduct] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/admin/products/${productId}`)

                if (!response.ok) {
                    throw new Error('Producto no encontrado')
                }

                const data = await response.json()
                setProduct(data.product)
            } catch (error: any) {
                console.error('Error loading product:', error)
                setError(error.message || 'Error al cargar el producto')
            } finally {
                setIsLoading(false)
            }
        }

        fetchProduct()
    }, [productId])

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-grimmiz-text mb-2">Editar Producto</h1>
                    <p className="text-grimmiz-text-secondary">
                        Modifica la información del producto
                    </p>
                </div>

                {/* Loading state */}
                {isLoading && (
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <div className="flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mr-3"></div>
                            <p className="text-grimmiz-text-secondary">Cargando producto...</p>
                        </div>
                    </div>
                )}

                {/* Error state */}
                {error && !isLoading && (
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <div className="text-center">
                            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-grimmiz-text font-medium mb-2">Error al cargar el producto</p>
                            <p className="text-grimmiz-text-secondary text-sm">{error}</p>
                        </div>
                    </div>
                )}

                {/* Form */}
                {product && !isLoading && (
                    <ProductForm mode="edit" product={product} returnUrl={returnUrl} />
                )}
            </div>
        </AdminLayout>
    )
}
