import { render, screen, fireEvent } from '@testing-library/react'
import Pagination from '../Pagination'

describe('Pagination', () => {
  const mockOnPageChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should not render when totalPages is 0', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={0} onPageChange={mockOnPageChange} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('should render page buttons', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />)
    
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('should highlight current page', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={mockOnPageChange} />)
    
    const page2Button = screen.getByText('2')
    expect(page2Button.className).toContain('bg-primary')
    expect(page2Button.className).toContain('text-white')
  })

  it('should disable previous button on first page', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />
    )
    
    const prevButton = container.querySelectorAll('button')[0]
    expect(prevButton).toBeDisabled()
  })

  it('should disable next button on last page', () => {
    const { container } = render(
      <Pagination currentPage={5} totalPages={5} onPageChange={mockOnPageChange} />
    )
    
    const buttons = container.querySelectorAll('button')
    const nextButton = buttons[buttons.length - 1]
    expect(nextButton).toBeDisabled()
  })

  it('should call onPageChange when clicking page button', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />)
    
    fireEvent.click(screen.getByText('3'))
    expect(mockOnPageChange).toHaveBeenCalledWith(3)
  })

  it('should call onPageChange when clicking previous button', () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />)
    
    const { container } = render(<Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />)
    const prevButton = container.querySelectorAll('button')[0]
    
    fireEvent.click(prevButton)
    expect(mockOnPageChange).toHaveBeenCalledWith(2)
  })

  it('should call onPageChange when clicking next button', () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />)
    
    const { container } = render(<Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />)
    const buttons = container.querySelectorAll('button')
    const nextButton = buttons[buttons.length - 1]
    
    fireEvent.click(nextButton)
    expect(mockOnPageChange).toHaveBeenCalledWith(4)
  })

  it('should show ellipsis for many pages', () => {
    render(<Pagination currentPage={5} totalPages={10} onPageChange={mockOnPageChange} />)
    expect(screen.getByText('...')).toBeInTheDocument()
  })

  it('should show first page button when not in range', () => {
    render(<Pagination currentPage={7} totalPages={10} onPageChange={mockOnPageChange} />)
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('should show last page button when not in range', () => {
    render(<Pagination currentPage={3} totalPages={10} onPageChange={mockOnPageChange} />)
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('should display results info when provided', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        totalItems={50}
        itemsPerPage={10}
      />
    )
    
    expect(screen.getByText(/Mostrando/)).toBeInTheDocument()
    expect(screen.getByText(/1/)).toBeInTheDocument()
    expect(screen.getByText(/10/)).toBeInTheDocument()
    expect(screen.getByText(/50/)).toBeInTheDocument()
  })

  it('should calculate correct results range for middle pages', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
        totalItems={50}
        itemsPerPage={10}
      />
    )
    
    expect(screen.getByText('21')).toBeInTheDocument()
    expect(screen.getByText('30')).toBeInTheDocument()
  })

  it('should not exceed total items on last page', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={mockOnPageChange}
        totalItems={47}
        itemsPerPage={10}
      />
    )
    
    expect(screen.getByText('41')).toBeInTheDocument()
    expect(screen.getByText('47')).toBeInTheDocument()
  })

  it('should render with only required props', () => {
    render(<Pagination currentPage={1} totalPages={3} onPageChange={mockOnPageChange} />)
    
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('should handle single page', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={mockOnPageChange} />
    )
    
    const buttons = container.querySelectorAll('button')
    expect(buttons[0]).toBeDisabled() // prev
    expect(buttons[buttons.length - 1]).toBeDisabled() // next
  })

  it('should show maximum 5 pages in range', () => {
    render(<Pagination currentPage={5} totalPages={20} onPageChange={mockOnPageChange} />)
    
    const buttons = Array.from(document.querySelectorAll('button'))
    const pageButtons = buttons.filter(btn => {
      const text = btn.textContent
      return text && !isNaN(Number(text))
    })
    
    // Should show: 1, ..., 3-7, ..., 20 = at most 7 page buttons
    expect(pageButtons.length).toBeLessThanOrEqual(7)
  })
})

