import CategoryForm from '@/components/admin/CategoryForm'
import AdminLayout from '@/components/admin/AdminLayout'

export default function NewCategoryPage() {
    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-grimmiz-text">Nueva Categoría</h1>
                </div>

                <CategoryForm mode="create" />
            </div>
        </AdminLayout>
    )
}
