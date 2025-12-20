import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import SearchBar from '../SearchBar'

describe('SearchBar', () => {
  const mockOnSearch = jest.fn()
  const mockCategories = [
    { id: 1, name: 'Categoría 1' },
    { id: 2, name: 'Categoría 2' },
    { id: 3, name: 'Categoría 3' },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should render search input', () => {
    render(<SearchBar onSearch={mockOnSearch} categories={mockCategories} />)
    expect(screen.getByLabelText('Buscar')).toBeInTheDocument()
  })

  it('should render category select', () => {
    render(<SearchBar onSearch={mockOnSearch} categories={mockCategories} />)
    expect(screen.getByLabelText('Categoría')).toBeInTheDocument()
  })

  it('should render all categories in select', () => {
    render(<SearchBar onSearch={mockOnSearch} categories={mockCategories} />)
    
    expect(screen.getByText('Todas las categorías')).toBeInTheDocument()
    expect(screen.getByText('Categoría 1')).toBeInTheDocument()
    expect(screen.getByText('Categoría 2')).toBeInTheDocument()
    expect(screen.getByText('Categoría 3')).toBeInTheDocument()
  })

  it('should update search input value', () => {
    render(<SearchBar onSearch={mockOnSearch} categories={mockCategories} />)
    
    const searchInput = screen.getByLabelText('Buscar') as HTMLInputElement
    fireEvent.change(searchInput, { target: { value: 'test' } })
    
    expect(searchInput.value).toBe('test')
  })

  it('should debounce search', async () => {
    render(<SearchBar onSearch={mockOnSearch} categories={mockCategories} />)
    
    const searchInput = screen.getByLabelText('Buscar')
    
    act(() => {
      fireEvent.change(searchInput, { target: { value: 'test' } })
    })
    
    // Should not call immediately
    expect(mockOnSearch).toHaveBeenCalledTimes(1) // Only initial call
    
    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(500)
    })
    
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('test', '')
    })
  })

  it('should change category filter', () => {
    render(<SearchBar onSearch={mockOnSearch} categories={mockCategories} />)
    
    const categorySelect = screen.getByLabelText('Categoría') as HTMLSelectElement
    fireEvent.change(categorySelect, { target: { value: '1' } })
    
    expect(categorySelect.value).toBe('1')
  })

  it('should call onSearch when category changes', async () => {
    render(<SearchBar onSearch={mockOnSearch} categories={mockCategories} />)
    
    const categorySelect = screen.getByLabelText('Categoría')
    fireEvent.change(categorySelect, { target: { value: '1' } })
    
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('', '1')
    })
  })

  it('should show clear button when search has value', () => {
    render(<SearchBar onSearch={mockOnSearch} categories={mockCategories} />)
    
    const searchInput = screen.getByLabelText('Buscar')
    fireEvent.change(searchInput, { target: { value: 'test' } })
    
    expect(screen.getByText('Limpiar filtros')).toBeInTheDocument()
  })

  it('should show clear button when category is selected', () => {
    render(<SearchBar onSearch={mockOnSearch} categories={mockCategories} />)
    
    const categorySelect = screen.getByLabelText('Categoría')
    fireEvent.change(categorySelect, { target: { value: '1' } })
    
    expect(screen.getByText('Limpiar filtros')).toBeInTheDocument()
  })

  it('should not show clear button initially', () => {
    render(<SearchBar onSearch={mockOnSearch} categories={mockCategories} />)
    expect(screen.queryByText('Limpiar filtros')).not.toBeInTheDocument()
  })

  it('should clear filters when clicking clear button', async () => {
    render(<SearchBar onSearch={mockOnSearch} categories={mockCategories} />)
    
    const searchInput = screen.getByLabelText('Buscar') as HTMLInputElement
    const categorySelect = screen.getByLabelText('Categoría') as HTMLSelectElement
    
    fireEvent.change(searchInput, { target: { value: 'test' } })
    fireEvent.change(categorySelect, { target: { value: '1' } })
    
    const clearButton = screen.getByText('Limpiar filtros')
    fireEvent.click(clearButton)
    
    expect(searchInput.value).toBe('')
    expect(categorySelect.value).toBe('')
  })

  it('should use initial search value', () => {
    render(
      <SearchBar
        onSearch={mockOnSearch}
        categories={mockCategories}
        initialSearch="initial search"
      />
    )
    
    const searchInput = screen.getByLabelText('Buscar') as HTMLInputElement
    expect(searchInput.value).toBe('initial search')
  })

  it('should use initial category value', () => {
    render(
      <SearchBar
        onSearch={mockOnSearch}
        categories={mockCategories}
        initialCategoryId="2"
      />
    )
    
    const categorySelect = screen.getByLabelText('Categoría') as HTMLSelectElement
    expect(categorySelect.value).toBe('2')
  })

  it('should have search icon', () => {
    const { container } = render(<SearchBar onSearch={mockOnSearch} categories={mockCategories} />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('should handle empty categories array', () => {
    render(<SearchBar onSearch={mockOnSearch} categories={[]} />)
    expect(screen.getByText('Todas las categorías')).toBeInTheDocument()
  })
})




