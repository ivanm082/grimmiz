import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { generateSlug } from '@/lib/utils'
import { revalidatePath } from 'next/cache'
import { deleteImage, extractPathFromUrl } from '@/lib/supabase/storage'

interface RouteContext {
    params: Promise<{
        id: string
    }>
}

// PUT - Actualizar una categoría
export async function PUT(
    request: Request,
    { params }: RouteContext
) {
    try {
        const { id } = await params
        const categoryId = parseInt(id)

        if (isNaN(categoryId)) {
            return NextResponse.json(
                { error: 'ID de categoría inválido' },
                { status: 400 }
            )
        }

        const body = await request.json()
        const { name, image_url } = body

        if (!name) {
            return NextResponse.json(
                { error: 'El nombre es obligatorio' },
                { status: 400 }
            )
        }

        const supabase = createAdminClient()

        // 1. Obtener la categoría actual para comparar imágenes
        const { data: currentCategory, error: fetchError } = await supabase
            .from('category')
            .select('image_url')
            .eq('id', categoryId)
            .single()

        if (fetchError) {
            console.error('Error fetching current category:', fetchError)
            return NextResponse.json(
                { error: 'Error al obtener la categoría actual' },
                { status: 500 }
            )
        }

        // 2. Si la imagen ha cambiado y había una imagen anterior, borrarla del storage
        if (currentCategory?.image_url && currentCategory.image_url !== image_url) {
            const oldPath = extractPathFromUrl(currentCategory.image_url)
            if (oldPath) {
                console.log(`Deleting old category image: ${oldPath}`)
                await deleteImage(oldPath)
            }
        }

        // Generar nuevo slug si el nombre cambió (opcional, pero recomendado para consistencia)
        const slug = generateSlug(name)

        const { data, error } = await supabase
            .from('category')
            .update({
                name,
                slug,
                image_url: image_url || null,
                updated_at: new Date().toISOString()
            })
            .eq('id', categoryId)
            .select()
            .single()

        if (error) {
            console.error('Error updating category:', error)
            return NextResponse.json(
                { error: 'Error al actualizar la categoría' },
                { status: 500 }
            )
        }

        revalidatePath('/admin/categories')
        revalidatePath(`/admin/categories/${categoryId}`)

        return NextResponse.json({
            category: data,
            message: 'Categoría actualizada exitosamente'
        })

    } catch (error) {
        console.error('Error in PUT /api/admin/categories/[id]:', error)
        return NextResponse.json(
            { error: 'Error al procesar la solicitud' },
            { status: 500 }
        )
    }
}

// DELETE - Eliminar una categoría
export async function DELETE(
    request: Request,
    { params }: RouteContext
) {
    try {
        const { id } = await params
        const categoryId = parseInt(id)

        if (isNaN(categoryId)) {
            return NextResponse.json(
                { error: 'ID de categoría inválido' },
                { status: 400 }
            )
        }

        const supabase = createAdminClient()

        // 1. Validar si hay productos asignados a esta categoría
        const { count, error: countError } = await supabase
            .from('product')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', categoryId)

        if (countError) {
            console.error('Error checking products in category:', countError)
            return NextResponse.json(
                { error: 'Error al verificar productos de la categoría' },
                { status: 500 }
            )
        }

        if (count && count > 0) {
            return NextResponse.json(
                {
                    error: 'No se puede eliminar la categoría porque tiene productos asignados. Por favor, reasigna o elimina los productos primero.'
                },
                { status: 400 }
            )
        }

        // 2. Obtener la categoría para borrar su imagen si existe
        const { data: categoryToDelete, error: fetchError } = await supabase
            .from('category')
            .select('image_url')
            .eq('id', categoryId)
            .single()

        if (fetchError) {
            // Si no se encuentra, quizás ya fue borrada, pero intentamos seguir
            console.warn('Category not found before delete:', fetchError)
        } else if (categoryToDelete?.image_url) {
            // Borrar imagen del storage
            const imagePath = extractPathFromUrl(categoryToDelete.image_url)
            if (imagePath) {
                console.log(`Deleting category image before deletion: ${imagePath}`)
                await deleteImage(imagePath)
            }
        }

        // 3. Si no hay productos, proceder con la eliminación
        const { error: deleteError } = await supabase
            .from('category')
            .delete()
            .eq('id', categoryId)

        if (deleteError) {
            console.error('Error deleting category:', deleteError)
            return NextResponse.json(
                { error: 'Error al eliminar la categoría' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            message: 'Categoría eliminada exitosamente'
        })

    } catch (error) {
        console.error('Error in DELETE /api/admin/categories/[id]:', error)
        return NextResponse.json(
            { error: 'Error al procesar la solicitud' },
            { status: 500 }
        )
    }
}
