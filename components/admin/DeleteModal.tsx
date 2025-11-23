'use client'

interface DeleteModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    productName: string
    isDeleting?: boolean
}

export default function DeleteModal({
    isOpen,
    onClose,
    onConfirm,
    productName,
    isDeleting = false
}: DeleteModalProps) {
    if (!isOpen) return null

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 z-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="bg-white rounded-lg shadow-2xl max-w-md w-full"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h2 className="ml-4 text-xl font-bold text-grimmiz-text">
                                Confirmar Eliminación
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-grimmiz-text-secondary hover:text-grimmiz-text transition-colors"
                            disabled={isDeleting}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <p className="text-grimmiz-text mb-4">
                            ¿Estás seguro de que quieres eliminar el producto{' '}
                            <span className="font-semibold">&ldquo;{productName}&rdquo;</span>?
                        </p>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-sm text-red-800">
                                <strong>⚠️ Advertencia:</strong> Esta acción no se puede deshacer. El producto y todas sus imágenes adicionales serán eliminados permanentemente.
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 p-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 text-grimmiz-text rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                            disabled={isDeleting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Eliminando...' : 'Eliminar'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
