import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

// POST - Duplicar producto
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const supabase = createAdminClient()

        // Obtener el producto original
        const { data: originalProduct, error: fetchError } = await supabase
            .from('product')
            .select('*')
            .eq('id', id)
            .single()

        if (fetchError || !originalProduct) {
            return NextResponse.json(
                { error: 'Producto no encontrado' },
                { status: 404 }
            )
        }

        // Verificar que la categoría existe
        const { data: category, error: categoryError } = await supabase
            .from('category')
            .select('id')
            .eq('id', originalProduct.category_id)
            .single()

        if (categoryError || !category) {
            return NextResponse.json(
                { error: 'La categoría del producto no existe' },
                { status: 400 }
            )
        }

        // Generar un slug único añadiendo un sufijo
        let newSlug = `${originalProduct.slug}-copia`
        let counter = 1

        // Verificar si el slug ya existe y generar uno único
        while (true) {
            const { data: existingProduct } = await supabase
                .from('product')
                .select('id')
                .eq('slug', newSlug)
                .single()

            if (!existingProduct) {
                break
            }

            counter++
            newSlug = `${originalProduct.slug}-copia-${counter}`
        }

        // Crear producto duplicado (sin imágenes ni fechas)
        const { data: duplicatedProduct, error: insertError } = await supabase
            .from('product')
            .insert([
                {
                    title: originalProduct.title,
                    description: originalProduct.description,
                    price: originalProduct.price,
                    category_id: originalProduct.category_id,
                    slug: newSlug,
                    internal_notes: originalProduct.internal_notes,
                    materials: originalProduct.materials,
                    stock: originalProduct.stock,
                    // No copiamos: main_image_url, created_at, updated_at (se generan automáticamente)
                }
            ])
            .select()
            .single()

        if (insertError) {
            console.error('Error duplicating product:', insertError)
            return NextResponse.json(
                { error: 'Error al duplicar el producto' },
                { status: 500 }
            )
        }

        return NextResponse.json(
            {
                product: duplicatedProduct,
                message: 'Producto duplicado exitosamente'
            },
            { status: 201 }
        )

    } catch (error) {
        console.error('Error in POST /api/admin/products/[id]/duplicate:', error)
        return NextResponse.json(
            { error: 'Error al procesar la solicitud' },
            { status: 500 }
        )
    }
}

