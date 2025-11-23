import { NextResponse } from 'next/server'
import { verifyCredentials, createToken } from '@/lib/auth'

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json()

        // Validar campos
        if (!username || !password) {
            return NextResponse.json(
                { error: 'Usuario y contraseña son requeridos' },
                { status: 400 }
            )
        }

        // Verificar credenciales
        const isValid = await verifyCredentials(username, password)

        if (!isValid) {
            return NextResponse.json(
                { error: 'Credenciales inválidas' },
                { status: 401 }
            )
        }

        // Crear token
        const token = createToken({ username })

        // Crear respuesta con cookie
        const response = NextResponse.json(
            { success: true, message: 'Login exitoso' },
            { status: 200 }
        )

        // Establecer cookie HTTP-only
        response.cookies.set('admin-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 días
            path: '/',
        })

        return response

    } catch (error) {
        console.error('Error en login:', error)
        return NextResponse.json(
            { error: 'Error al procesar la solicitud' },
            { status: 500 }
        )
    }
}
