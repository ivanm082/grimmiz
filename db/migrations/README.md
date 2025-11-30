# Migraciones de Base de Datos

Este directorio contiene las migraciones SQL para la base de datos de Grimmiz.

## Cómo aplicar las migraciones

1. Accede a tu panel de Supabase
2. Ve a la sección "SQL Editor"
3. Copia el contenido del archivo de migración que desees aplicar
4. Pégalo en el editor SQL
5. Ejecuta el script

## Migraciones Disponibles

### `add_internal_fields_to_product.sql`

**Fecha**: 2025-11-30

**Descripción**: Añade tres campos internos a la tabla `product`:
- `internal_notes` (text): Notas internas del producto
- `materials` (text): Materiales utilizados en el producto
- `stock` (integer): Cantidad disponible en stock

**Nota importante**: Estos campos son opcionales y están diseñados para uso interno del backoffice. No se muestran en las páginas públicas del sitio.

**Validaciones**:
- El campo `stock` tiene una constraint CHECK que solo permite valores >= 0

## Orden de ejecución

Ejecuta las migraciones en el orden que aparecen en este directorio (por fecha).

## Rollback

Si necesitas revertir una migración, ejecuta el siguiente SQL (ejemplo para `add_internal_fields_to_product.sql`):

```sql
-- Revertir migración: add_internal_fields_to_product.sql
ALTER TABLE public.product DROP COLUMN IF EXISTS internal_notes;
ALTER TABLE public.product DROP COLUMN IF EXISTS materials;
ALTER TABLE public.product DROP COLUMN IF EXISTS stock;
```

