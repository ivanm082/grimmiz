'use client'

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    totalItems?: number
    itemsPerPage?: number
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    itemsPerPage
}: PaginationProps) {
    const pages = []
    const maxPagesToShow = 5

    // Calcular rango de páginas a mostrar
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)

    if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
    }

    if (totalPages === 0) {
        return null
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            {/* Info de resultados */}
            {totalItems !== undefined && itemsPerPage !== undefined && (
                <div className="text-sm text-grimmiz-text-secondary">
                    Mostrando{' '}
                    <span className="font-medium text-grimmiz-text">
                        {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}
                    </span>
                    {' '}-{' '}
                    <span className="font-medium text-grimmiz-text">
                        {Math.min(currentPage * itemsPerPage, totalItems)}
                    </span>
                    {' '}de{' '}
                    <span className="font-medium text-grimmiz-text">{totalItems}</span>
                    {' '}resultados
                </div>
            )}

            {/* Botones de paginación */}
            <div className="flex items-center gap-2">
                {/* Botón anterior */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg border border-gray-300 text-grimmiz-text hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Primera página */}
                {startPage > 1 && (
                    <>
                        <button
                            onClick={() => onPageChange(1)}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-grimmiz-text hover:bg-gray-50 transition-colors"
                        >
                            1
                        </button>
                        {startPage > 2 && (
                            <span className="px-2 text-grimmiz-text-secondary">...</span>
                        )}
                    </>
                )}

                {/* Páginas */}
                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${page === currentPage
                                ? 'bg-primary text-white border-primary'
                                : 'border-gray-300 text-grimmiz-text hover:bg-gray-50'
                            }`}
                    >
                        {page}
                    </button>
                ))}

                {/* Última página */}
                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && (
                            <span className="px-2 text-grimmiz-text-secondary">...</span>
                        )}
                        <button
                            onClick={() => onPageChange(totalPages)}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-grimmiz-text hover:bg-gray-50 transition-colors"
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                {/* Botón siguiente */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg border border-gray-300 text-grimmiz-text hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    )
}
