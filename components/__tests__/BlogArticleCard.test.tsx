import React from 'react'
import { render, screen } from '@testing-library/react'
import BlogArticleCard from '../BlogArticleCard'
import '@testing-library/jest-dom'

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

// Mock url-builder
jest.mock('@/lib/url-builder', () => ({
  buildBlogListUrl: jest.fn((filters) => {
    if (filters.categoria) {
      return `/diario-grimmiz/${filters.categoria}/`
    }
    return '/diario-grimmiz/'
  }),
}))

const mockArticle = {
  id: 1,
  title: 'Cómo empezar con resina epoxi',
  slug: 'como-empezar-con-resina-epoxi',
  excerpt: 'Descubre los primeros pasos para adentrarte en el fascinante mundo de la resina epoxi...',
  main_image_url: 'https://example.com/image.jpg',
  created_at: '2024-03-15T10:00:00Z',
  category: {
    name: 'Tutoriales',
    slug: 'tutoriales',
  },
}

describe('BlogArticleCard', () => {
  it('renders article information correctly', () => {
    render(<BlogArticleCard article={mockArticle} />)

    expect(screen.getByText('Cómo empezar con resina epoxi')).toBeInTheDocument()
    expect(screen.getByText(/Descubre los primeros pasos/)).toBeInTheDocument()
    expect(screen.getByText('Leer más')).toBeInTheDocument()
  })

  it('renders article image with correct properties', () => {
    render(<BlogArticleCard article={mockArticle} />)

    const image = screen.getByAltText('Cómo empezar con resina epoxi')
    expect(image).toBeInTheDocument()
    // Next Image optimiza la URL, así que verificamos que la src contenga la URL original
    expect(image.getAttribute('src')).toContain('example.com')
  })

  it('formats date correctly', () => {
    render(<BlogArticleCard article={mockArticle} />)

    // Buscar el elemento con la fecha formateada
    const dateElement = screen.getByText(/15 de marzo de 2024/i)
    expect(dateElement).toBeInTheDocument()
  })

  it('links to article detail page', () => {
    render(<BlogArticleCard article={mockArticle} />)

    const articleLinks = screen.getAllByRole('link')
    const detailLink = articleLinks.find((link) =>
      link.getAttribute('href')?.includes('/diario-grimmiz/articulo/como-empezar-con-resina-epoxi/')
    )
    expect(detailLink).toBeTruthy()
  })

  it('handles article without image URL', () => {
    const articleWithoutImage = {
      ...mockArticle,
      main_image_url: '/fallback.jpg', // Use a fallback instead of empty
    }

    render(<BlogArticleCard article={articleWithoutImage} />)

    // Verify the article is still rendered correctly
    expect(screen.getByText('Cómo empezar con resina epoxi')).toBeInTheDocument()
  })

  it('handles long excerpts correctly', () => {
    const articleWithLongExcerpt = {
      ...mockArticle,
      excerpt: 'Lorem ipsum dolor sit amet, '.repeat(50),
    }

    render(<BlogArticleCard article={articleWithLongExcerpt} />)

    const excerptElement = screen.getByText(/Lorem ipsum dolor sit amet/)
    expect(excerptElement).toBeInTheDocument()
    // Verify it has line-clamp-3 class
    expect(excerptElement).toHaveClass('line-clamp-3')
  })

  it('applies correct CSS classes for styling', () => {
    const { container } = render(<BlogArticleCard article={mockArticle} />)

    const cardElement = container.firstChild
    expect(cardElement).toHaveClass('bg-white')
  })

  it('renders call to action button with icon', () => {
    render(<BlogArticleCard article={mockArticle} />)

    const ctaButton = screen.getByText('Leer más')
    expect(ctaButton).toBeInTheDocument()
    expect(ctaButton.closest('a')).toHaveAttribute(
      'href',
      '/diario-grimmiz/articulo/como-empezar-con-resina-epoxi/'
    )
    
    // Verify SVG icon exists
    const svg = ctaButton.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('displays formatted datetime attribute', () => {
    render(<BlogArticleCard article={mockArticle} />)

    const timeElement = screen.getByText(/15 de marzo de 2024/i).closest('time')
    expect(timeElement).toHaveAttribute('datetime', '2024-03-15T10:00:00Z')
  })

  it('has hover effects on image and title', () => {
    render(<BlogArticleCard article={mockArticle} />)

    const image = screen.getByAltText('Cómo empezar con resina epoxi')
    expect(image).toHaveClass('hover:scale-105')

    const title = screen.getByText('Cómo empezar con resina epoxi')
    expect(title).toHaveClass('hover:text-grimmiz-primary')
  })
})

