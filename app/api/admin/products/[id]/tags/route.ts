import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

// GET - Obtener etiquetas de un producto
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const supabase = createAdminClient()

        const { data, error } = await supabase
            .from('product_tag')
            .select(`
                tag:tag_id (
                    id,
                    name,
                    slug
                )
            `)
            .eq('product_id', id)

        if (error) {
            console.error('Error fetching product tags:', error)
            return NextResponse.json(
                { error: 'Error al obtener las etiquetas del producto' },
                { status: 500 }
            )
        }

        // Extraer las etiquetas del resultado
        const tags = data?.map((item: any) => item.tag).filter(Boolean) || []

        return NextResponse.json({ tags })

    } catch (error) {
        console.error('Error in GET /api/admin/products/[id]/tags:', error)
        return NextResponse.json(
            { error: 'Error al procesar la solicitud' },
            { status: 500 }
        )
    }
}

// PUT - Actualizar etiquetas de un producto (reemplaza todas)
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { tagIds } = body

        if (!Array.isArray(tagIds)) {
            return NextResponse.json(
                { error: 'tagIds debe ser un array' },
                { status: 400 }
            )
        }

        const supabase = createAdminClient()

        // Verificar que el producto existe
        const { data: product, error: productError } = await supabase
            .from('product')
            .select('id')
            .eq('id', id)
            .single()

        if (productError || !product) {
            return NextResponse.json(
                { error: 'Producto no encontrado' },
                { status: 404 }
            )
        }

        // Eliminar todas las etiquetas existentes del producto
        const { error: deleteError } = await supabase
            .from('product_tag')
            .delete()
            .eq('product_id', id)

        if (deleteError) {
            console.error('Error deleting existing tags:', deleteError)
            return NextResponse.json(
                { error: 'Error al actualizar las etiquetas' },
                { status: 500 }
            )
        }

        // Si no hay etiquetas nuevas, retornar éxito
        if (tagIds.length === 0) {
            return NextResponse.json(
                { message: 'Etiquetas actualizadas exitosamente', tags: [] },
                { status: 200 }
            )
        }

        // Insertar las nuevas etiquetas
        const productTags = tagIds.map(tagId => ({
            product_id: parseInt(id),
            tag_id: tagId
        }))

        const { error: insertError } = await supabase
            .from('product_tag')
            .insert(productTags)

        if (insertError) {
            console.error('Error inserting new tags:', insertError)
            return NextResponse.json(
                { error: 'Error al actualizar las etiquetas' },
                { status: 500 }
            )
        }

        // Obtener las etiquetas actualizadas
        const { data } = await supabase
            .from('product_tag')
            .select(`
                tag:tag_id (
                    id,
                    name,
                    slug
                )
            `)
            .eq('product_id', id)

        const tags = data?.map((item: any) => item.tag).filter(Boolean) || []

        return NextResponse.json(
            { message: 'Etiquetas actualizadas exitosamente', tags },
            { status: 200 }
        )

    } catch (error) {
        console.error('Error in PUT /api/admin/products/[id]/tags:', error)
        return NextResponse.json(
            { error: 'Error al procesar la solicitud' },
            { status: 500 }
        )
    }
}

