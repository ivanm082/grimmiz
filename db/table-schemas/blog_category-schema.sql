-- Blog Category Table Schema
-- Tabla para las categorías del blog (Diario Grimmiz)

CREATE TABLE IF NOT EXISTS blog_category (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index para búsquedas por slug
CREATE INDEX IF NOT EXISTS idx_blog_category_slug ON blog_category(slug);

-- Comentarios sobre la tabla
COMMENT ON TABLE blog_category IS 'Categorías para los artículos del blog Diario Grimmiz';
COMMENT ON COLUMN blog_category.name IS 'Nombre de la categoría';
COMMENT ON COLUMN blog_category.slug IS 'Slug único para URLs amigables';
COMMENT ON COLUMN blog_category.description IS 'Descripción de la categoría';
COMMENT ON COLUMN blog_category.image_url IS 'URL de la imagen de la categoría';

