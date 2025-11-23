import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Proteger rutas del admin (excepto login)
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
        const token = request.cookies.get('admin-token')?.value

        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }

        const user = verifyToken(token)
        if (!user) {
            // Token inválido o expirado
            const response = NextResponse.redirect(new URL('/admin/login', request.url))
            response.cookies.delete('admin-token')
            return response
        }
    }

    // Si está en login y ya tiene token válido, redirigir al dashboard
    if (pathname === '/admin/login') {
        const token = request.cookies.get('admin-token')?.value
        if (token && verifyToken(token)) {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: '/admin/:path*',
}
