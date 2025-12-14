'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import ArticlesTable from '@/components/admin/ArticlesTable'
import Pagination from '@/components/admin/Pagination'
import DeleteModal from '@/components/admin/DeleteModal'
import Link from 'next/link'

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

interface Category {
    id: number
    name: string
}

export default function BlogArticlesPage() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [articles, setArticles] = useState<Article[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingCategories, setIsLoadingCategories] = useState(true)

    // Inicializar estado desde URL
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const [search, setSearch] = useState(searchParams.get('search') || '')
    const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category_id') || '')
    const [publishedFilter, setPublishedFilter] = useState(searchParams.get('published') || '')
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; articleId: number | null; articleTitle: string }>({
        isOpen: false,
        articleId: null,
        articleTitle: ''
    })
    const [isDeleting, setIsDeleting] = useState(false)

    // Función para actualizar la URL con los filtros
    const updateURL = useCallback((params: { [key: string]: string | number }) => {
        const newSearchParams = new URLSearchParams(searchParams.toString())

        Object.entries(params).forEach(([key, value]) => {
            if (value === '' || value === undefined) {
                newSearchParams.delete(key)
            } else {
                newSearchParams.set(key, value.toString())
            }
        })

        const newURL = `${pathname}?${newSearchParams.toString()}`
        router.push(newURL, { scroll: false })
    }, [router, pathname, searchParams])

    // Cargar artículos
    const loadArticles = useCallback(async () => {
        try {
            setIsLoading(true)

            const queryParams = new URLSearchParams({
                page: currentPage.toString(),
                limit: '10',
                ...(search && { search }),
                ...(categoryFilter && { category_id: categoryFilter }),
                ...(publishedFilter && { published: publishedFilter })
            })

            const response = await fetch(`/api/admin/blog?${queryParams}`)
            const data = await response.json()

            setArticles(data.articles || [])
            setTotalPages(data.totalPages || 1)
            setTotalItems(data.totalItems || 0)
        } catch (error) {
            console.error('Error loading articles:', error)
        } finally {
            setIsLoading(false)
        }
    }, [currentPage, search, categoryFilter, publishedFilter])

    // Cargar categorías
    const loadCategories = useCallback(async () => {
        try {
            setIsLoadingCategories(true)
            const response = await fetch('/api/admin/categories')
            const data = await response.json()
            setCategories(data.categories || [])
        } catch (error) {
            console.error('Error loading categories:', error)
            setCategories([]) // Asegurar que sea un array vacío en caso de error
        } finally {
            setIsLoadingCategories(false)
        }
    }, [])

    // Efecto para cargar datos iniciales
    useEffect(() => {
        loadArticles()
        loadCategories()
    }, [loadArticles, loadCategories])

    // Efecto para actualizar filtros desde URL
    useEffect(() => {
        const page = Number(searchParams.get('page')) || 1
        const searchParam = searchParams.get('search') || ''
        const categoryParam = searchParams.get('category_id') || ''
        const publishedParam = searchParams.get('published') || ''

        setCurrentPage(page)
        setSearch(searchParam)
        setCategoryFilter(categoryParam)
        setPublishedFilter(publishedParam)
    }, [searchParams])

    const handleSearch = (searchTerm: string) => {
        setSearch(searchTerm)
        setCurrentPage(1)
        updateURL({ search: searchTerm, page: 1 })
    }

    const handleCategoryFilter = (categoryId: string) => {
        setCategoryFilter(categoryId)
        setCurrentPage(1)
        updateURL({ category_id: categoryId, page: 1 })
    }

    const handlePublishedFilter = (published: string) => {
        setPublishedFilter(published)
        setCurrentPage(1)
        updateURL({ published, page: 1 })
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        updateURL({ page })
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleDelete = (articleId: number, articleTitle: string) => {
        setDeleteModal({
            isOpen: true,
            articleId,
            articleTitle
        })
    }

    const confirmDelete = async () => {
        if (!deleteModal.articleId) return

        try {
            setIsDeleting(true)
            const response = await fetch(`/api/admin/blog/${deleteModal.articleId}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                setDeleteModal({ isOpen: false, articleId: null, articleTitle: '' })
                loadArticles() // Recargar la lista
            } else {
                console.error('Error deleting article')
            }
        } catch (error) {
            console.error('Error deleting article:', error)
        } finally {
            setIsDeleting(false)
        }
    }

    const handleEdit = (articleId: number) => {
        const currentUrl = `${pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`
        router.push(`/admin/blog/${articleId}/edit?returnUrl=${encodeURIComponent(currentUrl)}`)
    }

    const handleTogglePublished = async (articleId: number, currentPublished: boolean) => {
        try {
            const response = await fetch(`/api/admin/blog/${articleId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    published: !currentPublished
                })
            })

            if (response.ok) {
                loadArticles() // Recargar la lista
            } else {
                console.error('Error toggling published status')
            }
        } catch (error) {
            console.error('Error toggling published status:', error)
        }
    }


    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-grimmiz-text mb-2">Artículos del Blog</h1>
                        <p className="text-grimmiz-text-secondary">
                            Gestiona los artículos de Diario Grimmiz
                        </p>
                    </div>
                    <Link
                        href={`/admin/blog/new?returnUrl=${encodeURIComponent(`${pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`)}`}
                        className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                    >
                        Nuevo Artículo
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-lg font-semibold text-grimmiz-text mb-2">Total Artículos</h3>
                        <p className="text-3xl font-bold text-primary">{totalItems}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-lg font-semibold text-grimmiz-text mb-2">Publicados</h3>
                        <p className="text-3xl font-bold text-green-600">
                            {articles.filter(a => a.published).length}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-lg font-semibold text-grimmiz-text mb-2">Borradores</h3>
                        <p className="text-3xl font-bold text-orange-600">
                            {articles.filter(a => !a.published).length}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Búsqueda */}
                        <div>
                            <label className="block text-sm font-medium text-grimmiz-text-secondary mb-1">
                                Buscar
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    placeholder="Buscar por título..."
                                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                />
                                <svg
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Filtro por categoría */}
                        <div>
                            <label className="block text-sm font-medium text-grimmiz-text-secondary mb-1">
                                Categoría
                            </label>
                            <select
                                value={categoryFilter}
                                onChange={(e) => handleCategoryFilter(e.target.value)}
                                disabled={isLoadingCategories}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50"
                            >
                                <option value="">
                                    {isLoadingCategories ? 'Cargando categorías...' : 'Todas las categorías'}
                                </option>
                                {categories && categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Filtro por estado */}
                        <div>
                            <label className="block text-sm font-medium text-grimmiz-text-secondary mb-1">
                                Estado
                            </label>
                            <select
                                value={publishedFilter}
                                onChange={(e) => handlePublishedFilter(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            >
                                <option value="">Todos</option>
                                <option value="true">Publicados</option>
                                <option value="false">Borradores</option>
                            </select>
                        </div>
                    </div>

                    {/* Botón limpiar filtros */}
                    {(search || categoryFilter || publishedFilter) && (
                        <div className="mt-4">
                            <button
                                onClick={() => {
                                    handleSearch('')
                                    handleCategoryFilter('')
                                    handlePublishedFilter('')
                                }}
                                className="text-sm text-primary hover:text-primary-dark transition-colors flex items-center"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Limpiar filtros
                            </button>
                        </div>
                    )}
                </div>

                {/* Articles Table */}
                <ArticlesTable
                    articles={articles}
                    isLoading={isLoading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onTogglePublished={handleTogglePublished}
                    returnUrl={`${pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}

                {/* Delete Modal */}
                <DeleteModal
                    isOpen={deleteModal.isOpen}
                    entityName={deleteModal.articleTitle}
                    entityType="artículo"
                    isDeleting={isDeleting}
                    onConfirm={confirmDelete}
                    onClose={() => setDeleteModal({ isOpen: false, articleId: null, articleTitle: '' })}
                />
            </div>
        </AdminLayout>
    )
}
