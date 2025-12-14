-- Blog Article Additional Images Table Schema
-- Tabla para imágenes adicionales de los artículos del blog

CREATE TABLE IF NOT EXISTS blog_article_image (
    id SERIAL PRIMARY KEY,
    blog_article_id INTEGER NOT NULL REFERENCES blog_article(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_blog_article_image_article ON blog_article_image(blog_article_id);
CREATE INDEX IF NOT EXISTS idx_blog_article_image_order ON blog_article_image(blog_article_id, display_order);

-- Comentarios sobre la tabla
COMMENT ON TABLE blog_article_image IS 'Imágenes adicionales para los artículos del blog';
COMMENT ON COLUMN blog_article_image.blog_article_id IS 'ID del artículo';
COMMENT ON COLUMN blog_article_image.image_url IS 'URL de la imagen adicional';
COMMENT ON COLUMN blog_article_image.display_order IS 'Orden de visualización de la imagen';

