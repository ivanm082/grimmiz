'use client'

import { useState, ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

interface AdminLayoutProps {
    children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await fetch('/api/admin/auth/logout', { method: 'POST' })
            router.push('/admin/login')
        } catch (error) {
            console.error('Error al cerrar sesión:', error)
        }
    }

    const navigation = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
        { name: 'Productos', href: '/admin/products', icon: '🛍️' },
    ]

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile sidebar backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-primary transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between p-6 border-b border-primary-light">
                        <h1 className="text-2xl font-bold text-white">Grimmiz Admin</h1>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="lg:hidden text-white hover:text-secondary transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive
                                            ? 'bg-secondary text-white'
                                            : 'text-white hover:bg-primary-light'
                                        }`}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <span className="text-xl mr-3">{item.icon}</span>
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Logout button */}
                    <div className="p-4 border-t border-primary-light">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-3 text-white hover:bg-primary-light rounded-lg transition-colors"
                        >
                            <span className="text-xl mr-3">🚪</span>
                            <span className="font-medium">Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <header className="bg-white shadow-sm sticky top-0 z-30">
                    <div className="flex items-center justify-between px-4 py-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden text-grimmiz-text hover:text-primary transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/"
                                target="_blank"
                                className="text-sm text-grimmiz-text-secondary hover:text-primary transition-colors"
                            >
                                Ver tienda →
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
