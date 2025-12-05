import { render, screen, waitFor } from '@testing-library/react'
import TagInput from '../TagInput'

// Mock fetch
global.fetch = jest.fn()

describe('TagInput', () => {
  const mockOnChange = jest.fn()
  const mockTags = [
    { id: 1, name: 'Tag 1', slug: 'tag-1' },
    { id: 2, name: 'Tag 2', slug: 'tag-2' },
    { id: 3, name: 'Tag 3', slug: 'tag-3' },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ tags: mockTags })
    })
  })

  it('should render component', () => {
    render(<TagInput value={[]} onChange={mockOnChange} />)
    expect(screen.getByText(/Etiquetas/)).toBeInTheDocument()
  })

  it('should load tags on mount', async () => {
    render(<TagInput value={[]} onChange={mockOnChange} />)
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/admin/tags')
    }, { timeout: 1000 })
  })

  it('should render input field after loading', async () => {
    render(<TagInput value={[]} onChange={mockOnChange} />)
    
    await waitFor(() => {
      const input = screen.getByPlaceholderText(/Escribe para buscar/)
      expect(input).toBeInTheDocument()
    }, { timeout: 1000 })
  })

  it('should handle empty value array', () => {
    render(<TagInput value={[]} onChange={mockOnChange} />)
    const label = screen.getByText(/Etiquetas/)
    expect(label).toBeInTheDocument()
  })

  it('should handle productId prop', () => {
    render(<TagInput productId={123} value={[]} onChange={mockOnChange} />)
    const label = screen.getByText(/Etiquetas/)
    expect(label).toBeInTheDocument()
  })

  it('should display selected tags', async () => {
    render(<TagInput value={[1, 2]} onChange={mockOnChange} />)
    
    await waitFor(() => {
      expect(screen.getByText('Tag 1')).toBeInTheDocument()
      expect(screen.getByText('Tag 2')).toBeInTheDocument()
    }, { timeout: 1000 })
  })

  it('should show helper text', async () => {
    render(<TagInput value={[]} onChange={mockOnChange} />)
    
    await waitFor(() => {
      expect(screen.getByText(/Presiona Enter para seleccionar/)).toBeInTheDocument()
    }, { timeout: 1000 })
  })
})

