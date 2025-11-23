import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Proteger rutas del admin (excepto login)
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
        const token = request.cookies.get('admin-token')?.value

        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }

        // En Edge Runtime no podemos verificar JWT, así que solo verificamos que exista
        // La verificación real se hace en las API routes
    }

    // Si está en login y ya tiene token, redirigir al dashboard
    if (pathname === '/admin/login') {
        const token = request.cookies.get('admin-token')?.value
        if (token) {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: '/admin/:path*',
}
