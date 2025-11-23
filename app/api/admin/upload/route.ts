import { NextResponse } from 'next/server'
import { uploadImage } from '@/lib/supabase/storage'

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json(
                { error: 'No se proporcionó ningún archivo' },
                { status: 400 }
            )
        }

        // Subir imagen a Supabase Storage
        const result = await uploadImage(file, 'products')

        if ('error' in result) {
            return NextResponse.json(
                { error: result.error },
                { status: 400 }
            )
        }

        return NextResponse.json({
            url: result.url,
            path: result.path
        })

    } catch (error) {
        console.error('Error in POST /api/admin/upload:', error)
        return NextResponse.json(
            { error: 'Error al procesar la solicitud' },
            { status: 500 }
        )
    }
}
