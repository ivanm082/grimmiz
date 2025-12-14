-- Blog Tag Table Schema
-- Tabla para las etiquetas del blog (Diario Grimmiz)

CREATE TABLE IF NOT EXISTS blog_tag (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index para búsquedas por slug
CREATE INDEX IF NOT EXISTS idx_blog_tag_slug ON blog_tag(slug);

-- Comentarios sobre la tabla
COMMENT ON TABLE blog_tag IS 'Etiquetas para los artículos del blog Diario Grimmiz';
COMMENT ON COLUMN blog_tag.name IS 'Nombre de la etiqueta';
COMMENT ON COLUMN blog_tag.slug IS 'Slug único para URLs amigables';

