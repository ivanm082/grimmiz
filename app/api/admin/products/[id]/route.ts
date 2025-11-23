import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { deleteImage, extractPathFromUrl } from '@/lib/supabase/storage'

// GET - Obtener producto por ID
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        console.log(`Fetching product with ID: ${id}`)

        const supabase = createAdminClient()

        const { data, error } = await supabase
            .from('product')
            .select(`
        *,
        category:category_id (
          id,
          name,
          slug
        ),
        additional_images:additional_product_images (
          id,
          image_url,
          alt_text,
          caption,
          display_order
        )
      `)
            .eq('id', id)
            .single()

        if (error || !data) {
            return NextResponse.json(
                { error: 'Producto no encontrado' },
                { status: 404 }
            )
        }

        return NextResponse.json({ product: data })

    } catch (error) {
        console.error('Error in GET /api/admin/products/[id]:', error)
        // @ts-ignore
        if (error?.message) console.error('Error message:', error.message)
        return NextResponse.json(
            { error: 'Error al procesar la solicitud' },
            { status: 500 }
        )
    }
}

// PUT - Actualizar producto
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { title, description, price, category_id, main_image_url, slug } = body

        // Validar campos requeridos
        if (!title || !price || !category_id || !slug) {
            return NextResponse.json(
                { error: 'Título, precio, categoría y slug son requeridos' },
                { status: 400 }
            )
        }

        const supabase = createAdminClient()

        // Verificar que el producto existe y obtener imagen actual
        const { data: existingProduct, error: fetchError } = await supabase
            .from('product')
            .select('id, main_image_url')
            .eq('id', id)
            .single()

        if (fetchError || !existingProduct) {
            return NextResponse.json(
                { error: 'Producto no encontrado' },
                { status: 404 }
            )
        }

        // Verificar que la categoría existe
        const { data: category, error: categoryError } = await supabase
            .from('category')
            .select('id')
            .eq('id', category_id)
            .single()

        if (categoryError || !category) {
            return NextResponse.json(
                { error: 'La categoría especificada no existe' },
                { status: 400 }
            )
        }

        // Si la imagen principal ha cambiado, eliminar la anterior del storage
        if (existingProduct.main_image_url && existingProduct.main_image_url !== main_image_url) {
            const oldImagePath = extractPathFromUrl(existingProduct.main_image_url)
            if (oldImagePath) {
                console.log(`Deleting old image: ${oldImagePath}`)
                // No esperamos a que termine para no bloquear la respuesta, pero logueamos errores
                deleteImage(oldImagePath).then(result => {
                    if (!result.success) {
                        console.error('Failed to delete old image:', result.error)
                    }
                })
            }
        }

        // Actualizar producto
        const { data, error } = await supabase
            .from('product')
            .update({
                title,
                description: description || null,
                price: parseFloat(price),
                category_id,
                main_image_url: main_image_url || null,
                slug,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('Error updating product:', error)

            // Verificar si es error de slug duplicado
            if (error.code === '23505') {
                return NextResponse.json(
                    { error: 'Ya existe un producto con ese slug' },
                    { status: 400 }
                )
            }

            return NextResponse.json(
                { error: 'Error al actualizar el producto' },
                { status: 500 }
            )
        }

        return NextResponse.json(
            { product: data, message: 'Producto actualizado exitosamente' },
            { status: 200 }
        )

    } catch (error) {
        console.error('Error in PUT /api/admin/products/[id]:', error)
        return NextResponse.json(
            { error: 'Error al procesar la solicitud' },
            { status: 500 }
        )
    }
}

// DELETE - Eliminar producto
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const supabase = createAdminClient()

        // Verificar que el producto existe y obtener imagen para borrarla
        const { data: existingProduct, error: fetchError } = await supabase
            .from('product')
            .select('id, main_image_url')
            .eq('id', id)
            .single()

        if (fetchError || !existingProduct) {
            return NextResponse.json(
                { error: 'Producto no encontrado' },
                { status: 404 }
            )
        }

        // Eliminar producto (cascade eliminará imágenes adicionales de la DB)
        // Pero necesitamos borrar la imagen principal del Storage manualmente
        const { error } = await supabase
            .from('product')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting product:', error)
            return NextResponse.json(
                { error: 'Error al eliminar el producto' },
                { status: 500 }
            )
        }

        // Si se eliminó correctamente, borrar la imagen del storage
        if (existingProduct.main_image_url) {
            const imagePath = extractPathFromUrl(existingProduct.main_image_url)
            if (imagePath) {
                console.log(`Deleting product image: ${imagePath}`)
                deleteImage(imagePath).catch(err =>
                    console.error('Failed to delete image after product deletion:', err)
                )
            }
        }

        return NextResponse.json(
            { message: 'Producto eliminado exitosamente' },
            { status: 200 }
        )

    } catch (error) {
        console.error('Error in DELETE /api/admin/products/[id]:', error)
        return NextResponse.json(
            { error: 'Error al procesar la solicitud' },
            { status: 500 }
        )
    }
}
