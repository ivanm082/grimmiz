-- Blog Article Table Schema
-- Tabla para los artículos del blog (Diario Grimmiz)

CREATE TABLE IF NOT EXISTS blog_article (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    main_image_url TEXT NOT NULL,
    blog_category_id INTEGER NOT NULL REFERENCES blog_category(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published BOOLEAN DEFAULT true,
    CONSTRAINT unique_blog_article_slug UNIQUE (slug)
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_blog_article_slug ON blog_article(slug);
CREATE INDEX IF NOT EXISTS idx_blog_article_category ON blog_article(blog_category_id);
CREATE INDEX IF NOT EXISTS idx_blog_article_created_at ON blog_article(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_article_updated_at ON blog_article(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_article_published ON blog_article(published);

-- Función para actualizar automáticamente updated_at
CREATE OR REPLACE FUNCTION update_blog_article_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS trigger_update_blog_article_updated_at ON blog_article;
CREATE TRIGGER trigger_update_blog_article_updated_at
    BEFORE UPDATE ON blog_article
    FOR EACH ROW
    EXECUTE FUNCTION update_blog_article_updated_at();

-- Comentarios sobre la tabla
COMMENT ON TABLE blog_article IS 'Artículos del blog Diario Grimmiz';
COMMENT ON COLUMN blog_article.title IS 'Título del artículo';
COMMENT ON COLUMN blog_article.slug IS 'Slug único para URLs amigables';
COMMENT ON COLUMN blog_article.excerpt IS 'Extracto o resumen corto del artículo';
COMMENT ON COLUMN blog_article.content IS 'Contenido completo del artículo en formato Markdown';
COMMENT ON COLUMN blog_article.main_image_url IS 'URL de la imagen principal del artículo';
COMMENT ON COLUMN blog_article.blog_category_id IS 'ID de la categoría del artículo';
COMMENT ON COLUMN blog_article.published IS 'Indica si el artículo está publicado';

