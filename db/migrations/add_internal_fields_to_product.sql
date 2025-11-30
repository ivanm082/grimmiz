-- Migración: Añadir campos internos a la tabla product
-- Fecha: 2025-11-30
-- Descripción: Añade campos de notas internas, materiales y stock para uso exclusivo del backoffice

-- Añadir columna de notas internas
ALTER TABLE public.product
ADD COLUMN internal_notes text NULL;

-- Añadir columna de materiales
ALTER TABLE public.product
ADD COLUMN materials text NULL;

-- Añadir columna de stock
ALTER TABLE public.product
ADD COLUMN stock integer NULL CHECK (stock >= 0);

-- Comentarios para documentar los campos
COMMENT ON COLUMN public.product.internal_notes IS 'Notas internas del producto (solo visible en backoffice)';
COMMENT ON COLUMN public.product.materials IS 'Materiales utilizados en el producto (solo visible en backoffice)';
COMMENT ON COLUMN public.product.stock IS 'Cantidad disponible en stock (solo visible en backoffice)';

