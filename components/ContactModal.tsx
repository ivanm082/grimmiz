'use client'

import { useState, FormEvent } from 'react'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  productTitle: string
}

export default function ContactModal({ isOpen, onClose, productTitle }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    comments: 'Me interesa este producto.'
  })
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    comments: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  if (!isOpen) return null

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
      comments: ''
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

    // Validar comentarios
    if (!formData.comments.trim()) {
      newErrors.comments = 'Los comentarios son obligatorios'
    }

    setErrors(newErrors)

    // Si hay errores, no enviar
    if (newErrors.name || newErrors.email || newErrors.comments) {
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
          ...formData,
          product: productTitle
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar el mensaje')
      }

      // Mostrar mensaje de éxito
      setSubmitStatus({
        type: 'success',
        message: '¡Mensaje enviado correctamente! Me pondré en contacto contigo lo antes posible a través del email que proporcionaste. ¡Gracias!'
      })

      // Resetear formulario después de 3 segundos
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          comments: 'Me interesa este producto.'
        })
        setSubmitStatus({ type: null, message: '' })
        onClose()
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

  const handleClose = () => {
    // Limpiar estado al cerrar
    setSubmitStatus({ type: null, message: '' })
    setErrors({ name: '', email: '', comments: '' })
    onClose()
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-lg shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-grimmiz-text">
              Contactar sobre: {productTitle}
            </h2>
            <button
              onClick={handleClose}
              className="text-grimmiz-text-secondary hover:text-grimmiz-text transition-colors"
              aria-label="Cerrar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-grimmiz-text-secondary mb-6 leading-relaxed">
              Si estás interesado en este producto, contacta conmigo indicando la cantidad 
              y cualquier detalle que consideres relevante, y me pondré en contacto contigo 
              cuanto antes. ✨
            </p>

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
                  placeholder="Tu email"
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

              {/* Comentarios */}
              <div>
                <label htmlFor="comments" className="block text-sm font-semibold text-grimmiz-text mb-2">
                  Comentarios *
                </label>
                <textarea
                  id="comments"
                  value={formData.comments}
                  onChange={(e) => handleChange('comments', e.target.value)}
                  rows={5}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors resize-none ${
                    errors.comments 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-primary focus:border-primary'
                  }`}
                />
                {errors.comments && (
                  <p className="text-red-500 text-sm mt-1">{errors.comments}</p>
                )}
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-grimmiz-text rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-secondary text-white rounded-lg font-semibold hover:bg-secondary-dark transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

