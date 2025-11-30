import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { generateSlug } from '@/lib/utils'

// GET - Obtener todas las etiquetas
export async function GET() {
    try {
        const supabase = createAdminClient()

        const { data: tags, error } = await supabase
            .from('tag')
            .select('*')
            .order('name', { ascending: true })

        if (error) {
            console.error('Error fetching tags:', error)
            return NextResponse.json(
                { error: 'Error al obtener las etiquetas' },
                { status: 500 }
            )
        }

        return NextResponse.json({ tags: tags || [] })

    } catch (error) {
        console.error('Error in GET /api/admin/tags:', error)
        return NextResponse.json(
            { error: 'Error al procesar la solicitud' },
            { status: 500 }
        )
    }
}

// POST - Crear nueva etiqueta
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name } = body

        if (!name || !name.trim()) {
            return NextResponse.json(
                { error: 'El nombre de la etiqueta es requerido' },
                { status: 400 }
            )
        }

        const supabase = createAdminClient()
        const slug = generateSlug(name)

        // Verificar si ya existe una etiqueta con el mismo nombre
        const { data: existingTag } = await supabase
            .from('tag')
            .select('id, name')
            .eq('name', name.trim())
            .single()

        if (existingTag) {
            // Si ya existe, devolver la etiqueta existente
            return NextResponse.json(
                { tag: existingTag },
                { status: 200 }
            )
        }

        // Crear nueva etiqueta
        const { data: newTag, error } = await supabase
            .from('tag')
            .insert([{ name: name.trim(), slug }])
            .select()
            .single()

        if (error) {
            console.error('Error creating tag:', error)

            // Si es error de slug duplicado, intentar con un sufijo
            if (error.code === '23505') {
                const slugWithTimestamp = `${slug}-${Date.now()}`
                const { data: retryTag, error: retryError } = await supabase
                    .from('tag')
                    .insert([{ name: name.trim(), slug: slugWithTimestamp }])
                    .select()
                    .single()

                if (retryError) {
                    return NextResponse.json(
                        { error: 'Error al crear la etiqueta' },
                        { status: 500 }
                    )
                }

                return NextResponse.json(
                    { tag: retryTag },
                    { status: 201 }
                )
            }

            return NextResponse.json(
                { error: 'Error al crear la etiqueta' },
                { status: 500 }
            )
        }

        return NextResponse.json(
            { tag: newTag },
            { status: 201 }
        )

    } catch (error) {
        console.error('Error in POST /api/admin/tags:', error)
        return NextResponse.json(
            { error: 'Error al procesar la solicitud' },
            { status: 500 }
        )
    }
}

