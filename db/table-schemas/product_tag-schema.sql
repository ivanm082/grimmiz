-- Tabla intermedia para la relación muchos-a-muchos entre productos y etiquetas
create table public.product_tag (
  product_id bigint not null,
  tag_id bigint not null,
  created_at timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
  constraint product_tag_pkey primary key (product_id, tag_id),
  constraint product_tag_product_id_fkey foreign key (product_id) references product (id) on update CASCADE on delete CASCADE,
  constraint product_tag_tag_id_fkey foreign key (tag_id) references tag (id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;

-- Índices para mejorar el rendimiento de las consultas
create index product_tag_product_id_idx on public.product_tag(product_id);
create index product_tag_tag_id_idx on public.product_tag(tag_id);

-- Comentarios
COMMENT ON TABLE public.product_tag IS 'Relación muchos-a-muchos entre productos y etiquetas';
COMMENT ON COLUMN public.product_tag.product_id IS 'ID del producto';
COMMENT ON COLUMN public.product_tag.tag_id IS 'ID de la etiqueta';

