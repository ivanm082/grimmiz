'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false)
    const [hasMounted, setHasMounted] = useState(false)

    useEffect(() => {
        setHasMounted(true)
        // Verificar si el usuario ya ha aceptado las cookies
        const cookiesAccepted = localStorage.getItem('cookiesAccepted')
        if (!cookiesAccepted) {
            setIsVisible(true)
        }
    }, [])

    const acceptCookies = () => {
        localStorage.setItem('cookiesAccepted', 'true')
        localStorage.setItem('cookiesAcceptedDate', new Date().toISOString())
        setIsVisible(false)
        // Aquí puedes añadir código para inicializar analytics, etc.
        console.log('Cookies aceptadas - Analytics activado')
    }

    const declineCookies = () => {
        localStorage.setItem('cookiesAccepted', 'false')
        localStorage.setItem('cookiesDeclinedDate', new Date().toISOString())
        setIsVisible(false)
        // Aquí puedes deshabilitar cookies no esenciales
        console.log('Cookies rechazadas - Solo cookies técnicas activas')
    }

    // No renderizar nada hasta que se monte en el cliente
    if (!hasMounted) {
        return null
    }

    if (!isVisible) {
        return null
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                                <svg className="w-6 h-6 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-grimmiz-text mb-2">
                                    🍪 Aviso de Cookies
                                </h3>
                                <p className="text-sm text-grimmiz-text-secondary leading-relaxed">
                                    Utilizamos cookies propias y de terceros para mejorar tu experiencia de navegación,
                                    analizar el tráfico web y personalizar el contenido. Al continuar navegando,
                                    aceptas nuestro uso de cookies. Puedes obtener más información en nuestra{' '}
                                    <Link href="/politica-cookies" className="text-primary hover:text-primary-dark underline">
                                        política de cookies
                                    </Link>.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:ml-6">
                        <button
                            onClick={declineCookies}
                            className="px-4 py-2 text-sm font-medium text-grimmiz-text border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            title="Solo se usarán cookies técnicas necesarias"
                        >
                            Rechazar Cookies No Esenciales
                        </button>
                        <button
                            onClick={acceptCookies}
                            className="px-6 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors shadow-sm hover:shadow-md"
                            title="Aceptar todas las cookies para mejor experiencia"
                        >
                            Aceptar Todas las Cookies
                        </button>
                    </div>
                </div>

                {/* Información adicional (opcional) */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <details className="group">
                        <summary className="text-sm font-medium text-grimmiz-text cursor-pointer hover:text-primary transition-colors list-none">
                            <span className="flex items-center gap-2">
                                Más información sobre cookies
                                <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </span>
                        </summary>
                        <div className="mt-3 text-sm text-grimmiz-text-secondary space-y-2">
                            <p>
                                <strong>Cookies técnicas:</strong> Esenciales para el funcionamiento del sitio web.
                            </p>
                            <p>
                                <strong>Cookies de análisis:</strong> Nos ayudan a entender cómo utilizas nuestro sitio.
                            </p>
                            <p>
                                <strong>Cookies de marketing:</strong> Utilizadas para mostrarte anuncios relevantes.
                            </p>
                            <p className="text-xs">
                                Puedes cambiar tu configuración en cualquier momento desde tu navegador.
                            </p>
                        </div>
                    </details>
                </div>
            </div>
        </div>
    )
}
