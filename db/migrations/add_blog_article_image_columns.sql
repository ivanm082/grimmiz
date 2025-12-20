-- Migración para agregar columnas faltantes a blog_article_image
-- Para que sea compatible con la funcionalidad de additional_product_images

-- Agregar columna alt_text
ALTER TABLE blog_article_image
ADD COLUMN IF NOT EXISTS alt_text character varying null;

-- Agregar columna caption
ALTER TABLE blog_article_image
ADD COLUMN IF NOT EXISTS caption character varying null;

-- Agregar columna updated_at (por consistencia con productos)
ALTER TABLE blog_article_image
ADD COLUMN IF NOT EXISTS updated_at timestamp without time zone not null default (now() AT TIME ZONE 'utc'::text);

-- Actualizar updated_at para registros existentes
UPDATE blog_article_image
SET updated_at = created_at
WHERE updated_at IS NULL;

-- Comentarios sobre las nuevas columnas
COMMENT ON COLUMN blog_article_image.alt_text IS 'Texto alternativo para la imagen (SEO)';
COMMENT ON COLUMN blog_article_image.caption IS 'Pie de foto o descripción de la imagen';


