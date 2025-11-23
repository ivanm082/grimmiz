'use client'

import { useState, useEffect } from 'react'

interface Category {
    id: number
    name: string
}

interface SearchBarProps {
    onSearch: (search: string, categoryId: string) => void
    categories: Category[]
    initialSearch?: string
    initialCategoryId?: string
}

export default function SearchBar({ onSearch, categories, initialSearch = '', initialCategoryId = '' }: SearchBarProps) {
    const [search, setSearch] = useState(initialSearch)
    const [categoryId, setCategoryId] = useState(initialCategoryId)
    const [debouncedSearch, setDebouncedSearch] = useState(initialSearch)

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
        }, 500)

        return () => clearTimeout(timer)
    }, [search])

    // Trigger search when debounced value changes
    useEffect(() => {
        onSearch(debouncedSearch, categoryId)
    }, [debouncedSearch, categoryId, onSearch])

    const handleClear = () => {
        setSearch('')
        setCategoryId('')
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Búsqueda */}
                <div className="md:col-span-2">
                    <label htmlFor="search" className="block text-sm font-medium text-grimmiz-text mb-2">
                        Buscar
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            id="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por título o ID..."
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
                    <label htmlFor="category" className="block text-sm font-medium text-grimmiz-text mb-2">
                        Categoría
                    </label>
                    <select
                        id="category"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                        <option value="">Todas las categorías</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Botón limpiar filtros */}
            {(search || categoryId) && (
                <div className="mt-4">
                    <button
                        onClick={handleClear}
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
    )
}
