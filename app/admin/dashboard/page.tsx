'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalCategories: 0,
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

                setStats({
                    totalProducts: productsData.pagination?.total || 0,
                    totalCategories: categoriesData.categories?.length || 0,
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
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-grimmiz-text mb-2">Dashboard</h1>
                    <p className="text-grimmiz-text-secondary">Bienvenido al panel de administración de Grimmiz</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

                    {/* Acceso rápido */}
                    <div className="bg-gradient-to-br from-primary to-primary-dark rounded-lg shadow-sm p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-white/80 mb-1">
                                    Acceso Rápido
                                </p>
                                <p className="text-lg font-semibold">
                                    Gestión de Productos
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-bold text-grimmiz-text mb-4">Acciones Rápidas</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
