import { createAdminClient } from '@/lib/supabase/server'
import CategoriesTable from '@/components/admin/CategoriesTable'
import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
    const supabase = createAdminClient()

    const { data: categories } = await supabase
        .from('category')
        .select('*')
        .select('*')
        .order('name', { ascending: true })

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-grimmiz-text">Categorías</h1>
                    <Link
                        href="/admin/categories/new"
                        className="px-6 py-3 bg-secondary text-white rounded-lg font-semibold hover:bg-secondary-dark transition-colors shadow-lg hover:shadow-xl flex items-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Nueva Categoría
                    </Link>
                </div>

                <CategoriesTable categories={categories || []} />
            </div>
        </AdminLayout>
    )
}
