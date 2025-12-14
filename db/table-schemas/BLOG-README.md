# Esquemas de Tablas del Blog - Diario Grimmiz

Este directorio contiene los esquemas SQL para las tablas del blog "Diario Grimmiz".

## Orden de Creación

Para crear las tablas correctamente, ejecuta los scripts en el siguiente orden:

1. **blog_category-schema.sql** - Categorías del blog
2. **blog_tag-schema.sql** - Etiquetas del blog
3. **blog_article-schema.sql** - Artículos del blog
4. **blog_article_tag-schema.sql** - Relación entre artículos y etiquetas
5. **blog_article_image-schema.sql** - Imágenes adicionales de artículos

## Estructura de las Tablas

### 1. blog_category
Categorías para organizar los artículos del blog.

**Campos:**
- `id` - ID único
- `name` - Nombre de la categoría
- `slug` - Slug para URLs amigables
- `description` - Descripción opcional
- `image_url` - URL de imagen opcional
- `created_at` - Fecha de creación

### 2. blog_tag
Etiquetas para clasificar los artículos.

**Campos:**
- `id` - ID único
- `name` - Nombre de la etiqueta
- `slug` - Slug para URLs amigables
- `created_at` - Fecha de creación

### 3. blog_article
Artículos del blog con contenido en Markdown.

**Campos:**
- `id` - ID único
- `title` - Título del artículo
- `slug` - Slug para URLs amigables
- `excerpt` - Extracto/resumen corto
- `content` - Contenido completo en Markdown
- `main_image_url` - URL de la imagen principal
- `blog_category_id` - Referencia a la categoría
- `created_at` - Fecha de creación
- `updated_at` - Fecha de última modificación (actualización automática)
- `published` - Estado de publicación

**Trigger:** `updated_at` se actualiza automáticamente en cada modificación.

### 4. blog_article_tag
Tabla de relación N:N entre artículos y etiquetas.

**Campos:**
- `blog_article_id` - Referencia al artículo
- `blog_tag_id` - Referencia a la etiqueta

### 5. blog_article_image
Imágenes adicionales para los artículos (opcional).

**Campos:**
- `id` - ID único
- `blog_article_id` - Referencia al artículo
- `image_url` - URL de la imagen
- `display_order` - Orden de visualización
- `created_at` - Fecha de creación

## Índices

Todas las tablas incluyen índices optimizados para:
- Búsquedas por slug
- Filtrado por categoría
- Ordenación por fechas
- Estado de publicación
- Relaciones entre tablas

## Diferencias con las Tablas de Productos

Las tablas del blog son completamente independientes de las tablas de productos:
- Categorías y etiquetas separadas (`blog_category`, `blog_tag` vs `category`, `tag`)
- Campo `content` en Markdown para contenido extenso
- Campo `excerpt` para resúmenes
- Campo `published` para control de publicación
- Trigger automático para `updated_at`

## Cómo Ejecutar en Supabase

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Navega a "SQL Editor"
3. Copia y pega cada script en orden
4. Ejecuta cada script con el botón "Run"

## Políticas de Seguridad (RLS)

Después de crear las tablas, recuerda configurar las políticas de Row Level Security en Supabase si es necesario.

