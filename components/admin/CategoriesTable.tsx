'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import OptimizedImage from '@/components/OptimizedImage'

interface Category {
    id: number
    name: string
    image_url: string | null
    slug: string
    created_at: string
}

interface CategoriesTableProps {
    categories: Category[]
}

export default function CategoriesTable({ categories }: CategoriesTableProps) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState<number | null>(null)
    const [deleteError, setDeleteError] = useState<string | null>(null)

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
            return
        }

        setIsDeleting(id)
        setDeleteError(null)

        try {
            const response = await fetch(`/api/admin/categories/${id}`, {
                method: 'DELETE',
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al eliminar la categoría')
            }

            router.refresh()
        } catch (err: any) {
            console.error('Error deleting category:', err)
            setDeleteError(err.message)
            // Limpiar el error después de 5 segundos
            setTimeout(() => setDeleteError(null), 5000)
        } finally {
            setIsDeleting(null)
        }
    }

    if (categories.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-grimmiz-text-secondary mb-4">No hay categorías creadas</p>
                <Link
                    href="/admin/categories/new"
                    className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    Crear primera categoría
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {deleteError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
                    <p className="text-red-800">{deleteError}</p>
                    <button
                        onClick={() => setDeleteError(null)}
                        className="text-red-600 hover:text-red-800"
                    >
                        ✕
                    </button>
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-grimmiz-text-secondary uppercase tracking-wider">
                                Imagen
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-grimmiz-text-secondary uppercase tracking-wider">
                                Nombre
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-grimmiz-text-secondary uppercase tracking-wider">
                                Slug
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-grimmiz-text-secondary uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {categories.map((category) => (
                            <tr key={category.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="h-10 w-10 relative rounded overflow-hidden bg-gray-100">
                                        {category.image_url ? (
                                            <OptimizedImage
                                                src={category.image_url}
                                                alt={category.name}
                                                fill
                                                className="object-cover"
                                                size="thumbnail"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400">
                                                <span className="text-xs">Sin img</span>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {category.name}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">
                                        {category.slug}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/admin/categories/${category.id}`}
                                            className="text-primary hover:text-primary-dark transition-colors"
                                            title="Editar"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(category.id)}
                                            disabled={isDeleting === category.id}
                                            className="text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                                            title="Eliminar"
                                        >
                                            {isDeleting === category.id ? (
                                                <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
