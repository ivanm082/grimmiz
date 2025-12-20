'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface Article {
    id: number
    title: string
    slug: string
    excerpt: string
    published: boolean
    created_at: string
    updated_at: string
    category: {
        id: number
        name: string
    }
}

interface ArticlesTableProps {
    articles: Article[]
    isLoading: boolean
    onEdit: (articleId: number) => void
    onDelete: (articleId: number, articleTitle: string) => void
    onDuplicate: (articleId: number) => void
    onTogglePublished: (articleId: number, currentPublished: boolean) => void
    returnUrl: string
}

export default function ArticlesTable({
    articles,
    isLoading,
    onEdit,
    onDelete,
    onDuplicate,
    onTogglePublished,
    returnUrl
}: ArticlesTableProps) {
    const searchParams = useSearchParams()

    const getEditUrl = (articleId: number) => {
        return `/admin/blog/${articleId}/edit?returnUrl=${encodeURIComponent(returnUrl)}`
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
            <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-8 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </div>
        )
    }

    if (articles.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <p className="text-grimmiz-text-secondary">No se encontraron artículos</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden lg:block">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                                Artículo
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                                Categoría
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                                Estado
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                                Fecha
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {articles.map((article) => (
                            <tr
                                key={article.id}
                                className="hover:bg-gray-50 cursor-pointer"
                                onClick={(e) => {
                                    // Solo navegar si no se hizo click en elementos interactivos
                                    const target = e.target as HTMLElement
                                    if (!target.closest('button') && !target.closest('a')) {
                                        onEdit(article.id)
                                    }
                                }}
                            >
                                <td className="px-4 py-4">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-8 w-8">
                                            <div className="h-8 w-8 rounded bg-gray-200 flex items-center justify-center">
                                                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-3 min-w-0 flex-1">
                                            <Link
                                                href={getEditUrl(article.id)}
                                                className="text-sm font-medium text-grimmiz-text hover:text-primary transition-colors truncate block"
                                                data-tooltip={`Editar "${article.title}"`}
                                            >
                                                {article.title}
                                            </Link>
                                            <div className="text-xs text-gray-500 truncate">
                                                {article.excerpt?.substring(0, 40)}{article.excerpt && article.excerpt.length > 40 ? '...' : ''}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full truncate max-w-full">
                                        {article.category?.name || 'Sin categoría'}
                                    </span>
                                </td>
                                <td className="px-4 py-4 w-24">
                                    <button
                                        onClick={() => onTogglePublished(article.id, article.published)}
                                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                                            article.published
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-orange-100 text-orange-800'
                                        }`}
                                    >
                                        {article.published ? 'Publicado' : 'Borrador'}
                                    </button>
                                </td>
                                <td className="px-4 py-4 text-xs text-gray-500">
                                    <div>
                                        <div>{formatDate(article.created_at)}</div>
                                        {article.updated_at !== article.created_at && (
                                            <div className="text-xs opacity-75">Act: {formatDate(article.updated_at)}</div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex space-x-1">
                                        {article.published && (
                                            <Link
                                                href={`/diario-grimmiz/articulo/${article.slug}/`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-green-600 hover:text-green-800 transition-colors p-1 inline-block"
                                                data-tooltip="Ver en web"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => onDuplicate(article.id)}
                                            className="text-secondary hover:text-secondary-dark transition-colors p-1"
                                            data-tooltip="Duplicar"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </button>
                                        <Link
                                            href={getEditUrl(article.id)}
                                            className="text-primary hover:text-primary-dark transition-colors p-1 inline-block"
                                            data-tooltip="Editar"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </Link>
                                        <button
                                            onClick={() => onDelete(article.id, article.title)}
                                            className="text-red-600 hover:text-red-800 transition-colors p-1"
                                            data-tooltip="Eliminar"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

            {/* Mobile Cards */}
            <div className="lg:hidden">
                <div className="divide-y divide-gray-200">
                    {articles.map((article) => (
                        <div
                            key={article.id}
                            className="p-4 hover:bg-gray-50 cursor-pointer"
                            onClick={(e) => {
                                // Solo navegar si no se hizo click en elementos interactivos
                                const target = e.target as HTMLElement
                                if (!target.closest('button') && !target.closest('a')) {
                                    onEdit(article.id)
                                }
                            }}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center mb-2">
                                        <div className="flex-shrink-0 h-8 w-8">
                                            <div className="h-8 w-8 rounded bg-gray-200 flex items-center justify-center">
                                                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-3 flex-1">
                                            <Link
                                                href={getEditUrl(article.id)}
                                                className="text-sm font-medium text-grimmiz-text hover:text-primary transition-colors line-clamp-2 block"
                                                data-tooltip={`Editar "${article.title}"`}
                                            >
                                                {article.title}
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 mb-2">
                                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                            {article.category?.name || 'Sin categoría'}
                                        </span>
                                        <button
                                            onClick={() => onTogglePublished(article.id, article.published)}
                                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                article.published
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-orange-100 text-orange-800'
                                            }`}
                                        >
                                            {article.published ? 'Publicado' : 'Borrador'}
                                        </button>
                                    </div>

                                    <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                                        {article.excerpt}
                                    </p>

                                    <div className="text-xs text-gray-400">
                                        {formatDate(article.created_at)}
                                    </div>
                                </div>

                                <div className="ml-4 flex space-x-2">
                                    {article.published && (
                                        <Link
                                            href={`/diario-grimmiz/articulo/${article.slug}/`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-green-600 hover:text-green-800 transition-colors inline-block"
                                            data-tooltip="Ver en web"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => onDuplicate(article.id)}
                                        className="text-secondary hover:text-secondary-dark transition-colors inline-block"
                                        data-tooltip="Duplicar"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                    <Link
                                        href={getEditUrl(article.id)}
                                        className="text-primary hover:text-primary-dark transition-colors inline-block"
                                        data-tooltip="Editar"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </Link>
                                    <button
                                        onClick={() => onDelete(article.id, article.title)}
                                        className="text-red-600 hover:text-red-800 transition-colors"
                                        data-tooltip="Eliminar"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
