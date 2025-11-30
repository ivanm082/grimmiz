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
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-grimmiz-text">Editar Categoría</h1>
                </div>

                <CategoryForm category={category} mode="edit" />
            </div>
        </AdminLayout>
    )
}
