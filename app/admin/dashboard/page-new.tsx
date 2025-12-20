'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalCategories: 0,
        totalArticles: 0,
        publishedArticles: 0,
        draftArticles: 0,
        totalLeads: 0,
        isLoading: true
    })

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Obtener total de productos
                const productsResponse = await fetch('/api/admin/products?limit=1')
                const productsData = await productsResponse.json()

                // Obtener total de categorías
                const categoriesResponse = await fetch('/api/admin/categories')
                const categoriesData = await categoriesResponse.json()

                // Obtener estadísticas de artículos
                const articlesResponse = await fetch('/api/admin/blog?limit=1')
                const articlesData = await articlesResponse.json()

                // Obtener artículos publicados y borradores
                const publishedResponse = await fetch('/api/admin/blog?published=true&limit=1')
                const publishedData = await publishedResponse.json()

                const draftResponse = await fetch('/api/admin/blog?published=false&limit=1')
                const draftData = await draftResponse.json()

                // Obtener total de leads
                const leadsResponse = await fetch('/api/admin/leads?limit=1')
                const leadsData = await leadsResponse.json()

                setStats({
                    totalProducts: productsData.pagination?.total || 0,
                    totalCategories: categoriesData.categories?.length || 0,
                    totalArticles: articlesData.totalItems || 0,
                    publishedArticles: publishedData.totalItems || 0,
                    draftArticles: draftData.totalItems || 0,
                    totalLeads: leadsData.pagination?.totalItems || 0,
                    isLoading: false
                })
            } catch (error) {
                console.error('Error fetching stats:', error)
                setStats(prev => ({ ...prev, isLoading: false }))
            }
        }

        fetchStats()
    }, [])

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-grimmiz-text mb-2">Dashboard</h1>
                    <p className="text-grimmiz-text-secondary">Bienvenido al panel de administración de Grimmiz</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {/* Total Productos */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-grimmiz-text-secondary mb-1">
                                    Total Productos
                                </p>
                                {stats.isLoading ? (
                                    <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                                ) : (
                                    <p className="text-3xl font-bold text-grimmiz-text">
                                        {stats.totalProducts}
                                    </p>
                                )}
                            </div>
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Total Categorías */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-grimmiz-text-secondary mb-1">
                                    Total Categorías
                                </p>
                                {stats.isLoading ? (
                                    <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                                ) : (
                                    <p className="text-3xl font-bold text-grimmiz-text">
                                        {stats.totalCategories}
                                    </p>
                                )}
                            </div>
                            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Total Artículos */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-grimmiz-text-secondary mb-1">
                                    Total Artículos
                                </p>
                                {stats.isLoading ? (
                                    <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                                ) : (
                                    <p className="text-3xl font-bold text-grimmiz-text">
                                        {stats.totalArticles}
                                    </p>
                                )}
                            </div>
                            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Total Leads */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-grimmiz-text-secondary mb-1">
                                    Total Leads
                                </p>
                                {stats.isLoading ? (
                                    <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                                ) : (
                                    <p className="text-3xl font-bold text-purple-600">
                                        {stats.totalLeads}
                                    </p>
                                )}
                            </div>
                            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-bold text-grimmiz-text mb-6">Acciones Rápidas</h2>

                    {/* Botones principales de acceso rápido */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {/* Gestión de Productos */}
                        <Link
                            href="/admin/products"
                            className="bg-gradient-to-br from-primary to-primary-dark rounded-lg shadow-sm p-6 text-white hover:shadow-lg transition-all duration-200 group"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-white/80 mb-1">
                                        Gestión de Productos
                                    </p>
                                    <p className="text-lg font-semibold group-hover:text-white/95 transition-colors">
                                        Ver y editar catálogo
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                            </div>
                        </Link>

                        {/* Gestión de Artículos */}
                        <Link
                            href="/admin/blog"
                            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm p-6 text-white hover:shadow-lg transition-all duration-200 group"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-white/80 mb-1">
                                        Gestión de Artículos
                                    </p>
                                    <p className="text-lg font-semibold group-hover:text-white/95 transition-colors">
                                        Diario Grimmiz
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                        </Link>

                        {/* Gestión de Leads */}
                        <Link
                            href="/admin/leads"
                            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-sm p-6 text-white hover:shadow-lg transition-all duration-200 group"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-white/80 mb-1">
                                        Gestión de Leads
                                    </p>
                                    <p className="text-lg font-semibold group-hover:text-white/95 transition-colors">
                                        Consultas de productos
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            </div>
                        </Link>

                        {/* Gestión de Categorías */}
                        <Link
                            href="/admin/categories"
                            className="bg-gradient-to-br from-secondary to-secondary-dark rounded-lg shadow-sm p-6 text-white hover:shadow-lg transition-all duration-200 group"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-white/80 mb-1">
                                        Gestión de Categorías
                                    </p>
                                    <p className="text-lg font-semibold group-hover:text-white/95 transition-colors">
                                        Organizar contenido
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                    </div>

                    <h3 className="text-lg font-semibold text-grimmiz-text mb-4">Acciones Específicas</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Crear producto */}
                        <Link
                            href="/admin/products/new"
                            className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-secondary hover:bg-secondary/5 transition-colors group"
                        >
                            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-secondary/20 transition-colors">
                                <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-grimmiz-text mb-1">Crear Nuevo Producto</h3>
                                <p className="text-sm text-grimmiz-text-secondary">Añade un nuevo producto a tu catálogo</p>
                            </div>
                        </Link>

                        {/* Ver productos */}
                        <Link
                            href="/admin/products"
                            className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors group"
                        >
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-colors">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-grimmiz-text mb-1">Ver Todos los Productos</h3>
                                <p className="text-sm text-grimmiz-text-secondary">Gestiona tu catálogo completo</p>
                            </div>
                        </Link>

                        {/* Crear artículo */}
                        <Link
                            href="/admin/blog/new"
                            className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50/50 transition-colors group"
                        >
                            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-500/20 transition-colors">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-grimmiz-text mb-1">Crear Nuevo Artículo</h3>
                                <p className="text-sm text-grimmiz-text-secondary">Escribe contenido para tu blog</p>
                            </div>
                        </Link>

                        {/* Gestionar categorías */}
                        <Link
                            href="/admin/categories"
                            className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-secondary hover:bg-secondary/5 transition-colors group"
                        >
                            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-secondary/20 transition-colors">
                                <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-grimmiz-text mb-1">Gestionar Categorías</h3>
                                <p className="text-sm text-grimmiz-text-secondary">Organiza tus productos y artículos</p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Info */}
                <div className="mt-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-l-4 border-secondary rounded-lg p-6">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <svg className="w-6 h-6 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-grimmiz-text">
                                💡 Consejo
                            </h3>
                            <p className="mt-2 text-sm text-grimmiz-text-secondary">
                                Recuerda que las imágenes se almacenan en Supabase Storage. Tienes 1GB de espacio gratuito disponible.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
