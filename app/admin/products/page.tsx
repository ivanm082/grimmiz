'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import ProductsTable from '@/components/admin/ProductsTable'
import SearchBar from '@/components/admin/SearchBar'
import Pagination from '@/components/admin/Pagination'
import DeleteModal from '@/components/admin/DeleteModal'
import Link from 'next/link'

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

interface Category {
    id: number
    name: string
}

export default function ProductsPage() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Inicializar estado desde URL
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const [search, setSearch] = useState(searchParams.get('search') || '')
    const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category_id') || '')
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; productId: number | null; productName: string }>({
        isOpen: false,
        productId: null,
        productName: ''
    })
    const [isDeleting, setIsDeleting] = useState(false)

    const itemsPerPage = 10

    // Cargar categorías
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/admin/categories')
                const data = await response.json()
                setCategories(data.categories || [])
            } catch (error) {
                console.error('Error loading categories:', error)
            }
        }

        fetchCategories()
    }, [])

    // Sincronizar URL con estado
    useEffect(() => {
        const params = new URLSearchParams()
        if (currentPage > 1) params.set('page', currentPage.toString())
        if (search) params.set('search', search)
        if (categoryFilter) params.set('category_id', categoryFilter)

        const queryString = params.toString()
        const url = queryString ? `${pathname}?${queryString}` : pathname

        router.replace(url, { scroll: false })
    }, [currentPage, search, categoryFilter, pathname, router])

    // Cargar productos
    const fetchProducts = useCallback(async () => {
        setIsLoading(true)
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: itemsPerPage.toString(),
                sort: 'created_at',
                order: 'desc'
            })

            if (search) {
                params.append('search', search)
            }

            if (categoryFilter) {
                params.append('category_id', categoryFilter)
            }

            const response = await fetch(`/api/admin/products?${params}`)
            const data = await response.json()

            setProducts(data.products || [])
            setTotalPages(data.pagination?.totalPages || 1)
            setTotalItems(data.pagination?.total || 0)
        } catch (error) {
            console.error('Error loading products:', error)
        } finally {
            setIsLoading(false)
        }
    }, [currentPage, search, categoryFilter])

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    const handleSearch = useCallback((searchTerm: string, categoryId: string) => {
        setSearch(searchTerm)
        setCategoryFilter(categoryId)
        setCurrentPage(1) // Reset to first page when searching
    }, [])

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleDeleteClick = (id: number, title: string) => {
        setDeleteModal({
            isOpen: true,
            productId: id,
            productName: title
        })
    }

    const handleDeleteConfirm = async () => {
        if (!deleteModal.productId) return

        setIsDeleting(true)
        try {
            const response = await fetch(`/api/admin/products/${deleteModal.productId}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                throw new Error('Error al eliminar el producto')
            }

            // Recargar productos
            await fetchProducts()

            // Cerrar modal
            setDeleteModal({ isOpen: false, productId: null, productName: '' })
        } catch (error) {
            console.error('Error deleting product:', error)
            alert('Error al eliminar el producto. Por favor, inténtalo de nuevo.')
        } finally {
            setIsDeleting(false)
        }
    }

    const handleDeleteCancel = () => {
        setDeleteModal({ isOpen: false, productId: null, productName: '' })
    }

    const getReturnUrl = () => {
        const params = new URLSearchParams()
        if (currentPage > 1) params.set('page', currentPage.toString())
        if (search) params.set('search', search)
        if (categoryFilter) params.set('category_id', categoryFilter)

        const queryString = params.toString()
        return `/admin/products${queryString ? `?${queryString}` : ''}`
    }

    const returnUrl = getReturnUrl()

    const getNewProductUrl = () => {
        return `/admin/products/new?returnUrl=${encodeURIComponent(returnUrl)}`
    }

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-grimmiz-text mb-2">Productos</h1>
                        <p className="text-grimmiz-text-secondary">
                            Gestiona tu catálogo de productos
                        </p>
                    </div>
                    <Link
                        href={getNewProductUrl()}
                        className="px-6 py-3 bg-secondary text-white rounded-lg font-semibold hover:bg-secondary-dark transition-colors shadow-lg hover:shadow-xl flex items-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Nuevo Producto
                    </Link>
                </div>

                {/* Search and filters */}
                <SearchBar
                    onSearch={handleSearch}
                    categories={categories}
                    initialSearch={search}
                    initialCategoryId={categoryFilter}
                />

                {/* Products table */}
                <ProductsTable
                    products={products}
                    onDelete={handleDeleteClick}
                    isLoading={isLoading}
                    returnUrl={returnUrl}
                />

                {/* Pagination */}
                {!isLoading && totalPages > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                    />
                )}

                {/* Delete modal */}
                <DeleteModal
                    isOpen={deleteModal.isOpen}
                    onClose={handleDeleteCancel}
                    onConfirm={handleDeleteConfirm}
                    productName={deleteModal.productName}
                    isDeleting={isDeleting}
                />
            </div>
        </AdminLayout>
    )
}
