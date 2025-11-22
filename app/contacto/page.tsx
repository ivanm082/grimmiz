'use client'

import { useState, FormEvent } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Resetear errores
    const newErrors = {
      name: '',
      email: '',
      subject: '',
      message: ''
    }

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio'
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Por favor, introduce un email válido'
    }

    // Validar asunto
    if (!formData.subject.trim()) {
      newErrors.subject = 'El asunto es obligatorio'
    }

    // Validar mensaje
    if (!formData.message.trim()) {
      newErrors.message = 'El mensaje es obligatorio'
    }

    setErrors(newErrors)

    // Si hay errores, no enviar
    if (newErrors.name || newErrors.email || newErrors.subject || newErrors.message) {
      return
    }

    // Enviar el formulario a la API
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          comments: `${formData.subject}\n\n${formData.message}`,
          product: 'Consulta general'
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar el mensaje')
      }

      // Mostrar mensaje de éxito
      setSubmitStatus({
        type: 'success',
        message: '¡Mensaje enviado correctamente! Me pondré en contacto contigo lo antes posible. ¡Gracias!'
      })

      // Resetear formulario después de 3 segundos
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        })
        setSubmitStatus({ type: null, message: '' })
      }, 4000)
    } catch (error: any) {
      console.error('Error al enviar el formulario:', error)
      setSubmitStatus({
        type: 'error',
        message: error.message || 'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Limpiar error del campo al escribir
    setErrors(prev => ({ ...prev, [field]: '' }))
    // Limpiar mensaje de estado si hay alguno
    if (submitStatus.type) {
      setSubmitStatus({ type: null, message: '' })
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary via-primary/95 to-primary-dark text-white py-16 overflow-hidden">
          {/* Estrellas decorativas */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full opacity-80 animate-pulse"></div>
            <div className="absolute top-20 right-20 w-1.5 h-1.5 bg-white rounded-full opacity-60"></div>
            <div className="absolute top-32 left-1/4 w-1 h-1 bg-white rounded-full opacity-70 animate-pulse"></div>
            <div className="absolute bottom-20 right-1/4 w-2 h-2 bg-white rounded-full opacity-80"></div>
            <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-white rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute top-1/2 right-10 w-1 h-1 bg-white rounded-full opacity-70"></div>
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Contacta con <span className="text-secondary">Grimmiz</span>
            </h1>
            <p className="text-xl md:text-2xl font-light">
              ¿Tienes alguna pregunta? Estoy aquí para ayudarte ✨
            </p>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Contact Info */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-grimmiz-text mb-6">
                    Información de Contacto
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Email */}
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-grimmiz-text">Email</h3>
                        <p className="text-grimmiz-text-secondary mt-1">
                          Escríbeme y te responderé lo antes posible
                        </p>
                      </div>
                    </div>

                    {/* Response Time */}
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-grimmiz-text">Tiempo de Respuesta</h3>
                        <p className="text-grimmiz-text-secondary mt-1">
                          Normalmente respondo en menos de 24 horas
                        </p>
                      </div>
                    </div>

                    {/* Social Media */}
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.053 1.281-.072 1.689-.072 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-grimmiz-text">Redes Sociales</h3>
                        <p className="text-grimmiz-text-secondary mt-1">
                          Sígueme en redes para ver mis últimas creaciones
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Decorative element */}
                  <div className="mt-8 p-6 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border-l-4 border-secondary">
                    <p className="text-grimmiz-text font-medium">
                      💡 ¿Interesado en un producto específico?
                    </p>
                    <p className="text-grimmiz-text-secondary text-sm mt-2">
                      Puedes contactarme directamente desde la página del producto para consultas más específicas.
                    </p>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-grimmiz-text mb-6">
                    Envíame un Mensaje
                  </h2>

                  {/* Mensaje de éxito/error */}
                  {submitStatus.type && (
                    <div className={`p-4 rounded-lg mb-6 ${
                      submitStatus.type === 'success' 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-red-50 border border-red-200'
                    }`}>
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          {submitStatus.type === 'success' ? (
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div className="ml-3">
                          <p className={`text-sm font-medium ${
                            submitStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
                          }`}>
                            {submitStatus.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Nombre */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-grimmiz-text mb-2">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Tu nombre"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                          errors.name 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-primary focus:border-primary'
                        }`}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-grimmiz-text mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="tu@email.com"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                          errors.email 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-primary focus:border-primary'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    {/* Asunto */}
                    <div>
                      <label htmlFor="subject" className="block text-sm font-semibold text-grimmiz-text mb-2">
                        Asunto *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleChange('subject', e.target.value)}
                        placeholder="¿Sobre qué quieres hablar?"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                          errors.subject 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-primary focus:border-primary'
                        }`}
                      />
                      {errors.subject && (
                        <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                      )}
                    </div>

                    {/* Mensaje */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-grimmiz-text mb-2">
                        Mensaje *
                      </label>
                      <textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleChange('message', e.target.value)}
                        rows={6}
                        placeholder="Cuéntame en qué puedo ayudarte..."
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors resize-none ${
                          errors.message 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-primary focus:border-primary'
                        }`}
                      />
                      {errors.message && (
                        <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                      )}
                    </div>

                    {/* Botón de envío */}
                    <button
                      type="submit"
                      className="w-full px-6 py-3 bg-secondary text-white rounded-lg font-semibold hover:bg-secondary-dark transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                    </button>
                  </form>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-grimmiz-text mb-6 text-center">
                  Preguntas Frecuentes
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-grimmiz-text mb-2 flex items-center">
                      <span className="text-secondary mr-2">❓</span>
                      ¿Hacéis envíos?
                    </h3>
                    <p className="text-grimmiz-text-secondary text-sm">
                      Sí, realizo envíos a toda España. Los gastos de envío se calculan según el destino y el tamaño del pedido.
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-grimmiz-text mb-2 flex items-center">
                      <span className="text-secondary mr-2">🎨</span>
                      ¿Aceptáis pedidos personalizados?
                    </h3>
                    <p className="text-grimmiz-text-secondary text-sm">
                      ¡Por supuesto! Me encanta crear piezas únicas y personalizadas. Contáctame para hablar sobre tu idea.
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-grimmiz-text mb-2 flex items-center">
                      <span className="text-secondary mr-2">⏱️</span>
                      ¿Cuánto tarda un pedido personalizado?
                    </h3>
                    <p className="text-grimmiz-text-secondary text-sm">
                      Depende de la complejidad del proyecto. Normalmente entre 1-3 semanas. Te daré un plazo estimado al confirmar el pedido.
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-grimmiz-text mb-2 flex items-center">
                      <span className="text-secondary mr-2">💳</span>
                      ¿Qué métodos de pago aceptáis?
                    </h3>
                    <p className="text-grimmiz-text-secondary text-sm">
                      Acepto transferencia bancaria y Bizum. Para pedidos personalizados, solicito un adelanto del 50%.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
