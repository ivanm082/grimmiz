-- Product Lead Table Schema
-- Tabla para almacenar leads generados desde el formulario de contacto de productos

CREATE TABLE product_lead (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NULL REFERENCES product(id) ON DELETE SET NULL,
    product_title TEXT NOT NULL,
    product_slug TEXT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    comments TEXT NOT NULL,
    status TEXT DEFAULT 'nuevo' CHECK (status IN ('nuevo', 'contactado', 'convertido', 'descartado')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_product_lead_created_at ON product_lead(created_at DESC);
CREATE INDEX idx_product_lead_status ON product_lead(status);
CREATE INDEX idx_product_lead_product_title ON product_lead(product_title);
CREATE INDEX idx_product_lead_email ON product_lead(email);

-- Function and trigger for updated_at
CREATE OR REPLACE FUNCTION update_product_lead_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_product_lead_updated_at
    BEFORE UPDATE ON product_lead
    FOR EACH ROW
    EXECUTE FUNCTION update_product_lead_updated_at();

-- Comments
COMMENT ON TABLE product_lead IS 'Leads generados desde el formulario de contacto de productos';
COMMENT ON COLUMN product_lead.product_id IS 'ID del producto (referencia externa opcional)';
COMMENT ON COLUMN product_lead.product_title IS 'Título del producto de interés';
COMMENT ON COLUMN product_lead.product_slug IS 'Slug del producto (opcional, para relacionarlo con la tabla product)';
COMMENT ON COLUMN product_lead.name IS 'Nombre del lead';
COMMENT ON COLUMN product_lead.email IS 'Email del lead';
COMMENT ON COLUMN product_lead.comments IS 'Mensaje/comentarios del lead';
COMMENT ON COLUMN product_lead.status IS 'Estado del lead: nuevo, contactado, convertido, descartado';
COMMENT ON COLUMN product_lead.created_at IS 'Fecha de creación del lead';
COMMENT ON COLUMN product_lead.updated_at IS 'Fecha de última actualización del lead';
