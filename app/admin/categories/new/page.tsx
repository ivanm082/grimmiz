import CategoryForm from '@/components/admin/CategoryForm'
import AdminLayout from '@/components/admin/AdminLayout'

export default function NewCategoryPage() {
    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-grimmiz-text mb-2">Crear Nueva Categoría</h1>
                    <p className="text-grimmiz-text-secondary">
                        Añade una nueva categoría para organizar tus productos
                    </p>
                </div>

                {/* Form */}
                <CategoryForm mode="create" />
            </div>
        </AdminLayout>
    )
}
