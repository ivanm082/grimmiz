import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { generateSlug } from '@/lib/utils'

// GET - Listar todas las categorías
export async function GET() {
    try {
        const supabase = createAdminClient()

        const { data, error } = await supabase
            .from('category')
            .select('*')
            .order('name', { ascending: true })

        if (error) {
            console.error('Error fetching categories:', error)
            return NextResponse.json(
                { error: 'Error al obtener categorías' },
                { status: 500 }
            )
        }

        return NextResponse.json({ categories: data || [] })

    } catch (error) {
        console.error('Error in GET /api/admin/categories:', error)
        return NextResponse.json(
            { error: 'Error al procesar la solicitud' },
            { status: 500 }
        )
    }
}

// POST - Crear una nueva categoría
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, image_url } = body

        if (!name) {
            return NextResponse.json(
                { error: 'El nombre es obligatorio' },
                { status: 400 }
            )
        }

        const supabase = createAdminClient()
        const slug = generateSlug(name)

        const { data, error } = await supabase
            .from('category')
            .insert([
                {
                    name,
                    slug,
                    image_url: image_url || null
                }
            ])
            .select()
            .single()

        if (error) {
            console.error('Error creating category:', error)
            return NextResponse.json(
                { error: 'Error al crear la categoría' },
                { status: 500 }
            )
        }

        return NextResponse.json(
            { category: data, message: 'Categoría creada exitosamente' },
            { status: 201 }
        )

    } catch (error) {
        console.error('Error in POST /api/admin/categories:', error)
        return NextResponse.json(
            { error: 'Error al procesar la solicitud' },
            { status: 500 }
        )
    }
}
