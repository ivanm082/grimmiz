'use client'

import { useSearchParams } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import ArticleForm from '@/components/admin/ArticleForm'

export default function NewArticlePage() {
    const searchParams = useSearchParams()
    const returnUrl = searchParams.get('returnUrl')

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-grimmiz-text mb-2">Crear Nuevo Artículo</h1>
                    <p className="text-grimmiz-text-secondary">
                        Añade un nuevo artículo al Diario Grimmiz
                    </p>
                </div>

                {/* Form */}
                <ArticleForm mode="create" returnUrl={returnUrl} />
            </div>
        </AdminLayout>
    )
}