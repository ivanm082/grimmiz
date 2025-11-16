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

    // Aquí iría la lógica para enviar el formulario
    setIsSubmitting(true)
    
    try {
      // TODO: Implementar envío del formulario
      console.log('Formulario enviado:', {
        ...formData,
        product: productTitle
      })
      
      // Simular envío
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Cerrar modal y resetear formulario
      alert('¡Mensaje enviado correctamente! Te contactaré pronto.')
      setFormData({
        name: '',
        email: '',
        comments: 'Me interesa este producto.'
      })
      onClose()
    } catch (error) {
      alert('Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Limpiar error del campo al escribir
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
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
              onClick={onClose}
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
                  onClick={onClose}
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

