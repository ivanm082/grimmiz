import { render, screen, fireEvent } from '@testing-library/react'
import DeleteModal from '../DeleteModal'

describe('DeleteModal', () => {
  const mockOnClose = jest.fn()
  const mockOnConfirm = jest.fn()
  const mockProductName = 'Test Product'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Visibility', () => {
    it('should not render when isOpen is false', () => {
      const { container } = render(
        <DeleteModal
          isOpen={false}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          productName={mockProductName}
        />
      )
      expect(container.firstChild).toBeNull()
    })

    it('should render when isOpen is true', () => {
      render(
        <DeleteModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          productName={mockProductName}
        />
      )
      expect(screen.getByText('Confirmar Eliminación')).toBeInTheDocument()
    })
  })

  describe('Content', () => {
    it('should display product name', () => {
      render(
        <DeleteModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          productName={mockProductName}
        />
      )
      expect(screen.getByText(new RegExp(mockProductName))).toBeInTheDocument()
    })

    it('should display warning message', () => {
      render(
        <DeleteModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          productName={mockProductName}
        />
      )
      expect(screen.getByText(/Esta acción no se puede deshacer/)).toBeInTheDocument()
    })

    it('should display confirmation question', () => {
      render(
        <DeleteModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          productName={mockProductName}
        />
      )
      expect(screen.getByText(/¿Estás seguro de que quieres eliminar el producto/)).toBeInTheDocument()
    })

    it('should have warning icon', () => {
      const { container } = render(
        <DeleteModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          productName={mockProductName}
        />
      )
      const warningIcon = container.querySelector('.bg-red-100')
      expect(warningIcon).toBeInTheDocument()
    })
  })

  describe('Buttons', () => {
    it('should have cancel button', () => {
      render(
        <DeleteModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          productName={mockProductName}
        />
      )
      expect(screen.getByText('Cancelar')).toBeInTheDocument()
    })

    it('should have delete button', () => {
      render(
        <DeleteModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          productName={mockProductName}
        />
      )
      expect(screen.getByText('Eliminar')).toBeInTheDocument()
    })

    it('should call onClose when clicking cancel button', () => {
      render(
        <DeleteModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          productName={mockProductName}
        />
      )
      fireEvent.click(screen.getByText('Cancelar'))
      expect(mockOnClose).toHaveBeenCalled()
    })

    it('should call onConfirm when clicking delete button', () => {
      render(
        <DeleteModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          productName={mockProductName}
        />
      )
      fireEvent.click(screen.getByText('Eliminar'))
      expect(mockOnConfirm).toHaveBeenCalled()
    })

    it('should call onClose when clicking close X button', () => {
      const { container } = render(
        <DeleteModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          productName={mockProductName}
        />
      )
      const closeButton = container.querySelector('.text-grimmiz-text-secondary.hover\\:text-grimmiz-text')
      fireEvent.click(closeButton!)
      expect(mockOnClose).toHaveBeenCalled()
    })

    it('should call onClose when clicking overlay', () => {
      const { container } = render(
        <DeleteModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          productName={mockProductName}
        />
      )
      const overlay = container.querySelector('.fixed.inset-0.bg-black\\/50')
      fireEvent.click(overlay!)
      expect(mockOnClose).toHaveBeenCalled()
    })

    it('should not close when clicking modal content', () => {
      const { container } = render(
        <DeleteModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          productName={mockProductName}
        />
      )
      const modalContent = container.querySelector('.bg-white.rounded-lg')
      fireEvent.click(modalContent!)
      expect(mockOnClose).not.toHaveBeenCalled()
    })
  })

  describe('Deleting State', () => {
    it('should show "Eliminando..." text when isDeleting is true', () => {
      render(
        <DeleteModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          productName={mockProductName}
          isDeleting={true}
        />
      )
      expect(screen.getByText('Eliminando...')).toBeInTheDocument()
    })

    it('should disable buttons when isDeleting is true', () => {
      render(
        <DeleteModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          productName={mockProductName}
          isDeleting={true}
        />
      )
      expect(screen.getByText('Cancelar')).toBeDisabled()
      expect(screen.getByText('Eliminando...')).toBeDisabled()
    })

    it('should disable close button when isDeleting is true', () => {
      const { container } = render(
        <DeleteModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          productName={mockProductName}
          isDeleting={true}
        />
      )
      const closeButton = container.querySelector('.text-grimmiz-text-secondary.hover\\:text-grimmiz-text')
      expect(closeButton).toBeDisabled()
    })

    it('should not disable buttons when isDeleting is false', () => {
      render(
        <DeleteModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          productName={mockProductName}
          isDeleting={false}
        />
      )
      expect(screen.getByText('Cancelar')).not.toBeDisabled()
      expect(screen.getByText('Eliminar')).not.toBeDisabled()
    })
  })

  describe('Styling', () => {
    it('should have red delete button', () => {
      render(
        <DeleteModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          productName={mockProductName}
        />
      )
      const deleteButton = screen.getByText('Eliminar')
      expect(deleteButton.className).toContain('bg-red-600')
    })

    it('should have warning background for message', () => {
      const { container } = render(
        <DeleteModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          productName={mockProductName}
        />
      )
      const warningBox = container.querySelector('.bg-red-50')
      expect(warningBox).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle very long product names', () => {
      const longName = 'A'.repeat(200)
      render(
        <DeleteModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          productName={longName}
        />
      )
      // Product name appears in the modal text
      expect(screen.getByText(/¿Estás seguro de que quieres eliminar el producto/)).toBeInTheDocument()
    })

    it('should handle product names with quotes', () => {
      const quotedName = 'Product Test Name'
      render(
        <DeleteModal
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          productName={quotedName}
        />
      )
      expect(screen.getByText(new RegExp(quotedName))).toBeInTheDocument()
    })
  })
})

