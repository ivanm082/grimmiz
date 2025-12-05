import { render, screen, fireEvent } from '@testing-library/react'
import AdoptButton from '../AdoptButton'

// Mock del componente ContactModal
jest.mock('../ContactModal', () => {
  return function MockContactModal({ isOpen, onClose, productTitle }: any) {
    if (!isOpen) return null
    return (
      <div data-testid="contact-modal">
        <div>Modal for: {productTitle}</div>
        <button onClick={onClose}>Close</button>
      </div>
    )
  }
})

describe('AdoptButton', () => {
  it('should render the button with correct text', () => {
    render(<AdoptButton productTitle="Test Product" />)
    expect(screen.getByText('Adopta este Grimmiz')).toBeInTheDocument()
  })

  it('should not show modal initially', () => {
    render(<AdoptButton productTitle="Test Product" />)
    expect(screen.queryByTestId('contact-modal')).not.toBeInTheDocument()
  })

  it('should open modal when button is clicked', () => {
    render(<AdoptButton productTitle="Test Product" />)
    
    const button = screen.getByText('Adopta este Grimmiz')
    fireEvent.click(button)
    
    expect(screen.getByTestId('contact-modal')).toBeInTheDocument()
  })

  it('should pass product title to modal', () => {
    render(<AdoptButton productTitle="Figura de Timo" />)
    
    const button = screen.getByText('Adopta este Grimmiz')
    fireEvent.click(button)
    
    expect(screen.getByText('Modal for: Figura de Timo')).toBeInTheDocument()
  })

  it('should close modal when close is triggered', () => {
    render(<AdoptButton productTitle="Test Product" />)
    
    // Abrir modal
    const button = screen.getByText('Adopta este Grimmiz')
    fireEvent.click(button)
    expect(screen.getByTestId('contact-modal')).toBeInTheDocument()
    
    // Cerrar modal
    const closeButton = screen.getByText('Close')
    fireEvent.click(closeButton)
    expect(screen.queryByTestId('contact-modal')).not.toBeInTheDocument()
  })

  it('should have correct button styling classes', () => {
    render(<AdoptButton productTitle="Test Product" />)
    const button = screen.getByText('Adopta este Grimmiz')
    
    expect(button.className).toContain('bg-secondary')
    expect(button.className).toContain('text-white')
    expect(button.className).toContain('hover:bg-secondary-dark')
  })

  it('should be a responsive width button', () => {
    render(<AdoptButton productTitle="Test Product" />)
    const button = screen.getByText('Adopta este Grimmiz')
    
    expect(button.className).toContain('w-full')
    expect(button.className).toContain('md:w-auto')
  })

  it('should have shadow effects', () => {
    render(<AdoptButton productTitle="Test Product" />)
    const button = screen.getByText('Adopta este Grimmiz')
    
    expect(button.className).toContain('shadow-lg')
    expect(button.className).toContain('hover:shadow-xl')
  })

  it('should handle multiple clicks', () => {
    render(<AdoptButton productTitle="Test Product" />)
    const button = screen.getByText('Adopta este Grimmiz')
    
    // Abrir
    fireEvent.click(button)
    expect(screen.getByTestId('contact-modal')).toBeInTheDocument()
    
    // Cerrar
    fireEvent.click(screen.getByText('Close'))
    expect(screen.queryByTestId('contact-modal')).not.toBeInTheDocument()
    
    // Abrir de nuevo
    fireEvent.click(button)
    expect(screen.getByTestId('contact-modal')).toBeInTheDocument()
  })

  it('should handle product titles with special characters', () => {
    render(<AdoptButton productTitle="Figura de Timo & Pumba - Edición Especial" />)
    
    const button = screen.getByText('Adopta este Grimmiz')
    fireEvent.click(button)
    
    expect(screen.getByText(/Figura de Timo & Pumba/)).toBeInTheDocument()
  })

  it('should handle empty product title', () => {
    render(<AdoptButton productTitle="" />)
    
    const button = screen.getByText('Adopta este Grimmiz')
    expect(button).toBeInTheDocument()
  })

  it('should handle very long product titles', () => {
    const longTitle = 'A'.repeat(200)
    render(<AdoptButton productTitle={longTitle} />)
    
    const button = screen.getByText('Adopta este Grimmiz')
    fireEvent.click(button)
    
    expect(screen.getByTestId('contact-modal')).toBeInTheDocument()
  })
})

