# Esquemas de Tablas del Blog - Diario Grimmiz

Este directorio contiene los esquemas SQL para las tablas del blog "Diario Grimmiz".

**IMPORTANTE:** Las categorías y etiquetas son **compartidas** entre productos y artículos del blog. Esto facilita la relación entre ambas secciones y permite una mejor organización del contenido.

## Orden de Creación

Para crear las tablas correctamente, ejecuta los scripts en el siguiente orden:

### Si es una instalación nueva:
1. **category-schema.sql** (del directorio principal) - Categorías compartidas
2. **tag-schema.sql** (del directorio principal) - Etiquetas compartidas
3. **blog_article-schema.sql** - Artículos del blog
4. **blog_article_tag-schema.sql** - Relación entre artículos y etiquetas
5. **blog_article_image-schema.sql** - Imágenes adicionales de artículos

### Si ya tenías las tablas blog_category y blog_tag:
1. Ejecuta el script de migración: **`migrations/unify_categories_tags.sql`**
   - Este script migrará los datos de blog_category y blog_tag a las tablas compartidas
   - Actualizará blog_article y blog_article_tag para usar las nuevas referencias
   - Eliminará las tablas antiguas

## Estructura de las Tablas

### 1. category (compartida con productos)
Categorías usadas tanto para productos como para artículos del blog.

**Campos:**
- `id` - ID único
- `name` - Nombre de la categoría
- `slug` - Slug para URLs amigables
- `image_url` - URL de imagen opcional
- `created_at` - Fecha de creación

### 2. tag (compartida con productos)
Etiquetas usadas tanto para productos como para artículos del blog.

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
- `category_id` - Referencia a la categoría compartida
- `created_at` - Fecha de creación
- `updated_at` - Fecha de última modificación (actualización automática)
- `published` - Estado de publicación

**Trigger:** `updated_at` se actualiza automáticamente en cada modificación.

### 4. blog_article_tag
Tabla de relación N:N entre artículos y etiquetas compartidas.

**Campos:**
- `blog_article_id` - Referencia al artículo
- `tag_id` - Referencia a la etiqueta compartida

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

## Ventajas de Compartir Categorías y Etiquetas

### 1. Facilita la Relación de Contenidos
- Un artículo sobre "Resina" puede vincularse con productos de resina
- Los usuarios pueden descubrir contenido relacionado fácilmente
- Mejora la navegación entre secciones

### 2. Mejor SEO
- URLs consistentes entre productos y artículos
- Contenido relacionado mejora el SEO interno
- Categorías y etiquetas unificadas fortalecen el tema del sitio

### 3. Administración Simplificada
- Una sola gestión de categorías y etiquetas
- Sin duplicación de nombres
- Cambios se aplican en ambas secciones

### 4. Experiencia de Usuario Mejorada
- Filtros consistentes en toda la aplicación
- Navegación intuitiva
- Descubrimiento de contenido relacionado

## Cómo Ejecutar en Supabase

### Instalación Nueva:

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Navega a "SQL Editor"
3. Copia y pega cada script en orden
4. Ejecuta cada script con el botón "Run"

### Si Ya Tienes blog_category y blog_tag:

1. Ve a "SQL Editor"
2. Copia el contenido de `migrations/unify_categories_tags.sql`
3. **REVISA** las queries de verificación al final
4. Ejecuta el script completo
5. Verifica que la migración fue exitosa

## Políticas de Seguridad (RLS)

Después de crear las tablas, configura las políticas de Row Level Security en Supabase:
- Los artículos publicados deben ser accesibles públicamente
- Solo usuarios autenticados (admin) pueden crear/editar artículos

## Datos de Prueba

Ejecuta `table-rows/blog_sample_data.sql` para insertar:
- 4 categorías para el blog
- 12 etiquetas compartidas
- 6 artículos completos en Markdown
- Relaciones artículo-etiqueta

Este script usa `ON CONFLICT DO NOTHING` para evitar duplicados.


