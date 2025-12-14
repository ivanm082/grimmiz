-- Migración: Unificar categorías y etiquetas entre productos y artículos
-- Fecha: 2025-12-14
-- Descripción: Elimina blog_category y blog_tag, actualiza blog_article y blog_article_tag
--              para usar las tablas category y tag compartidas con productos

-- IMPORTANTE: Ejecutar este script SOLO si ya creaste las tablas blog_category y blog_tag
-- Si es una instalación nueva, ejecuta directamente los esquemas actualizados

-- ============================================
-- PASO 1: Migrar datos de blog_category a category
-- ============================================

-- Insertar categorías del blog en la tabla category (si no existen ya)
INSERT INTO category (name, slug, image_url, created_at)
SELECT bc.name, bc.slug, bc.image_url, bc.created_at
FROM blog_category bc
WHERE NOT EXISTS (
    SELECT 1 FROM category c WHERE c.slug = bc.slug
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- PASO 2: Migrar datos de blog_tag a tag
-- ============================================

-- Insertar etiquetas del blog en la tabla tag (si no existen ya)
INSERT INTO tag (name, slug, created_at)
SELECT bt.name, bt.slug, bt.created_at
FROM blog_tag bt
WHERE NOT EXISTS (
    SELECT 1 FROM tag t WHERE t.slug = bt.slug
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- PASO 3: Actualizar blog_article para usar category_id
-- ============================================

-- Añadir columna temporal para mapear categorías
ALTER TABLE blog_article ADD COLUMN IF NOT EXISTS category_id INTEGER;

-- Actualizar category_id basándose en blog_category_id
UPDATE blog_article ba
SET category_id = c.id
FROM blog_category bc
JOIN category c ON c.slug = bc.slug
WHERE ba.blog_category_id = bc.id
AND ba.category_id IS NULL;

-- Verificar que todas las filas tienen category_id
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM blog_article WHERE category_id IS NULL) THEN
        RAISE EXCEPTION 'Error: Hay artículos sin category_id. Revisa los datos antes de continuar.';
    END IF;
END $$;

-- Eliminar la restricción de la columna antigua
ALTER TABLE blog_article DROP CONSTRAINT IF EXISTS blog_article_blog_category_id_fkey;

-- Eliminar índice antiguo
DROP INDEX IF EXISTS idx_blog_article_category;

-- Eliminar columna antigua
ALTER TABLE blog_article DROP COLUMN IF EXISTS blog_category_id;

-- Hacer la nueva columna NOT NULL y añadir la foreign key
ALTER TABLE blog_article ALTER COLUMN category_id SET NOT NULL;
ALTER TABLE blog_article ADD CONSTRAINT blog_article_category_id_fkey 
    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE RESTRICT;

-- Crear índice en la nueva columna
CREATE INDEX IF NOT EXISTS idx_blog_article_category ON blog_article(category_id);

-- ============================================
-- PASO 4: Actualizar blog_article_tag para usar tag_id
-- ============================================

-- Añadir columna temporal para mapear etiquetas
ALTER TABLE blog_article_tag ADD COLUMN IF NOT EXISTS tag_id INTEGER;

-- Actualizar tag_id basándose en blog_tag_id
UPDATE blog_article_tag bat
SET tag_id = t.id
FROM blog_tag bt
JOIN tag t ON t.slug = bt.slug
WHERE bat.blog_tag_id = bt.id
AND bat.tag_id IS NULL;

-- Verificar que todas las filas tienen tag_id
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM blog_article_tag WHERE tag_id IS NULL) THEN
        RAISE EXCEPTION 'Error: Hay relaciones artículo-tag sin tag_id. Revisa los datos antes de continuar.';
    END IF;
END $$;

-- Eliminar la primary key antigua
ALTER TABLE blog_article_tag DROP CONSTRAINT IF EXISTS blog_article_tag_pkey;

-- Eliminar índices antiguos
DROP INDEX IF EXISTS idx_blog_article_tag_tag;

-- Eliminar columna antigua
ALTER TABLE blog_article_tag DROP COLUMN IF EXISTS blog_tag_id;

-- Crear nueva primary key
ALTER TABLE blog_article_tag ADD PRIMARY KEY (blog_article_id, tag_id);

-- Añadir foreign key constraint
ALTER TABLE blog_article_tag ADD CONSTRAINT blog_article_tag_tag_id_fkey
    FOREIGN KEY (tag_id) REFERENCES tag(id) ON DELETE CASCADE;

-- Crear índice en la nueva columna
CREATE INDEX IF NOT EXISTS idx_blog_article_tag_tag ON blog_article_tag(tag_id);

-- ============================================
-- PASO 5: Eliminar tablas antiguas del blog
-- ============================================

DROP TABLE IF EXISTS blog_category CASCADE;
DROP TABLE IF EXISTS blog_tag CASCADE;

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Verificar artículos con sus categorías
SELECT 
    ba.id,
    ba.title,
    c.name as category_name,
    ba.published
FROM blog_article ba
JOIN category c ON ba.category_id = c.id
ORDER BY ba.created_at DESC
LIMIT 10;

-- Verificar artículos con sus etiquetas
SELECT 
    ba.title,
    STRING_AGG(t.name, ', ') as tags
FROM blog_article ba
LEFT JOIN blog_article_tag bat ON ba.id = bat.blog_article_id
LEFT JOIN tag t ON bat.tag_id = t.id
GROUP BY ba.id, ba.title
ORDER BY ba.title
LIMIT 10;

-- Mostrar mensaje de éxito
DO $$
BEGIN
    RAISE NOTICE '✅ Migración completada con éxito!';
    RAISE NOTICE 'Los artículos ahora comparten categorías y etiquetas con los productos.';
END $$;

