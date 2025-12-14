import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { deleteImage, extractPathFromUrl } from '@/lib/supabase/storage'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createClient()
        const articleId = parseInt(params.id)

        if (isNaN(articleId)) {
            return NextResponse.json(
                { error: 'ID de artículo inválido' },
                { status: 400 }
            )
        }

        const { data: article, error } = await supabase
            .from('blog_article')
            .select(`
                id,
                title,
                slug,
                excerpt,
                content,
                published,
                main_image_url,
                created_at,
                updated_at,
                category_id,
                category:category_id (
                    id,
                    name,
                    slug
                )
            `)
            .eq('id', articleId)
            .single()

        if (error) {
            console.error('Error fetching article:', error)
            return NextResponse.json(
                { error: 'Artículo no encontrado' },
                { status: 404 }
            )
        }

        return NextResponse.json({ article })

    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createClient()
        const articleId = parseInt(params.id)

        if (isNaN(articleId)) {
            return NextResponse.json(
                { error: 'ID de artículo inválido' },
                { status: 400 }
            )
        }

        const body = await request.json()
        const {
            title,
            slug,
            excerpt,
            content,
            category_id,
            published,
            main_image_url,
            tags
        } = body

        // Validaciones básicas
        if (!title || !slug || !excerpt || !content || !category_id) {
            return NextResponse.json(
                { error: 'Todos los campos obligatorios deben estar presentes' },
                { status: 400 }
            )
        }

        // Verificar que el slug no existe en otro artículo
        const { data: existingArticle } = await supabase
            .from('blog_article')
            .select('id')
            .eq('slug', slug)
            .neq('id', articleId)
            .single()

        if (existingArticle) {
            return NextResponse.json(
                { error: 'Ya existe otro artículo con este slug' },
                { status: 400 }
            )
        }

        // Actualizar el artículo
        const { data: article, error: articleError } = await supabase
            .from('blog_article')
            .update({
                title,
                slug,
                excerpt,
                content,
                category_id,
                published: published || false,
                main_image_url: main_image_url || null,
                updated_at: new Date().toISOString()
            })
            .eq('id', articleId)
            .select()
            .single()

        if (articleError) {
            console.error('Error updating article:', articleError)
            return NextResponse.json(
                { error: 'Error al actualizar el artículo' },
                { status: 500 }
            )
        }

        // Actualizar etiquetas
        if (tags !== undefined) {
            // Eliminar etiquetas existentes
            await supabase
                .from('blog_article_tag')
                .delete()
                .eq('blog_article_id', articleId)

            // Añadir nuevas etiquetas
            if (tags && tags.length > 0) {
                const tagInserts = tags.map((tagId: number) => ({
                    blog_article_id: articleId,
                    tag_id: tagId
                }))

                const { error: tagsError } = await supabase
                    .from('blog_article_tag')
                    .insert(tagInserts)

                if (tagsError) {
                    console.error('Error updating article tags:', tagsError)
                    // No fallar la actualización por error en tags
                }
            }
        }

        return NextResponse.json({
            article,
            message: 'Artículo actualizado exitosamente'
        })

    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createClient()
        const articleId = parseInt(params.id)

        if (isNaN(articleId)) {
            return NextResponse.json(
                { error: 'ID de artículo inválido' },
                { status: 400 }
            )
        }

        const body = await request.json()
        const { published } = body

        if (published === undefined) {
            return NextResponse.json(
                { error: 'Campo published requerido' },
                { status: 400 }
            )
        }

        const { data: article, error } = await supabase
            .from('blog_article')
            .update({
                published,
                updated_at: new Date().toISOString()
            })
            .eq('id', articleId)
            .select()
            .single()

        if (error) {
            console.error('Error updating article status:', error)
            return NextResponse.json(
                { error: 'Error al actualizar el estado del artículo' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            article,
            message: 'Estado del artículo actualizado exitosamente'
        })

    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createClient()
        const articleId = parseInt(params.id)

        if (isNaN(articleId)) {
            return NextResponse.json(
                { error: 'ID de artículo inválido' },
                { status: 400 }
            )
        }

        // Verificar que el artículo existe y obtener información para eliminar imágenes
        const { data: existingArticle, error: fetchError } = await supabase
            .from('blog_article')
            .select('id, title, main_image_url')
            .eq('id', articleId)
            .single()

        if (fetchError || !existingArticle) {
            return NextResponse.json(
                { error: 'Artículo no encontrado' },
                { status: 404 }
            )
        }

        // Obtener todas las imágenes adicionales para borrarlas del storage
        const { data: additionalImages } = await supabase
            .from('blog_article_image')
            .select('image_url')
            .eq('blog_article_id', articleId)

        // Eliminar etiquetas del artículo
        await supabase
            .from('blog_article_tag')
            .delete()
            .eq('blog_article_id', articleId)

        // Eliminar imágenes adicionales del artículo (de la DB)
        await supabase
            .from('blog_article_image')
            .delete()
            .eq('blog_article_id', articleId)

        // Eliminar el artículo
        const { error: deleteError } = await supabase
            .from('blog_article')
            .delete()
            .eq('id', articleId)

        if (deleteError) {
            console.error('Error deleting article:', deleteError)
            return NextResponse.json(
                { error: 'Error al eliminar el artículo' },
                { status: 500 }
            )
        }

        // Si se eliminó correctamente, borrar la imagen principal del storage
        if (existingArticle.main_image_url) {
            const imagePath = extractPathFromUrl(existingArticle.main_image_url)
            if (imagePath) {
                console.log(`Deleting article main image: ${imagePath}`)
                deleteImage(imagePath).catch(err =>
                    console.error('Failed to delete main image after article deletion:', err)
                )
            }
        }

        // Borrar todas las imágenes adicionales del storage
        if (additionalImages && additionalImages.length > 0) {
            console.log(`Deleting ${additionalImages.length} additional article images`)
            additionalImages.forEach(img => {
                const imagePath = extractPathFromUrl(img.image_url)
                if (imagePath) {
                    deleteImage(imagePath).catch(err =>
                        console.error('Failed to delete additional image:', err)
                    )
                }
            })
        }

        return NextResponse.json({
            message: 'Artículo eliminado exitosamente'
        })

    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
