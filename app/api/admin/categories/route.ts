import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Listar todas las categorías
export async function GET() {
    try {
        const supabase = createClient()

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
