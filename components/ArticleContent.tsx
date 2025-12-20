import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ArticleContentProps {
  content: string
}

export default function ArticleContent({ content }: ArticleContentProps) {
  return (
    <div className="article-content prose prose-lg prose-gray max-w-none leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Encabezados con estilos personalizados
          h1: ({ children }) => (
            <h1 className="text-4xl md:text-5xl font-bold text-grimmiz-text leading-tight mt-16 mb-8 border-b-2 border-primary/20 pb-4">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-3xl md:text-4xl font-bold text-grimmiz-text leading-tight mt-12 mb-6 border-b-2 border-secondary/20 pb-3">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-2xl md:text-3xl font-bold text-grimmiz-text leading-tight mt-10 mb-5">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xl md:text-2xl font-semibold text-grimmiz-text leading-tight mt-8 mb-4">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-lg md:text-xl font-semibold text-grimmiz-text leading-tight mt-6 mb-3">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-base md:text-lg font-semibold text-grimmiz-text leading-tight mt-6 mb-3">
              {children}
            </h6>
          ),

          // Párrafos con mejor espaciado
          p: ({ children }) => (
            <p className="text-lg text-grimmiz-text-secondary leading-relaxed mb-6 last:mb-0">
              {children}
            </p>
          ),

          // Enlaces con estilo Grimmiz
          a: ({ children, href }) => (
            <a
              href={href}
              className="text-primary font-medium hover:text-primary-dark transition-colors duration-200 underline decoration-2 decoration-primary/30 hover:decoration-primary/60 underline-offset-2"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),

          // Texto en negrita y cursiva
          strong: ({ children }) => (
            <strong className="font-bold text-grimmiz-text">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-grimmiz-text-secondary">
              {children}
            </em>
          ),

          // Listas con mejor espaciado
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-3 my-8 text-lg text-grimmiz-text-secondary">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-3 my-8 text-lg text-grimmiz-text-secondary">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">
              {children}
            </li>
          ),

          // Imágenes con estilo consistente
          img: ({ src, alt, title }) => (
            <div className="my-8">
              <img
                src={src}
                alt={alt || ''}
                title={title}
                className="w-full rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                loading="lazy"
              />
              {title && (
                <p className="text-center text-sm text-grimmiz-text-secondary mt-2 italic">
                  {title}
                </p>
              )}
            </div>
          ),

          // Bloques de cita
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary bg-gradient-to-r from-primary/5 to-secondary/5 pl-8 pr-6 py-6 my-8 rounded-r-lg italic text-grimmiz-text-secondary text-lg leading-relaxed">
              <div className="relative">
                <svg className="absolute -left-12 top-0 w-8 h-8 text-primary/30" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z" />
                </svg>
                {children}
              </div>
            </blockquote>
          ),

          // Código inline
          code: ({ children }) => (
            <code className="bg-gray-100 text-primary px-2 py-1 rounded font-mono text-sm font-medium">
              {children}
            </code>
          ),

          // Bloques de código
          pre: ({ children }) => (
            <pre className="bg-gray-900 text-gray-100 rounded-lg p-6 my-8 overflow-x-auto shadow-lg border border-gray-200">
              <code className="font-mono text-sm leading-relaxed">
                {children}
              </code>
            </pre>
          ),

          // Tablas
          table: ({ children }) => (
            <div className="overflow-x-auto my-8">
              <table className="min-w-full border-collapse border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gradient-to-r from-primary/10 to-secondary/10">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-gray-200">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-gray-50 transition-colors duration-150">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="border border-gray-200 px-6 py-4 text-left font-bold text-grimmiz-text bg-gray-50">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-200 px-6 py-4 text-grimmiz-text-secondary">
              {children}
            </td>
          ),

          // Línea horizontal
          hr: ({}) => (
            <hr className="border-0 border-t-2 border-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 my-12 rounded-full" />
          ),

          // Tareas (checkboxes) para listas
          input: ({ type, checked }) => {
            if (type === 'checkbox') {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  readOnly
                  className="mr-3 accent-primary"
                />
              )
            }
            return <input type={type} checked={checked} readOnly />
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
