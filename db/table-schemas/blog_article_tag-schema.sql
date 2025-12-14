-- Blog Article Tag Table Schema
-- Tabla de relación N:N entre artículos y etiquetas del blog

CREATE TABLE IF NOT EXISTS blog_article_tag (
    blog_article_id INTEGER NOT NULL REFERENCES blog_article(id) ON DELETE CASCADE,
    blog_tag_id INTEGER NOT NULL REFERENCES blog_tag(id) ON DELETE CASCADE,
    PRIMARY KEY (blog_article_id, blog_tag_id)
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_blog_article_tag_article ON blog_article_tag(blog_article_id);
CREATE INDEX IF NOT EXISTS idx_blog_article_tag_tag ON blog_article_tag(blog_tag_id);

-- Comentarios sobre la tabla
COMMENT ON TABLE blog_article_tag IS 'Relación N:N entre artículos y etiquetas del blog';
COMMENT ON COLUMN blog_article_tag.blog_article_id IS 'ID del artículo';
COMMENT ON COLUMN blog_article_tag.blog_tag_id IS 'ID de la etiqueta';

