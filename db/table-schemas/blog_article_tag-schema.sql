-- Blog Article Tag Table Schema
-- Tabla de relación N:N entre artículos y etiquetas del blog
-- Usa la tabla tag compartida con productos

CREATE TABLE IF NOT EXISTS blog_article_tag (
    blog_article_id INTEGER NOT NULL REFERENCES blog_article(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tag(id) ON DELETE CASCADE,
    PRIMARY KEY (blog_article_id, tag_id)
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_blog_article_tag_article ON blog_article_tag(blog_article_id);
CREATE INDEX IF NOT EXISTS idx_blog_article_tag_tag ON blog_article_tag(tag_id);

-- Comentarios sobre la tabla
COMMENT ON TABLE blog_article_tag IS 'Relación N:N entre artículos y etiquetas (compartidas con productos)';
COMMENT ON COLUMN blog_article_tag.blog_article_id IS 'ID del artículo';
COMMENT ON COLUMN blog_article_tag.tag_id IS 'ID de la etiqueta (compartida con productos)';

