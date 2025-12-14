import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

interface RouteContext {
    params: {
        id: string
    }
}

// GET - Obtener todas las imágenes adicionales de un artículo
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const articleId = parseInt(id)

        if (isNaN(articleId)) {
            return NextResponse.json(
                { error: 'ID de artículo inválido' },
                { status: 400 }
            )
        }

        const supabase = createAdminClient()

        // Verificar que el artículo existe
        const { data: article, error: articleError } = await supabase
            .from('blog_article')
            .select('id')
            .eq('id', articleId)
            .single()

        if (articleError || !article) {
            return NextResponse.json(
                { error: 'Artículo no encontrado' },
                { status: 404 }
            )
        }

        // Obtener imágenes adicionales ordenadas
        const { data: images, error } = await supabase
            .from('blog_article_image')
            .select('*')
            .eq('blog_article_id', articleId)
            .order('display_order', { ascending: true })

        if (error) {
            console.error('Error fetching additional images:', error)
            return NextResponse.json(
                { error: 'Error al obtener las imágenes' },
                { status: 500 }
            )
        }

        return NextResponse.json({ images: images || [] })

    } catch (error) {
        console.error('Error in GET /api/admin/blog/[id]/images:', error)
        return NextResponse.json(
            { error: 'Error al procesar la solicitud' },
            { status: 500 }
        )
    }
}

// POST - Crear una nueva imagen adicional
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const articleId = parseInt(id)

        if (isNaN(articleId)) {
            return NextResponse.json(
                { error: 'ID de artículo inválido' },
                { status: 400 }
            )
        }

        const body = await request.json()
        const { image_url, alt_text, caption } = body

        if (!image_url) {
            return NextResponse.json(
                { error: 'La URL de la imagen es requerida' },
                { status: 400 }
            )
        }

        const supabase = createAdminClient()

        // Verificar que el artículo existe
        const { data: article, error: articleError } = await supabase
            .from('blog_article')
            .select('id')
            .eq('id', articleId)
            .single()

        if (articleError || !article) {
            return NextResponse.json(
                { error: 'Artículo no encontrado' },
                { status: 404 }
            )
        }

        // Verificar límite de imágenes (máximo 8)
        const { count } = await supabase
            .from('blog_article_image')
            .select('*', { count: 'exact', head: true })
            .eq('blog_article_id', articleId)

        if (count !== null && count >= 8) {
            return NextResponse.json(
                { error: 'Se ha alcanzado el límite máximo de 8 imágenes adicionales' },
                { status: 400 }
            )
        }

        // Obtener el siguiente display_order
        const { data: lastImage } = await supabase
            .from('blog_article_image')
            .select('display_order')
            .eq('blog_article_id', articleId)
            .order('display_order', { ascending: false })
            .limit(1)
            .single()

        const nextOrder = lastImage ? lastImage.display_order + 1 : 1

        // Crear la imagen
        const { data, error } = await supabase
            .from('blog_article_image')
            .insert([
                {
                    blog_article_id: articleId,
                    image_url,
                    alt_text: alt_text || null,
                    caption: caption || null,
                    display_order: nextOrder
                }
            ])
            .select()
            .single()

        if (error) {
            console.error('Error creating additional image:', error)
            return NextResponse.json(
                { error: 'Error al crear la imagen' },
                { status: 500 }
            )
        }

        return NextResponse.json(
            { image: data, message: 'Imagen agregada exitosamente' },
            { status: 201 }
        )

    } catch (error) {
        console.error('Error in POST /api/admin/blog/[id]/images:', error)
        return NextResponse.json(
            { error: 'Error al procesar la solicitud' },
            { status: 500 }
        )
    }
}

// PUT - Actualizar el orden de las imágenes
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const articleId = parseInt(id)

        if (isNaN(articleId)) {
            return NextResponse.json(
                { error: 'ID de artículo inválido' },
                { status: 400 }
            )
        }

        const body = await request.json()
        const { images } = body

        if (!Array.isArray(images) || images.length === 0) {
            return NextResponse.json(
                { error: 'Se requiere un array de imágenes con id y display_order' },
                { status: 400 }
            )
        }

        const supabase = createAdminClient()

        // Estrategia de dos fases para evitar conflictos de unique constraint:
        // Fase 1: Establecer valores temporales negativos para liberar los valores actuales
        // Fase 2: Actualizar a los valores finales de forma secuencial

        const tempUpdates = images.map(async (img: { id: number, display_order: number }, index: number) => {
            const tempOrder = -(index + 1000)
            return supabase
                .from('blog_article_image')
                .update({ display_order: tempOrder })
                .eq('id', img.id)
                .eq('blog_article_id', articleId)
        })

        await Promise.all(tempUpdates)

        // Actualizar a los valores finales de forma secuencial
        for (const img of images) {
            const { error } = await supabase
                .from('blog_article_image')
                .update({ display_order: img.display_order })
                .eq('id', img.id)
                .eq('blog_article_id', articleId)

            if (error) {
                console.error(`Error updating image ${img.id}:`, error)
                return NextResponse.json(
                    { error: 'Error al actualizar el orden de las imágenes' },
                    { status: 500 }
                )
            }
        }

        return NextResponse.json({
            message: 'Orden actualizado exitosamente'
        })

    } catch (error) {
        console.error('Error in PUT /api/admin/blog/[id]/images:', error)
        return NextResponse.json(
            { error: 'Error al procesar la solicitud' },
            { status: 500 }
        )
    }
}
