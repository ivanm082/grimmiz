-- Migration: Add product_id foreign key to product_lead table
-- Date: 2025-12-20
-- Description: Adds product_id column as foreign key reference to product table

-- Add product_id column to existing product_lead table
ALTER TABLE product_lead
ADD COLUMN IF NOT EXISTS product_id INTEGER NULL REFERENCES product(id) ON DELETE SET NULL;

-- Add index for the new column
CREATE INDEX IF NOT EXISTS idx_product_lead_product_id ON product_lead(product_id);

-- Update comment for the new column
COMMENT ON COLUMN product_lead.product_id IS 'ID del producto (referencia externa opcional)';
