import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateSlug } from '@/lib/utils'

export async function GET(request: NextRequest) {
    try {
        const supabase = createClient()
        const { searchParams } = new URL(request.url)

        // Parámetros de paginación
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const offset = (page - 1) * limit

        // Parámetros de filtro
        const search = searchParams.get('search')
        const categoryId = searchParams.get('category_id')
        const published = searchParams.get('published')

        let query = supabase
            .from('blog_article')
            .select(`
                id,
                title,
                slug,
                excerpt,
                published,
                created_at,
                updated_at,
                category:category_id (
                    id,
                    name
                )
            `, { count: 'exact' })
            .order('updated_at', { ascending: false })
            .range(offset, offset + limit - 1)

        // Aplicar filtros
        if (search) {
            query = query.ilike('title', `%${search}%`)
        }

        if (categoryId) {
            query = query.eq('category_id', parseInt(categoryId))
        }

        if (published !== null && published !== '') {
            query = query.eq('published', published === 'true')
        }

        const { data: articles, error, count } = await query

        if (error) {
            console.error('Error fetching articles:', error)
            return NextResponse.json(
                { error: 'Error al obtener los artículos' },
                { status: 500 }
            )
        }

        const totalPages = Math.ceil((count || 0) / limit)
        const totalItems = count || 0

        return NextResponse.json({
            articles: articles || [],
            totalPages,
            totalItems,
            currentPage: page
        })

    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = createClient()
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

        // Verificar que el slug no existe
        const { data: existingArticle } = await supabase
            .from('blog_article')
            .select('id')
            .eq('slug', slug)
            .single()

        if (existingArticle) {
            return NextResponse.json(
                { error: 'Ya existe un artículo con este slug' },
                { status: 400 }
            )
        }

        // Crear el artículo
        const { data: article, error: articleError } = await supabase
            .from('blog_article')
            .insert({
                title,
                slug,
                excerpt,
                content,
                category_id,
                published: published || false,
                main_image_url: main_image_url || null
            })
            .select()
            .single()

        if (articleError) {
            console.error('Error creating article:', articleError)
            return NextResponse.json(
                { error: 'Error al crear el artículo' },
                { status: 500 }
            )
        }

        // Asignar etiquetas si se proporcionaron
        if (tags && tags.length > 0) {
            const tagInserts = tags.map((tagId: number) => ({
                blog_article_id: article.id,
                tag_id: tagId
            }))

            const { error: tagsError } = await supabase
                .from('blog_article_tag')
                .insert(tagInserts)

            if (tagsError) {
                console.error('Error creating article tags:', tagsError)
                // No fallar la creación del artículo por error en tags
            }
        }

        return NextResponse.json({
            article,
            message: 'Artículo creado exitosamente'
        })

    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
