import { NextResponse } from 'next/server'
import { uploadImage, deleteImage, extractPathFromUrl } from '@/lib/supabase/storage'

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File
        const folder = formData.get('folder') as string || 'products'

        if (!file) {
            return NextResponse.json(
                { error: 'No se proporcionó ningún archivo' },
                { status: 400 }
            )
        }

        // Subir imagen a Supabase Storage
        const result = await uploadImage(file, folder)

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

export async function DELETE(request: Request) {
    try {
        const body = await request.json()
        const { url } = body

        if (!url) {
            return NextResponse.json(
                { error: 'URL de imagen requerida' },
                { status: 400 }
            )
        }

        const path = extractPathFromUrl(url)
        if (!path) {
            return NextResponse.json(
                { error: 'URL de imagen inválida' },
                { status: 400 }
            )
        }

        const result = await deleteImage(path)

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            )
        }

        return NextResponse.json({ message: 'Imagen eliminada correctamente' })

    } catch (error) {
        console.error('Error in DELETE /api/admin/upload:', error)
        return NextResponse.json(
            { error: 'Error al procesar la solicitud' },
            { status: 500 }
        )
    }
}
