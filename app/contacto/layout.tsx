import { Metadata } from 'next'

/**
 * Genera los metadatos de la página de contacto
 */
export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  return {
    title: 'Contacto | Grimmiz',
    description: '¿Tienes alguna pregunta sobre nuestros productos artesanales? Contacta con Grimmiz y te responderemos lo antes posible.',
    alternates: {
      canonical: `${baseUrl}/contacto/`,
    },
  }
}

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

