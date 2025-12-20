import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { name, email, comments, product } = await request.json()
    const supabase = createClient()

    // Validar campos requeridos
    if (!name || !email || !comments) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios' },
        { status: 400 }
      )
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'El formato del email no es válido' },
        { status: 400 }
      )
    }

    // Obtener el ID y slug del producto si existe (opcional)
    let productId = null
    let productSlug = null
    if (product) {
      const { data: productData } = await supabase
        .from('product')
        .select('id, slug')
        .eq('title', product)
        .single()

      productId = productData?.id || null
      productSlug = productData?.slug || null
    }

    // Enviar email al propietario de la tienda
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: process.env.CONTACT_EMAIL || 'tu-email@ejemplo.com',
      replyTo: email,
      subject: `Nuevo interés en producto: ${product}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 30px 0;">
            <h1 style="color: #7c5aa3; margin: 0;">Nuevo mensaje de contacto 📬</h1>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 25px; border-radius: 12px; margin: 20px 0;">
            <h2 style="color: #2b2b2b; margin: 0 0 15px 0; font-size: 18px;">
              Producto de interés:
            </h2>
            <p style="color: #7c5aa3; font-size: 18px; font-weight: bold; margin: 0;">
              ${product}
            </p>
          </div>

          <div style="background-color: white; border: 2px solid #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2b2b2b; margin: 0 0 15px 0; font-size: 16px;">Datos de contacto:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #555555;">
                  <strong style="color: #2b2b2b;">Nombre:</strong>
                </td>
                <td style="padding: 8px 0; color: #555555;">
                  ${name}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555555;">
                  <strong style="color: #2b2b2b;">Email:</strong>
                </td>
                <td style="padding: 8px 0; color: #555555;">
                  <a href="mailto:${email}" style="color: #7c5aa3; text-decoration: none;">${email}</a>
                </td>
              </tr>
            </table>
          </div>

          <div style="background-color: white; border: 2px solid #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2b2b2b; margin: 0 0 15px 0; font-size: 16px;">Mensaje:</h3>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; border-left: 4px solid #93c020;">
              <p style="color: #555555; white-space: pre-wrap; margin: 0; line-height: 1.6;">${comments}</p>
            </div>
          </div>

          <div style="text-align: center; padding: 20px 0; background-color: #f0f9ff; border-radius: 8px; margin: 20px 0;">
            <p style="color: #555555; font-size: 14px; margin: 0;">
              💡 <strong>Tip:</strong> Puedes responder directamente a este email para contactar con ${name}
            </p>
          </div>

          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
          
          <p style="color: #999999; font-size: 12px; text-align: center; margin: 0;">
            Este mensaje fue enviado desde el formulario de contacto de <strong>Grimmiz</strong>
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Error al enviar email con Resend:', error)
      return NextResponse.json(
        { error: 'Error al enviar el mensaje. Por favor, inténtalo de nuevo.' },
        { status: 500 }
      )
    }

    // Guardar el lead en la base de datos
    try {
      const { error: leadError } = await supabase
        .from('product_lead')
        .insert([
          {
            product_id: productId,
            product_title: product || 'Producto no especificado',
            product_slug: productSlug,
            name: name.trim(),
            email: email.trim(),
            comments: comments.trim(),
            status: 'nuevo'
          }
        ])

      if (leadError) {
        console.error('Error al guardar el lead:', leadError)
        // No lanzamos error aquí, el email ya se envió correctamente
      }
    } catch (leadSaveError) {
      console.error('Error al guardar el lead en la base de datos:', leadSaveError)
      // No lanzamos error aquí, el email ya se envió correctamente
    }

    return NextResponse.json(
      {
        message: 'Mensaje enviado correctamente',
        id: data?.id
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error en la API de contacto:', error)
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}

