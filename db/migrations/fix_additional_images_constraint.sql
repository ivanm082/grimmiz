-- Migración para corregir el constraint de display_order en additional_product_images
-- El constraint debe ser único por producto, no globalmente

-- 1. Eliminar el constraint antiguo
ALTER TABLE additional_product_images 
DROP CONSTRAINT IF EXISTS additional_product_images_display_order_key;

-- 2. Crear el nuevo constraint (único por producto)
ALTER TABLE additional_product_images 
ADD CONSTRAINT additional_product_images_product_display_order_key 
UNIQUE (product_id, display_order);
