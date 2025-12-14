-- Script de Datos de Prueba para el Blog - Diario Grimmiz
-- Este script inserta categorías, etiquetas y artículos de ejemplo

-- ============================================
-- 1. CATEGORÍAS DEL BLOG
-- ============================================

INSERT INTO blog_category (name, slug, description) VALUES
('Tutoriales', 'tutoriales', 'Aprende paso a paso cómo crear tus propias manualidades'),
('Inspiración', 'inspiracion', 'Ideas y proyectos creativos para inspirarte'),
('Técnicas', 'tecnicas', 'Descubre técnicas y métodos para mejorar tus creaciones'),
('Materiales', 'materiales', 'Todo sobre materiales y herramientas para manualidades'),
('Eventos', 'eventos', 'Noticias y eventos del mundo Grimmiz');

-- ============================================
-- 2. ETIQUETAS DEL BLOG
-- ============================================

INSERT INTO blog_tag (name, slug) VALUES
('Resina', 'resina'),
('Principiantes', 'principiantes'),
('Avanzado', 'avanzado'),
('DIY', 'diy'),
('Decoración', 'decoracion'),
('Regalos', 'regalos'),
('Reciclaje', 'reciclaje'),
('Figuras', 'figuras'),
('Moldes', 'moldes'),
('Pintura', 'pintura'),
('Láminas', 'laminas'),
('Personalización', 'personalizacion');

-- ============================================
-- 3. ARTÍCULOS DEL BLOG
-- ============================================

-- Artículo 1: Tutorial de Resina para Principiantes
INSERT INTO blog_article (
    title, 
    slug, 
    excerpt, 
    content, 
    main_image_url,
    blog_category_id,
    published
) VALUES (
    'Cómo empezar con resina epoxi: Guía para principiantes',
    'como-empezar-resina-epoxi-principiantes',
    'Descubre los pasos esenciales para comenzar tu aventura con resina epoxi. Todo lo que necesitas saber para crear tus primeras piezas.',
    '# Cómo empezar con resina epoxi: Guía para principiantes

La resina epoxi es un material fascinante que permite crear piezas únicas y personalizadas. En este tutorial, te enseñaremos todo lo que necesitas saber para comenzar.

## Materiales necesarios

1. **Resina epoxi de calidad**: Asegúrate de comprar una resina específica para manualidades
2. **Moldes de silicona**: Para dar forma a tus creaciones
3. **Pigmentos y colorantes**: Para añadir color a tu resina
4. **Herramientas básicas**: Vasos medidores, palitos de mezcla, guantes

## Pasos básicos

### 1. Preparación del espacio de trabajo

Trabaja en un área bien ventilada y protege tu superficie de trabajo con plástico o papel.

### 2. Medición y mezcla

Sigue las proporciones indicadas por el fabricante. La proporción más común es 1:1 o 2:1 (resina:endurecedor).

### 3. Eliminación de burbujas

Usa un soplete o pistola de calor a distancia prudente para eliminar las burbujas de aire.

### 4. Vertido en el molde

Vierte lentamente la resina en tu molde, evitando crear nuevas burbujas.

### 5. Tiempo de curado

Deja secar según las indicaciones del fabricante, generalmente 24-48 horas.

## Consejos importantes

- Siempre usa guantes y protección
- Lee las instrucciones del fabricante
- Practica con proyectos pequeños primero
- Ten paciencia durante el proceso de curado

¡Ya estás listo para crear tus primeras piezas de resina!',
    'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800',
    (SELECT id FROM blog_category WHERE slug = 'tutoriales'),
    true
);

-- Artículo 2: Ideas creativas para decorar
INSERT INTO blog_article (
    title, 
    slug, 
    excerpt, 
    content, 
    main_image_url,
    blog_category_id,
    published
) VALUES (
    '10 ideas creativas para decorar tu hogar con manualidades',
    '10-ideas-creativas-decorar-hogar-manualidades',
    'Transforma tu espacio con estas ideas DIY fáciles y económicas. Dale un toque personal a cada rincón de tu hogar.',
    '# 10 ideas creativas para decorar tu hogar con manualidades

Decorar tu hogar no tiene que ser caro. Con un poco de creatividad y algunos materiales básicos, puedes crear piezas únicas que reflejen tu personalidad.

## 1. Macetas personalizadas

Decora macetas de terracota con pintura acrílica y crea diseños únicos para tus plantas.

## 2. Cuadros de resina

Crea arte abstracto usando resina epoxi con diferentes colores y texturas.

## 3. Portavelas decorativos

Personaliza frascos de vidrio con técnicas de decoupage para crear portavelas únicos.

## 4. Cojines bordados

Añade bordados personalizados a cojines lisos para darles vida.

## 5. Repisas flotantes decoradas

Decora repisas de madera con washi tape o pintura para darles un toque especial.

## 6. Guirnaldas de papel

Crea guirnaldas coloridas con papel de scrapbooking para decorar paredes.

## 7. Organizadores de escritorio

Recicla latas y frascos para crear organizadores prácticos y bonitos.

## 8. Móviles decorativos

Crea móviles con diferentes materiales para colgar del techo.

## 9. Marcos de fotos personalizados

Decora marcos simples con conchas, botones o flores secas.

## 10. Letras decorativas

Crea letras en 3D con cartón y decóralas según tu estilo.

¡Empieza hoy mismo y transforma tu hogar!',
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800',
    (SELECT id FROM blog_category WHERE slug = 'inspiracion'),
    true
);

-- Artículo 3: Técnicas de pintura
INSERT INTO blog_article (
    title, 
    slug, 
    excerpt, 
    content, 
    main_image_url,
    blog_category_id,
    published
) VALUES (
    'Técnicas de pintura para figuras de resina: Acabados profesionales',
    'tecnicas-pintura-figuras-resina-acabados-profesionales',
    'Aprende las técnicas profesionales para pintar tus figuras de resina y conseguir acabados impresionantes.',
    '# Técnicas de pintura para figuras de resina

Pintar figuras de resina requiere técnica y paciencia. Aquí te compartimos los secretos para conseguir acabados profesionales.

## Preparación de la superficie

Antes de pintar, lija suavemente la superficie y limpia con alcohol isopropílico.

## Imprimación

Aplica una capa base de imprimación específica para resina. Esto ayudará a que la pintura se adhiera mejor.

## Técnicas básicas

### Capas finas

Aplica varias capas finas en lugar de una gruesa. Esto evita marcas de pincel y burbujas.

### Difuminado

Usa técnicas de difuminado para crear transiciones suaves entre colores.

### Dry brushing

Técnica perfecta para resaltar detalles y texturas.

### Lavados

Los lavados con pintura diluida son ideales para dar profundidad.

## Sellado final

Protege tu trabajo con un barniz apropiado (mate, satinado o brillante según prefieras).

## Materiales recomendados

- Pinturas acrílicas de calidad
- Pinceles de diferentes tamaños
- Paleta de mezclas
- Agua y trapos para limpiar

¡Practica y verás cómo mejoran tus resultados!',
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
    (SELECT id FROM blog_category WHERE slug = 'tecnicas'),
    true
);

-- Artículo 4: Materiales esenciales
INSERT INTO blog_article (
    title, 
    slug, 
    excerpt, 
    content, 
    main_image_url,
    blog_category_id,
    published
) VALUES (
    'Materiales esenciales para tu taller de manualidades',
    'materiales-esenciales-taller-manualidades',
    'Descubre los materiales básicos que no pueden faltar en tu espacio creativo. Una guía completa para equipar tu taller.',
    '# Materiales esenciales para tu taller de manualidades

Tener un taller bien equipado es fundamental para desarrollar tu creatividad. Aquí está la lista de imprescindibles.

## Herramientas básicas

1. **Tijeras de precisión**
2. **Cúter o bisturí**
3. **Regla metálica**
4. **Tabla de corte**
5. **Pistola de silicona caliente**

## Adhesivos

- Silicona líquida
- Pegamento blanco
- Pegamento en barra
- Pegamento instantáneo

## Materiales para pintura

- Pinceles variados
- Pinturas acrílicas
- Paletas de mezclas
- Recipientes para agua

## Organización

- Cajas de almacenamiento
- Contenedores transparentes
- Organizadores de escritorio
- Etiquetas

## Materiales específicos según tu proyecto

### Para resina
- Resina epoxi
- Moldes de silicona
- Pigmentos

### Para scrapbooking
- Papeles decorativos
- Washi tape
- Sellos y tintas

### Para costura
- Telas variadas
- Hilos de colores
- Agujas y alfileres

## Iluminación

Una buena lámpara de trabajo es esencial para los detalles finos.

¡Comienza poco a poco y ve ampliando según tus necesidades!',
    'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800',
    (SELECT id FROM blog_category WHERE slug = 'materiales'),
    true
);

-- Artículo 5: Regalos personalizados
INSERT INTO blog_article (
    title, 
    slug, 
    excerpt, 
    content, 
    main_image_url,
    blog_category_id,
    published
) VALUES (
    'Ideas de regalos personalizados hechos a mano',
    'ideas-regalos-personalizados-hechos-mano',
    'Sorprende a tus seres queridos con regalos únicos y llenos de significado. Ideas para todas las ocasiones.',
    '# Ideas de regalos personalizados hechos a mano

Los regalos hechos a mano tienen un valor especial. Muestran dedicación, cariño y son únicos.

## Para cumpleaños

### Álbum de fotos personalizado
Crea un álbum con técnicas de scrapbooking lleno de recuerdos especiales.

### Vela aromática artesanal
Fabrica velas con aromas personalizados en recipientes decorados.

### Joyería de resina
Crea pendientes, collares o pulseras con flores presas en resina.

## Para San Valentín

### Cuadro con mensaje especial
Diseña un cuadro con una frase significativa para la pareja.

### Caja de recuerdos
Decora una caja donde guardar momentos especiales.

## Para el Día de la Madre/Padre

### Portarretratos decorado
Personaliza un marco con la técnica que más te guste.

### Organizador de escritorio
Crea un set de organizadores prácticos y bonitos.

## Para Navidad

### Ornamentos personalizados
Diseña adornos únicos para el árbol de Navidad.

### Calendario personalizado
Crea un calendario con fotos y diseños especiales.

## Consejos para el éxito

1. Planifica con tiempo
2. Elige materiales de calidad
3. Personaliza según los gustos del destinatario
4. Presenta tu regalo de forma especial

¡El mejor regalo es el que se hace con el corazón!',
    'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800',
    (SELECT id FROM blog_category WHERE slug = 'inspiracion'),
    true
);

-- Artículo 6: Reciclaje creativo
INSERT INTO blog_article (
    title, 
    slug, 
    excerpt, 
    content, 
    main_image_url,
    blog_category_id,
    published
) VALUES (
    'Reciclaje creativo: Dale nueva vida a objetos cotidianos',
    'reciclaje-creativo-nueva-vida-objetos-cotidianos',
    'Aprende a transformar objetos cotidianos en piezas únicas. El reciclaje creativo es arte, sostenibilidad y diversión.',
    '# Reciclaje creativo: Dale nueva vida a objetos cotidianos

El reciclaje creativo combina sostenibilidad con creatividad. Transforma lo que ibas a tirar en algo hermoso y útil.

## Frascos de vidrio

### Portavelas decorativos
Decora frascos con pintura, encaje o cuerda para crear portavelas únicos.

### Organizadores
Ideal para guardar botones, clips, material de oficina...

### Terrarios
Crea mini ecosistemas en frascos grandes.

## Cajas de cartón

### Organizadores de escritorio
Forra cajas con papel decorativo y crea un sistema de organización.

### Casitas de muñecas
Para los más pequeños, las cajas pueden convertirse en casitas.

## Ropa vieja

### Cojines
Transforma camisetas en fundas de cojín.

### Bolsas reutilizables
Cose bolsas de tela con ropa que ya no uses.

## Latas

### Macetas
Decora latas y úsalas como macetas para hierbas aromáticas.

### Lapiceros
Perfectos para el escritorio, decorados a tu gusto.

## Botellas de plástico

### Organizadores de pared
Corta y decora para crear organizadores útiles.

### Macetas colgantes
Ideales para jardines verticales.

## Beneficios del reciclaje creativo

- Reduce residuos
- Ahorra dinero
- Desarrolla creatividad
- Crea piezas únicas

¡Antes de tirar algo, piensa en cómo podrías transformarlo!',
    'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800',
    (SELECT id FROM blog_category WHERE slug = 'tutoriales'),
    true
);

-- ============================================
-- 4. RELACIONES ARTÍCULO-ETIQUETAS
-- ============================================

-- Artículo 1: Resina para principiantes
INSERT INTO blog_article_tag (blog_article_id, blog_tag_id)
SELECT 
    (SELECT id FROM blog_article WHERE slug = 'como-empezar-resina-epoxi-principiantes'),
    id
FROM blog_tag
WHERE slug IN ('resina', 'principiantes', 'diy', 'moldes');

-- Artículo 2: Decoración del hogar
INSERT INTO blog_article_tag (blog_article_id, blog_tag_id)
SELECT 
    (SELECT id FROM blog_article WHERE slug = '10-ideas-creativas-decorar-hogar-manualidades'),
    id
FROM blog_tag
WHERE slug IN ('diy', 'decoracion', 'principiantes');

-- Artículo 3: Pintura de figuras
INSERT INTO blog_article_tag (blog_article_id, blog_tag_id)
SELECT 
    (SELECT id FROM blog_article WHERE slug = 'tecnicas-pintura-figuras-resina-acabados-profesionales'),
    id
FROM blog_tag
WHERE slug IN ('resina', 'figuras', 'pintura', 'avanzado');

-- Artículo 4: Materiales esenciales
INSERT INTO blog_article_tag (blog_article_id, blog_tag_id)
SELECT 
    (SELECT id FROM blog_article WHERE slug = 'materiales-esenciales-taller-manualidades'),
    id
FROM blog_tag
WHERE slug IN ('principiantes', 'diy');

-- Artículo 5: Regalos personalizados
INSERT INTO blog_article_tag (blog_article_id, blog_tag_id)
SELECT 
    (SELECT id FROM blog_article WHERE slug = 'ideas-regalos-personalizados-hechos-mano'),
    id
FROM blog_tag
WHERE slug IN ('regalos', 'personalizacion', 'diy', 'resina');

-- Artículo 6: Reciclaje creativo
INSERT INTO blog_article_tag (blog_article_id, blog_tag_id)
SELECT 
    (SELECT id FROM blog_article WHERE slug = 'reciclaje-creativo-nueva-vida-objetos-cotidianos'),
    id
FROM blog_tag
WHERE slug IN ('reciclaje', 'diy', 'decoracion', 'principiantes');

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Ver categorías creadas
SELECT * FROM blog_category ORDER BY name;

-- Ver etiquetas creadas
SELECT * FROM blog_tag ORDER BY name;

-- Ver artículos con sus categorías
SELECT 
    ba.id,
    ba.title,
    ba.slug,
    bc.name as category,
    ba.created_at,
    ba.published
FROM blog_article ba
JOIN blog_category bc ON ba.blog_category_id = bc.id
ORDER BY ba.created_at DESC;

-- Ver artículos con sus etiquetas
SELECT 
    ba.title,
    STRING_AGG(bt.name, ', ') as tags
FROM blog_article ba
LEFT JOIN blog_article_tag bat ON ba.id = bat.blog_article_id
LEFT JOIN blog_tag bt ON bat.blog_tag_id = bt.id
GROUP BY ba.title
ORDER BY ba.title;

