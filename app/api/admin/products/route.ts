import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

// GET - Listar productos con paginación y búsqueda
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const search = searchParams.get('search') || ''
        const categoryId = searchParams.get('category_id') || ''
        const sort = searchParams.get('sort') || 'created_at'
        const order = searchParams.get('order') || 'desc'

        const supabase = createClient()

        // Calcular offset
        const offset = (page - 1) * limit

        // Construir query base
        let query = supabase
            .from('product')
            .select(`
        *,
        category:category_id (
          id,
          name,
          slug
        )
      `, { count: 'exact' })

        // Aplicar filtro de búsqueda
        if (search) {
            // Buscar por título o ID
            if (!isNaN(Number(search))) {
                query = query.or(`id.eq.${search},title.ilike.%${search}%`)
            } else {
                query = query.ilike('title', `%${search}%`)
            }
        }

        // Aplicar filtro de categoría
        if (categoryId) {
            query = query.eq('category_id', categoryId)
        }

        // Aplicar ordenamiento
        query = query.order(sort, { ascending: order === 'asc' })

        // Aplicar paginación
        query = query.range(offset, offset + limit - 1)

        const { data, error, count } = await query

        if (error) {
            console.error('Error fetching products:', error)
            return NextResponse.json(
                { error: 'Error al obtener productos' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            products: data || [],
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit)
            }
        })

    } catch (error) {
        console.error('Error in GET /api/admin/products:', error)
        return NextResponse.json(
            { error: 'Error al procesar la solicitud' },
            { status: 500 }
        )
    }
}

// POST - Crear nuevo producto
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { title, description, price, category_id, main_image_url, slug, internal_notes, materials, stock } = body

        // Validar campos requeridos
        if (!title || !price || !category_id || !slug) {
            return NextResponse.json(
                { error: 'Título, precio, categoría y slug son requeridos' },
                { status: 400 }
            )
        }

        const supabase = createAdminClient()

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

        // Crear producto
        const { data, error } = await supabase
            .from('product')
            .insert([
                {
                    title,
                    description: description || null,
                    price: parseFloat(price),
                    category_id,
                    main_image_url: main_image_url || null,
                    slug,
                    internal_notes: internal_notes || null,
                    materials: materials || null,
                    stock: stock !== null && stock !== undefined ? parseInt(stock) : null
                }
            ])
            .select()
            .single()

        if (error) {
            console.error('Error creating product:', error)

            // Verificar si es error de slug duplicado
            if (error.code === '23505') {
                return NextResponse.json(
                    { error: 'Ya existe un producto con ese slug' },
                    { status: 400 }
                )
            }

            return NextResponse.json(
                { error: 'Error al crear el producto' },
                { status: 500 }
            )
        }

        return NextResponse.json(
            { product: data, message: 'Producto creado exitosamente' },
            { status: 201 }
        )

    } catch (error) {
        console.error('Error in POST /api/admin/products:', error)
        return NextResponse.json(
            { error: 'Error al procesar la solicitud' },
            { status: 500 }
        )
    }
}
