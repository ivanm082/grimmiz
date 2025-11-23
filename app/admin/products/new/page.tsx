'use client'

import { useSearchParams } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import ProductForm from '@/components/admin/ProductForm'

export default function NewProductPage() {
    const searchParams = useSearchParams()
    const returnUrl = searchParams.get('returnUrl')

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-grimmiz-text mb-2">Crear Nuevo Producto</h1>
                    <p className="text-grimmiz-text-secondary">
                        Añade un nuevo producto a tu catálogo
                    </p>
                </div>

                {/* Form */}
                <ProductForm mode="create" returnUrl={returnUrl} />
            </div>
        </AdminLayout>
    )
}
