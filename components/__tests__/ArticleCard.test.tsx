import { render, screen } from '@testing-library/react'
import ArticleCard from '../ArticleCard'

describe('ArticleCard', () => {
  const mockArticle = {
    id: '1',
    title: 'Cómo empezar en el mundo de las manualidades',
    excerpt: 'Descubre los primeros pasos para adentrarte en el fascinante mundo de las manualidades.',
    date: '15 de marzo, 2024',
    image: '/article1.jpg'
  }

  it('should render article title', () => {
    render(<ArticleCard {...mockArticle} />)
    expect(screen.getByText(mockArticle.title)).toBeInTheDocument()
  })

  it('should render article excerpt', () => {
    render(<ArticleCard {...mockArticle} />)
    expect(screen.getByText(mockArticle.excerpt)).toBeInTheDocument()
  })

  it('should render article date', () => {
    render(<ArticleCard {...mockArticle} />)
    expect(screen.getByText(mockArticle.date)).toBeInTheDocument()
  })

  it('should render article icon emoji when image provided', () => {
    const { container } = render(<ArticleCard {...mockArticle} />)
    expect(container.textContent).toContain('📝')
  })

  it('should render with all required props', () => {
    const { container } = render(<ArticleCard {...mockArticle} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should have proper link structure', () => {
    const { container } = render(<ArticleCard {...mockArticle} />)
    const link = container.querySelector('a')
    expect(link).toBeInTheDocument()
  })

  it('should generate correct link URL from title', () => {
    const { container } = render(<ArticleCard {...mockArticle} />)
    const link = container.querySelector('a')
    expect(link).toHaveAttribute('href', '/diario-grimmiz/cómo-empezar-en-el-mundo-de-las-manualidades')
  })

  it('should have hover effects class', () => {
    const { container } = render(<ArticleCard {...mockArticle} />)
    const card = container.querySelector('.hover\\:shadow-xl')
    expect(card).toBeInTheDocument()
  })

  it('should truncate long excerpts with line-clamp', () => {
    const { container } = render(<ArticleCard {...mockArticle} />)
    const excerpt = container.querySelector('.line-clamp-3')
    expect(excerpt).toBeInTheDocument()
  })

  it('should render article icon when no image provided', () => {
    const articleWithoutImage = { ...mockArticle, image: '' }
    const { container } = render(<ArticleCard {...articleWithoutImage} />)
    expect(container.textContent).toContain('📝')
  })

  it('should have correct text hierarchy', () => {
    render(<ArticleCard {...mockArticle} />)
    const title = screen.getByText(mockArticle.title)
    expect(title.className).toContain('font-semibold')
  })

  it('should handle articles with very long titles', () => {
    const longTitleArticle = {
      ...mockArticle,
      title: 'Este es un título extremadamente largo que debería truncarse apropiadamente'
    }
    const { container } = render(<ArticleCard {...longTitleArticle} />)
    const titleElement = container.querySelector('.line-clamp-2')
    expect(titleElement).toBeInTheDocument()
  })

  it('should handle articles with short excerpts', () => {
    const shortExcerptArticle = {
      ...mockArticle,
      excerpt: 'Corto'
    }
    render(<ArticleCard {...shortExcerptArticle} />)
    expect(screen.getByText('Corto')).toBeInTheDocument()
  })

  it('should have article semantic element', () => {
    const { container } = render(<ArticleCard {...mockArticle} />)
    const article = container.querySelector('article')
    expect(article).toBeInTheDocument()
  })

  it('should have rounded corners', () => {
    const { container } = render(<ArticleCard {...mockArticle} />)
    const card = container.querySelector('.rounded-lg')
    expect(card).toBeInTheDocument()
  })

  it('should have shadow styling', () => {
    const { container } = render(<ArticleCard {...mockArticle} />)
    const card = container.querySelector('.shadow-md')
    expect(card).toBeInTheDocument()
  })
})

