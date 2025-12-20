import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

// POST - Duplicar artículo
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const supabase = createAdminClient()

        // Obtener el artículo original
        const { data: originalArticle, error: fetchError } = await supabase
            .from('blog_article')
            .select('*')
            .eq('id', id)
            .single()

        if (fetchError || !originalArticle) {
            return NextResponse.json(
                { error: 'Artículo no encontrado' },
                { status: 404 }
            )
        }

        // Verificar que la categoría existe
        const { data: category, error: categoryError } = await supabase
            .from('category')
            .select('id')
            .eq('id', originalArticle.category_id)
            .single()

        if (categoryError || !category) {
            return NextResponse.json(
                { error: 'La categoría del artículo no existe' },
                { status: 400 }
            )
        }

        // Generar un slug único añadiendo un sufijo
        let newSlug = `${originalArticle.slug}-copia`
        let counter = 1

        // Verificar si el slug ya existe y generar uno único
        while (true) {
            const { data: existingArticle } = await supabase
                .from('blog_article')
                .select('id')
                .eq('slug', newSlug)
                .single()

            if (!existingArticle) {
                break
            }

            counter++
            newSlug = `${originalArticle.slug}-copia-${counter}`
        }

        // Crear artículo duplicado (sin imágenes ni fechas)
        const { data: duplicatedArticle, error: insertError } = await supabase
            .from('blog_article')
            .insert([
                {
                    title: originalArticle.title,
                    excerpt: originalArticle.excerpt,
                    content: originalArticle.content,
                    category_id: originalArticle.category_id,
                    slug: newSlug,
                    main_image_url: '', // Valor vacío por defecto (la tabla requiere NOT NULL)
                    published: false, // Los duplicados empiezan como borradores
                    // No copiamos: created_at, updated_at (se generan automáticamente)
                }
            ])
            .select()
            .single()

        if (insertError) {
            console.error('Error duplicating article:', insertError)
            return NextResponse.json(
                { error: 'Error al duplicar el artículo' },
                { status: 500 }
            )
        }

        // Clonar las etiquetas del artículo original
        const { data: originalTags } = await supabase
            .from('blog_article_tag')
            .select('tag_id')
            .eq('blog_article_id', id)

        if (originalTags && originalTags.length > 0) {
            const newArticleTags = originalTags.map(tag => ({
                blog_article_id: duplicatedArticle.id,
                tag_id: tag.tag_id
            }))

            const { error: tagsError } = await supabase
                .from('blog_article_tag')
                .insert(newArticleTags)

            if (tagsError) {
                console.error('Error duplicating tags:', tagsError)
                // No lanzamos error aquí, el artículo ya se creó exitosamente
            }
        }

        return NextResponse.json(
            {
                article: duplicatedArticle,
                message: 'Artículo duplicado exitosamente'
            },
            { status: 201 }
        )

    } catch (error) {
        console.error('Error in POST /api/admin/blog/[id]/duplicate:', error)
        return NextResponse.json(
            { error: 'Error al procesar la solicitud' },
            { status: 500 }
        )
    }
}
