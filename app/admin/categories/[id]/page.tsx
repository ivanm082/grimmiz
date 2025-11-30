import { createAdminClient } from '@/lib/supabase/server'
import CategoryForm from '@/components/admin/CategoryForm'
import AdminLayout from '@/components/admin/AdminLayout'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface PageProps {
    params: Promise<{
        id: string
    }>
}

export default async function EditCategoryPage({ params }: PageProps) {
    const { id } = await params
    const categoryId = parseInt(id)

    if (isNaN(categoryId)) {
        notFound()
    }

    const supabase = createAdminClient()

    const { data: category } = await supabase
        .from('category')
        .select('*')
        .eq('id', categoryId)
        .single()

    if (!category) {
        notFound()
    }

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-grimmiz-text mb-2">Editar Categoría</h1>
                    <p className="text-grimmiz-text-secondary">
                        Modifica la información de la categoría
                    </p>
                </div>

                {/* Form */}
                <CategoryForm category={category} mode="edit" />
            </div>
        </AdminLayout>
    )
}
