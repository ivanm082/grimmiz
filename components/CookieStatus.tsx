'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieStatus() {
    const [showStatus, setShowStatus] = useState(false)
    const [cookiesDeclined, setCookiesDeclined] = useState(false)

    useEffect(() => {
        const cookiesAccepted = localStorage.getItem('cookiesAccepted')
        const declinedDate = localStorage.getItem('cookiesDeclinedDate')

        if (cookiesAccepted === 'false' && declinedDate) {
            setCookiesDeclined(true)
            // Mostrar el mensaje solo por unos segundos después de rechazar
            const timeSinceDeclined = Date.now() - new Date(declinedDate).getTime()
            if (timeSinceDeclined < 5000) { // 5 segundos
                setShowStatus(true)
                setTimeout(() => setShowStatus(false), 5000)
            }
        }
    }, [])

    if (!showStatus || !cookiesDeclined) {
        return null
    }

    return (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-lg">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-semibold text-blue-800 mb-1">
                            Cookies Limitadas
                        </h4>
                        <p className="text-xs text-blue-700 mb-2">
                            Has rechazado cookies no esenciales. Solo se usarán cookies técnicas para el funcionamiento básico.
                        </p>
                        <Link
                            href="/politica-cookies"
                            className="text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                            Más información
                        </Link>
                    </div>
                    <button
                        onClick={() => setShowStatus(false)}
                        className="flex-shrink-0 text-blue-600 hover:text-blue-800"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}
