import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

// GET - Obtener leads con filtros
export async function GET(request: Request) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)

    // Parámetros de paginación
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    // Parámetros de filtro
    const search = searchParams.get('search')?.trim()
    const productTitle = searchParams.get('product_title')?.trim()
    const status = searchParams.get('status')?.trim()
    const dateFrom = searchParams.get('date_from')?.trim()
    const dateTo = searchParams.get('date_to')?.trim()

    // Construir la consulta base
    let query = supabase
      .from('product_lead')
      .select('*', { count: 'exact' })

    // Aplicar filtros
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,comments.ilike.%${search}%`)
    }

    if (productTitle) {
      query = query.ilike('product_title', `%${productTitle}%`)
    }

    if (status) {
      query = query.eq('status', status)
    }

    if (dateFrom) {
      query = query.gte('created_at', dateFrom)
    }

    if (dateTo) {
      // Añadir un día completo al dateTo para incluir todo el día
      const endDate = new Date(dateTo)
      endDate.setDate(endDate.getDate() + 1)
      query = query.lt('created_at', endDate.toISOString().split('T')[0])
    }

    // Ordenar por fecha de creación descendente
    query = query.order('created_at', { ascending: false })

    // Aplicar paginación
    query = query.range(offset, offset + limit - 1)

    // Ejecutar consulta
    const { data: leads, error, count } = await query

    if (error) {
      console.error('Error fetching leads:', error)
      return NextResponse.json(
        { error: 'Error al obtener los leads' },
        { status: 500 }
      )
    }

    // Calcular información de paginación
    const totalItems = count || 0
    const totalPages = Math.ceil(totalItems / limit)

    return NextResponse.json({
      leads: leads || [],
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    })

  } catch (error) {
    console.error('Error in GET /api/admin/leads:', error)
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}

// PATCH - Actualizar estado de un lead
export async function PATCH(request: Request) {
  try {
    const supabase = createAdminClient()
    const { id, status } = await request.json()

    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID y status son requeridos' },
        { status: 400 }
      )
    }

    // Validar que el status sea válido
    const validStatuses = ['nuevo', 'contactado', 'convertido', 'descartado']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Status no válido' },
        { status: 400 }
      )
    }

    // Actualizar el lead
    const { data: updatedLead, error } = await supabase
      .from('product_lead')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating lead:', error)
      return NextResponse.json(
        { error: 'Error al actualizar el lead' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      lead: updatedLead,
      message: 'Lead actualizado correctamente'
    })

  } catch (error) {
    console.error('Error in PATCH /api/admin/leads:', error)
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}
