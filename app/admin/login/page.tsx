'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })
    const [errors, setErrors] = useState({
        username: '',
        password: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [loginError, setLoginError] = useState('')

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        // Validar campos
        const newErrors = {
            username: '',
            password: ''
        }

        if (!formData.username.trim()) {
            newErrors.username = 'El usuario es obligatorio'
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es obligatoria'
        }

        setErrors(newErrors)

        if (newErrors.username || newErrors.password) {
            return
        }

        setIsSubmitting(true)
        setLoginError('')

        try {
            const response = await fetch('/api/admin/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al iniciar sesión')
            }

            // Redirigir al dashboard
            router.push('/admin/dashboard')
        } catch (error: any) {
            console.error('Error logging in:', error)
            setLoginError(error.message || 'Error al iniciar sesión')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        setErrors(prev => ({ ...prev, [field]: '' }))
        setLoginError('')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary via-primary/95 to-primary-dark flex items-center justify-center p-4">
            {/* Estrellas decorativas */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full opacity-80 animate-pulse"></div>
                <div className="absolute top-20 right-20 w-1.5 h-1.5 bg-white rounded-full opacity-60"></div>
                <div className="absolute top-32 left-1/4 w-1 h-1 bg-white rounded-full opacity-70 animate-pulse"></div>
                <div className="absolute bottom-20 right-1/4 w-2 h-2 bg-white rounded-full opacity-80"></div>
                <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-white rounded-full opacity-60 animate-pulse"></div>
                <div className="absolute top-1/2 right-10 w-1 h-1 bg-white rounded-full opacity-70"></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Grimmiz Admin</h1>
                    <p className="text-white/80">Panel de administración</p>
                </div>

                {/* Login form */}
                <div className="bg-white rounded-lg shadow-2xl p-8">
                    <h2 className="text-2xl font-bold text-grimmiz-text mb-6">Iniciar Sesión</h2>

                    {loginError && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-800 text-sm">{loginError}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Usuario */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-semibold text-grimmiz-text mb-2">
                                Usuario
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={formData.username}
                                onChange={(e) => handleChange('username', e.target.value)}
                                placeholder="Ingresa tu usuario"
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.username
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 focus:ring-primary focus:border-primary'
                                    }`}
                                autoComplete="username"
                            />
                            {errors.username && (
                                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                            )}
                        </div>

                        {/* Contraseña */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-grimmiz-text mb-2">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={formData.password}
                                onChange={(e) => handleChange('password', e.target.value)}
                                placeholder="Ingresa tu contraseña"
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.password
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 focus:ring-primary focus:border-primary'
                                    }`}
                                autoComplete="current-password"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                            )}
                        </div>

                        {/* Botón */}
                        <button
                            type="submit"
                            className="w-full px-6 py-3 bg-secondary text-white rounded-lg font-semibold hover:bg-secondary-dark transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>
                    </form>
                </div>

                {/* Link a la tienda */}
                <div className="text-center mt-6">
                    <a
                        href="/"
                        className="text-white hover:text-secondary transition-colors text-sm"
                    >
                        ← Volver a la tienda
                    </a>
                </div>
            </div>
        </div>
    )
}
