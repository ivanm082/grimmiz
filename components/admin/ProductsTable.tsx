'use client'

import OptimizedImage from '@/components/OptimizedImage'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface Product {
    id: number
    title: string
    price: number
    main_image_url: string | null
    created_at: string
    slug: string
    category: {
        id: number
        name: string
    }
}

interface ProductsTableProps {
    products: Product[]
    onDelete: (id: number, title: string) => void
    onDuplicate: (id: number) => void
    isLoading?: boolean
    returnUrl: string
}

export default function ProductsTable({ products, onDelete, onDuplicate, isLoading = false, returnUrl }: ProductsTableProps) {
    const searchParams = useSearchParams()

    const getEditUrl = (productId: number) => {
        return `/admin/products/${productId}/edit?returnUrl=${encodeURIComponent(returnUrl)}`
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR'
        }).format(price)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-8 text-center">
                    <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-grimmiz-text-secondary">Cargando productos...</p>
                </div>
            </div>
        )
    }

    if (products.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-8 text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-grimmiz-text font-medium mb-2">No se encontraron productos</p>
                    <p className="text-grimmiz-text-secondary text-sm">
                        Intenta ajustar los filtros o crea un nuevo producto
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Tabla para desktop */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-grimmiz-text-secondary uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-grimmiz-text-secondary uppercase tracking-wider">
                                Imagen
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-grimmiz-text-secondary uppercase tracking-wider">
                                Título
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-grimmiz-text-secondary uppercase tracking-wider">
                                Categoría
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-grimmiz-text-secondary uppercase tracking-wider">
                                Precio
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-grimmiz-text-secondary uppercase tracking-wider">
                                Fecha
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-grimmiz-text-secondary uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-grimmiz-text-secondary">
                                    #{product.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                                        {product.main_image_url ? (
                                            <OptimizedImage
                                                src={product.main_image_url}
                                                alt={product.title}
                                                fill
                                                className="object-cover"
                                                size="thumbnail"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-grimmiz-text">
                                        {product.title}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                                        {product.category.name}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-grimmiz-text">
                                    {formatPrice(product.price)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-grimmiz-text-secondary">
                                    {formatDate(product.created_at)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end gap-2">
                                        <a
                                            href={`/mundo-grimmiz/producto/${product.slug || product.title.toLowerCase().replace(/\s+/g, '-')}-${product.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-500 hover:text-gray-700 transition-colors p-1"
                                            data-tooltip="Ver en web"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                        <button
                                            onClick={() => onDuplicate(product.id)}
                                            className="text-secondary hover:text-secondary-dark transition-colors p-1"
                                            data-tooltip="Duplicar"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </button>
                                        <Link
                                            href={getEditUrl(product.id)}
                                            className="text-primary hover:text-primary-dark transition-colors p-1"
                                            data-tooltip="Editar"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </Link>
                                        <button
                                            onClick={() => onDelete(product.id, product.title)}
                                            className="text-red-600 hover:text-red-700 transition-colors p-1"
                                            data-tooltip="Eliminar"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Cards para mobile */}
            <div className="md:hidden divide-y divide-gray-200">
                {products.map((product) => (
                    <div key={product.id} className="p-4">
                        <div className="flex gap-4">
                            <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                {product.main_image_url ? (
                                    <OptimizedImage
                                        src={product.main_image_url}
                                        alt={product.title}
                                        fill
                                        className="object-cover"
                                        size="thumbnail"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="text-sm font-medium text-grimmiz-text truncate">
                                            {product.title}
                                        </p>
                                        <p className="text-xs text-grimmiz-text-secondary">
                                            ID: #{product.id}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                                        {product.category.name}
                                    </span>
                                    <span className="text-sm font-medium text-grimmiz-text">
                                        {formatPrice(product.price)}
                                    </span>
                                </div>
                                <p className="text-xs text-grimmiz-text-secondary mb-3">
                                    {formatDate(product.created_at)}
                                </p>
                                <div className="flex gap-2">
                                    <a
                                        href={`/mundo-grimmiz/producto/${product.slug || product.title.toLowerCase().replace(/\s+/g, '-')}-${product.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                                        data-tooltip="Ver en web"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                    <button
                                        onClick={() => onDuplicate(product.id)}
                                        className="px-3 py-2 text-sm bg-secondary/10 text-secondary rounded-lg hover:bg-secondary/20 transition-colors flex items-center justify-center"
                                        data-tooltip="Duplicar"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                    <Link
                                        href={getEditUrl(product.id)}
                                        className="flex-1 px-3 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-center"
                                    >
                                        Editar
                                    </Link>
                                    <button
                                        onClick={() => onDelete(product.id, product.title)}
                                        className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
