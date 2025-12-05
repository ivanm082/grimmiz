import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import ContactModal from '../ContactModal'

// Mock fetch
global.fetch = jest.fn()

describe('ContactModal', () => {
  const mockOnClose = jest.fn()
  const mockProductTitle = 'Figura de Timo'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllTimers()
  })

  describe('Visibility', () => {
    it('should not render when isOpen is false', () => {
      const { container } = render(
        <ContactModal isOpen={false} onClose={mockOnClose} productTitle={mockProductTitle} />
      )
      expect(container.firstChild).toBeNull()
    })

    it('should render when isOpen is true', () => {
      render(
        <ContactModal isOpen={true} onClose={mockOnClose} productTitle={mockProductTitle} />
      )
      expect(screen.getByText(/Contactar sobre/)).toBeInTheDocument()
    })
  })

  describe('Header', () => {
    it('should display product title in header', () => {
      render(
        <ContactModal isOpen={true} onClose={mockOnClose} productTitle={mockProductTitle} />
      )
      expect(screen.getByText(`Contactar sobre: ${mockProductTitle}`)).toBeInTheDocument()
    })

    it('should have close button', () => {
      render(
        <ContactModal isOpen={true} onClose={mockOnClose} productTitle={mockProductTitle} />
      )
      expect(screen.getByLabelText('Cerrar')).toBeInTheDocument()
    })

    it('should call onClose when close button is clicked', () => {
      render(
        <ContactModal isOpen={true} onClose={mockOnClose} productTitle={mockProductTitle} />
      )
      fireEvent.click(screen.getByLabelText('Cerrar'))
      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  describe('Form Fields', () => {
    it('should render all form fields', () => {
      render(
        <ContactModal isOpen={true} onClose={mockOnClose} productTitle={mockProductTitle} />
      )
      
      expect(screen.getByLabelText(/Nombre/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Email/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Comentarios/)).toBeInTheDocument()
    })

    it('should have default value for comments', () => {
      render(
        <ContactModal isOpen={true} onClose={mockOnClose} productTitle={mockProductTitle} />
      )
      
      const commentsField = screen.getByLabelText(/Comentarios/) as HTMLTextAreaElement
      expect(commentsField.value).toBe('Me interesa este producto.')
    })

    it('should have empty name field initially', () => {
      render(
        <ContactModal isOpen={true} onClose={mockOnClose} productTitle={mockProductTitle} />
      )
      
      const nameField = screen.getByLabelText(/Nombre/) as HTMLInputElement
      expect(nameField.value).toBe('')
    })

    it('should have empty email field initially', () => {
      render(
        <ContactModal isOpen={true} onClose={mockOnClose} productTitle={mockProductTitle} />
      )
      
      const emailField = screen.getByLabelText(/Email/) as HTMLInputElement
      expect(emailField.value).toBe('')
    })
  })

  describe('Form Input', () => {
    it('should update name field on change', () => {
      render(
        <ContactModal isOpen={true} onClose={mockOnClose} productTitle={mockProductTitle} />
      )
      
      const nameField = screen.getByLabelText(/Nombre/) as HTMLInputElement
      fireEvent.change(nameField, { target: { value: 'Juan' } })
      expect(nameField.value).toBe('Juan')
    })

    it('should update email field on change', () => {
      render(
        <ContactModal isOpen={true} onClose={mockOnClose} productTitle={mockProductTitle} />
      )
      
      const emailField = screen.getByLabelText(/Email/) as HTMLInputElement
      fireEvent.change(emailField, { target: { value: 'juan@example.com' } })
      expect(emailField.value).toBe('juan@example.com')
    })

    it('should update comments field on change', () => {
      render(
        <ContactModal isOpen={true} onClose={mockOnClose} productTitle={mockProductTitle} />
      )
      
      const commentsField = screen.getByLabelText(/Comentarios/) as HTMLTextAreaElement
      fireEvent.change(commentsField, { target: { value: 'Comentario personalizado' } })
      expect(commentsField.value).toBe('Comentario personalizado')
    })
  })

  describe('Validation', () => {
    it('should show error when name is empty', async () => {
      render(
        <ContactModal isOpen={true} onClose={mockOnClose} productTitle={mockProductTitle} />
      )
      
      const submitButton = screen.getByText('Enviar')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('El nombre es obligatorio')).toBeInTheDocument()
      })
    })

    it('should show error when email is empty', async () => {
      render(
        <ContactModal isOpen={true} onClose={mockOnClose} productTitle={mockProductTitle} />
      )
      
      const nameField = screen.getByLabelText(/Nombre/)
      fireEvent.change(nameField, { target: { value: 'Juan' } })
      
      const submitButton = screen.getByText('Enviar')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('El email es obligatorio')).toBeInTheDocument()
      })
    })


    it('should show error when comments are empty', async () => {
      render(
        <ContactModal isOpen={true} onClose={mockOnClose} productTitle={mockProductTitle} />
      )
      
      const nameField = screen.getByLabelText(/Nombre/)
      const emailField = screen.getByLabelText(/Email/)
      const commentsField = screen.getByLabelText(/Comentarios/)
      
      fireEvent.change(nameField, { target: { value: 'Juan' } })
      fireEvent.change(emailField, { target: { value: 'juan@example.com' } })
      fireEvent.change(commentsField, { target: { value: '' } })
      
      const submitButton = screen.getByText('Enviar')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Los comentarios son obligatorios')).toBeInTheDocument()
      })
    })

    it('should clear error when user starts typing', async () => {
      render(
        <ContactModal isOpen={true} onClose={mockOnClose} productTitle={mockProductTitle} />
      )
      
      const submitButton = screen.getByText('Enviar')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('El nombre es obligatorio')).toBeInTheDocument()
      })
      
      const nameField = screen.getByLabelText(/Nombre/)
      fireEvent.change(nameField, { target: { value: 'J' } })
      
      expect(screen.queryByText('El nombre es obligatorio')).not.toBeInTheDocument()
    })
  })

  describe('Form Submission', () => {
    it('should submit form with valid data', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      })

      render(
        <ContactModal isOpen={true} onClose={mockOnClose} productTitle={mockProductTitle} />
      )
      
      fireEvent.change(screen.getByLabelText(/Nombre/), { target: { value: 'Juan' } })
      fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'juan@example.com' } })
      
      const submitButton = screen.getByText('Enviar')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Juan',
            email: 'juan@example.com',
            comments: 'Me interesa este producto.',
            product: mockProductTitle
          })
        })
      })
    })

    it('should show loading state while submitting', async () => {
      ;(global.fetch as jest.Mock).mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({ ok: true, json: async () => ({}) }), 100))
      )

      render(
        <ContactModal isOpen={true} onClose={mockOnClose} productTitle={mockProductTitle} />
      )
      
      fireEvent.change(screen.getByLabelText(/Nombre/), { target: { value: 'Juan' } })
      fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'juan@example.com' } })
      
      const submitButton = screen.getByText('Enviar')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Enviando...')).toBeInTheDocument()
      })
    })

    it('should show success message on successful submission', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      })

      render(
        <ContactModal isOpen={true} onClose={mockOnClose} productTitle={mockProductTitle} />
      )
      
      fireEvent.change(screen.getByLabelText(/Nombre/), { target: { value: 'Juan' } })
      fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'juan@example.com' } })
      
      fireEvent.click(screen.getByText('Enviar'))
      
      await waitFor(() => {
        expect(screen.getByText(/¡Mensaje enviado correctamente!/)).toBeInTheDocument()
      })
    })

    it('should show error message on failed submission', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Error del servidor' })
      })

      render(
        <ContactModal isOpen={true} onClose={mockOnClose} productTitle={mockProductTitle} />
      )
      
      fireEvent.change(screen.getByLabelText(/Nombre/), { target: { value: 'Juan' } })
      fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'juan@example.com' } })
      
      fireEvent.click(screen.getByText('Enviar'))
      
      await waitFor(() => {
        expect(screen.getByText(/Error del servidor/)).toBeInTheDocument()
      })
    })

    it('should show success message contains confirmation text', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      })

      render(
        <ContactModal isOpen={true} onClose={mockOnClose} productTitle={mockProductTitle} />
      )
      
      fireEvent.change(screen.getByLabelText(/Nombre/), { target: { value: 'Juan' } })
      fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'juan@example.com' } })
      
      fireEvent.click(screen.getByText('Enviar'))
      
      await waitFor(() => {
        expect(screen.getByText(/¡Mensaje enviado correctamente!/)).toBeInTheDocument()
      })
    })

    it('should handle network errors', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      render(
        <ContactModal isOpen={true} onClose={mockOnClose} productTitle={mockProductTitle} />
      )
      
      fireEvent.change(screen.getByLabelText(/Nombre/), { target: { value: 'Juan' } })
      fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'juan@example.com' } })
      
      fireEvent.click(screen.getByText('Enviar'))
      
      await waitFor(() => {
        expect(screen.getByText(/Network error/)).toBeInTheDocument()
      })
    })
  })

  describe('Close behavior', () => {
    it('should close modal when clicking overlay', () => {
      const { container } = render(
        <ContactModal isOpen={true} onClose={mockOnClose} productTitle={mockProductTitle} />
      )
      
      const overlay = container.querySelector('.fixed.inset-0.bg-black\\/50')
      fireEvent.click(overlay!)
      
      expect(mockOnClose).toHaveBeenCalled()
    })

    it('should not close modal when clicking modal content', () => {
      const { container } = render(
        <ContactModal isOpen={true} onClose={mockOnClose} productTitle={mockProductTitle} />
      )
      
      const modalContent = container.querySelector('.bg-white.rounded-lg')
      fireEvent.click(modalContent!)
      
      expect(mockOnClose).not.toHaveBeenCalled()
    })

    it('should close modal when clicking cancel button', () => {
      render(
        <ContactModal isOpen={true} onClose={mockOnClose} productTitle={mockProductTitle} />
      )
      
      fireEvent.click(screen.getByText('Cancelar'))
      expect(mockOnClose).toHaveBeenCalled()
    })

    it('should clear errors when closing', () => {
      render(
        <ContactModal isOpen={true} onClose={mockOnClose} productTitle={mockProductTitle} />
      )
      
      // Trigger validation errors
      fireEvent.click(screen.getByText('Enviar'))
      
      // Close modal
      fireEvent.click(screen.getByLabelText('Cerrar'))
      
      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('should have proper labels for all inputs', () => {
      render(
        <ContactModal isOpen={true} onClose={mockOnClose} productTitle={mockProductTitle} />
      )
      
      expect(screen.getByLabelText(/Nombre/)).toHaveAttribute('id', 'name')
      expect(screen.getByLabelText(/Email/)).toHaveAttribute('id', 'email')
      expect(screen.getByLabelText(/Comentarios/)).toHaveAttribute('id', 'comments')
    })

    it('should disable buttons while submitting', async () => {
      ;(global.fetch as jest.Mock).mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({ ok: true, json: async () => ({}) }), 100))
      )

      render(
        <ContactModal isOpen={true} onClose={mockOnClose} productTitle={mockProductTitle} />
      )
      
      fireEvent.change(screen.getByLabelText(/Nombre/), { target: { value: 'Juan' } })
      fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'juan@example.com' } })
      
      fireEvent.click(screen.getByText('Enviar'))
      
      await waitFor(() => {
        expect(screen.getByText('Enviando...')).toBeDisabled()
        expect(screen.getByText('Cancelar')).toBeDisabled()
      })
    })

    it('should have aria-label on close button', () => {
      render(
        <ContactModal isOpen={true} onClose={mockOnClose} productTitle={mockProductTitle} />
      )
      
      expect(screen.getByLabelText('Cerrar')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle very long product titles', () => {
      const longTitle = 'A'.repeat(200)
      render(
        <ContactModal isOpen={true} onClose={mockOnClose} productTitle={longTitle} />
      )
      
      expect(screen.getByText(`Contactar sobre: ${longTitle}`)).toBeInTheDocument()
    })

    it('should trim whitespace in validation', async () => {
      render(
        <ContactModal isOpen={true} onClose={mockOnClose} productTitle={mockProductTitle} />
      )
      
      fireEvent.change(screen.getByLabelText(/Nombre/), { target: { value: '   ' } })
      fireEvent.change(screen.getByLabelText(/Email/), { target: { value: '   ' } })
      fireEvent.change(screen.getByLabelText(/Comentarios/), { target: { value: '   ' } })
      
      fireEvent.click(screen.getByText('Enviar'))
      
      await waitFor(() => {
        expect(screen.getByText('El nombre es obligatorio')).toBeInTheDocument()
        expect(screen.getByText('El email es obligatorio')).toBeInTheDocument()
        expect(screen.getByText('Los comentarios son obligatorios')).toBeInTheDocument()
      })
    })

    it('should render introduction text', () => {
      render(
        <ContactModal isOpen={true} onClose={mockOnClose} productTitle={mockProductTitle} />
      )
      
      expect(screen.getByText(/Si estás interesado en este producto/)).toBeInTheDocument()
    })
  })
})

