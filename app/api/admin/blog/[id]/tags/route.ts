import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

        const { data: tags, error } = await supabase
            .from('blog_article_tag')
            .select(`
                tag:tag_id (
                    id,
                    name,
                    slug
                )
            `)
            .eq('blog_article_id', articleId)

        if (error) {
            console.error('Error fetching article tags:', error)
            return NextResponse.json(
                { error: 'Error al obtener las etiquetas del artículo' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            tags: tags?.map(item => item.tag).filter(Boolean) || []
        })

    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}


