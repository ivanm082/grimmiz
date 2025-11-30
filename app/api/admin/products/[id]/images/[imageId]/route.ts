import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

interface RouteContext {
    params: {
        id: string
        imageId: string
    }
}

// DELETE - Eliminar una imagen adicional
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string, imageId: string }> }
) {
    try {
        const { id, imageId: imageIdStr } = await params
        const productId = parseInt(id)
        const imageId = parseInt(imageIdStr)

        if (isNaN(productId) || isNaN(imageId)) {
            return NextResponse.json(
                { error: 'ID inválido' },
                { status: 400 }
            )
        }

        const supabase = createAdminClient()

        // Obtener la imagen para verificar que existe y obtener la URL
        const { data: image, error: fetchError } = await supabase
            .from('additional_product_images')
            .select('*')
            .eq('id', imageId)
            .eq('product_id', productId)
            .single()

        if (fetchError || !image) {
            return NextResponse.json(
                { error: 'Imagen no encontrada' },
                { status: 404 }
            )
        }

        // Eliminar la imagen del storage
        if (image.image_url) {
            try {
                // Extraer el path del storage de la URL
                const url = new URL(image.image_url)
                const pathParts = url.pathname.split('/storage/v1/object/public/')
                if (pathParts.length > 1) {
                    const fullPath = pathParts[1]
                    const bucketAndPath = fullPath.split('/')
                    const bucket = bucketAndPath[0]
                    const filePath = bucketAndPath.slice(1).join('/')

                    await supabase.storage
                        .from(bucket)
                        .remove([filePath])
                }
            } catch (storageError) {
                console.error('Error deleting image from storage:', storageError)
                // Continuar con la eliminación del registro aunque falle el storage
            }
        }

        // Eliminar el registro de la base de datos
        const { error: deleteError } = await supabase
            .from('additional_product_images')
            .delete()
            .eq('id', imageId)
            .eq('product_id', productId)

        if (deleteError) {
            console.error('Error deleting image record:', deleteError)
            return NextResponse.json(
                { error: 'Error al eliminar la imagen' },
                { status: 500 }
            )
        }

        // Reordenar las imágenes restantes
        const { data: remainingImages } = await supabase
            .from('additional_product_images')
            .select('id')
            .eq('product_id', productId)
            .order('display_order', { ascending: true })

        if (remainingImages && remainingImages.length > 0) {
            const updates = remainingImages.map((img, index) => {
                return supabase
                    .from('additional_product_images')
                    .update({ display_order: index + 1 })
                    .eq('id', img.id)
            })

            await Promise.all(updates)
        }

        return NextResponse.json({
            message: 'Imagen eliminada exitosamente'
        })

    } catch (error) {
        console.error('Error in DELETE /api/admin/products/[id]/images/[imageId]:', error)
        return NextResponse.json(
            { error: 'Error al procesar la solicitud' },
            { status: 500 }
        )
    }
}
