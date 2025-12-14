# Contexto Completo del Proyecto Grimmiz - 5 Diciembre 2025

## 📋 Información General del Proyecto

**Nombre**: Grimmiz  
**Tipo**: E-commerce de productos artesanales hechos a mano  
**Tech Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Supabase  
**Repositorio**: git@github.com:ivanm082/grimmiz.git  
**Branch principal**: main

## 🏗️ Arquitectura y Estructura

### Tecnologías Principales
- **Framework**: Next.js 14 con App Router
- **Base de datos**: Supabase (PostgreSQL)
- **Almacenamiento**: Supabase Storage para imágenes
- **Autenticación Admin**: JWT con bcryptjs
- **Email**: Resend para formulario de contacto
- **Estilos**: Tailwind CSS
- **Testing**: Jest + React Testing Library
- **Imágenes**: Optimización con transformaciones de Supabase

### Estructura de Carpetas
```
grimmiz/
├── app/                          # App Router de Next.js
│   ├── admin/                    # Panel de administración
│   │   ├── categories/          # CRUD de categorías
│   │   ├── dashboard/           # Dashboard principal
│   │   ├── login/               # Login de admin
│   │   └── products/            # CRUD de productos
│   ├── api/                     # API Routes
│   │   ├── admin/              # Endpoints admin
│   │   └── contact/            # Formulario de contacto
│   ├── contacto/               # Página de contacto
│   ├── mundo-grimmiz/          # Listado y detalle de productos
│   │   ├── [[...filters]]/    # Catch-all para filtros SEO
│   │   └── producto/[slug]/   # Detalle de producto
│   ├── layout.tsx              # Layout principal
│   ├── page.tsx                # Home page
│   └── globals.css             # Estilos globales
├── components/                  # Componentes React
│   ├── admin/                  # Componentes del admin
│   │   ├── __tests__/         # Tests de componentes admin
│   │   ├── AdditionalImagesManager.tsx
│   │   ├── AdminLayout.tsx
│   │   ├── CategoriesTable.tsx
│   │   ├── CategoryForm.tsx
│   │   ├── DeleteModal.tsx
│   │   ├── ImageUpload.tsx
│   │   ├── Pagination.tsx
│   │   ├── ProductForm.tsx
│   │   ├── ProductsTable.tsx
│   │   ├── SearchBar.tsx
│   │   └── TagInput.tsx
│   ├── __tests__/              # Tests de componentes públicos
│   ├── AdoptButton.tsx
│   ├── ArticleCard.tsx
│   ├── ContactModal.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── OptimizedImage.tsx
│   ├── ProductCard.tsx
│   ├── ProductFilters.tsx
│   └── ProductImageGallery.tsx
├── lib/                         # Utilidades y helpers
│   ├── __tests__/              # Tests de utilidades
│   ├── auth.ts                 # Autenticación JWT
│   ├── url-builder.ts          # Constructor de URLs SEO
│   ├── utils.ts                # Utilidades generales
│   └── supabase/               # Cliente y utilidades de Supabase
│       ├── client.ts           # Cliente de Supabase (browser)
│       ├── server.ts           # Cliente de Supabase (server)
│       ├── image-utils.ts      # Optimización de imágenes
│       └── storage.ts          # Gestión de Storage
├── db/                          # Scripts y esquemas de BD
│   ├── migrations/             # Migraciones de BD
│   ├── table-rows/             # Datos de ejemplo
│   └── table-schemas/          # Esquemas de tablas
├── public/                      # Archivos estáticos
├── jest.config.js              # Configuración de Jest
├── jest.setup.js               # Setup de Jest
├── middleware.ts               # Middleware de Next.js
├── next.config.mjs             # Configuración de Next.js
├── package.json                # Dependencias
├── tailwind.config.ts          # Configuración de Tailwind
├── tsconfig.json               # Configuración de TypeScript
├── .env.local                  # Variables de entorno (no en repo)
├── env.example                 # Ejemplo de variables de entorno
├── .gitignore                  # Archivos ignorados por Git
├── README.md                   # Documentación del proyecto
└── TESTING.md                  # Documentación de tests
```

## 🗄️ Base de Datos (Supabase)

### Tablas Principales

1. **category**
   - `id` (int, PK)
   - `name` (text)
   - `slug` (text, unique)
   - `image_url` (text, nullable)
   - `created_at` (timestamp)

2. **product**
   - `id` (int, PK)
   - `title` (text)
   - `description` (text, nullable)
   - `price` (decimal)
   - `main_image_url` (text)
   - `slug` (text)
   - `category_id` (int, FK -> category)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)
   - `is_internal` (boolean) - Para productos de uso interno

3. **tag**
   - `id` (int, PK)
   - `name` (text)
   - `slug` (text, unique)
   - `created_at` (timestamp)

4. **product_tag** (tabla de relación N:N)
   - `product_id` (int, FK -> product)
   - `tag_id` (int, FK -> tag)
   - PK compuesta (product_id, tag_id)

5. **additional_product_images**
   - `id` (int, PK)
   - `product_id` (int, FK -> product)
   - `image_url` (text)
   - `display_order` (int)
   - `created_at` (timestamp)

### Storage Buckets
- **grimmiz-images**: Almacena todas las imágenes de productos y categorías
  - Estructura: `products/`, `categories/`
  - Optimización automática con transformaciones de Supabase

## 🔐 Autenticación y Seguridad

### Admin
- **Sistema**: JWT con bcryptjs
- **Variables de entorno**:
  - `ADMIN_USERNAME`: Usuario administrador
  - `ADMIN_PASSWORD`: Contraseña (hasheada en BD)
  - `JWT_SECRET`: Clave secreta para tokens JWT
- **Middleware**: Protege rutas `/admin/*` (excepto `/admin/login`)
- **Cookie**: `admin-token` con httpOnly

### API Routes Protegidas
- Todas las rutas `/api/admin/*` requieren token JWT válido
- Verificación en cada endpoint

## 🎨 Características Implementadas

### Portal Público

1. **Home Page** (`/`)
   - Hero section
   - Productos destacados
   - Artículos relacionados
   - Llamada a la acción

2. **Mundo Grimmiz** (`/mundo-grimmiz/`)
   - **URLs SEO-Friendly**:
     - Base: `/mundo-grimmiz/`
     - Por categoría: `/mundo-grimmiz/{categoria-slug}/`
     - Con etiqueta: `/mundo-grimmiz/{categoria-slug}/etiqueta-{etiqueta-slug}/`
     - Con paginación: `/mundo-grimmiz/{categoria-slug}/pagina-{numero}/`
     - Con ordenación: `/mundo-grimmiz/{categoria-slug}/orden-{tipo}/`
     - Ejemplo completo: `/mundo-grimmiz/figuras-de-resina/etiqueta-timo/pagina-2/orden-precio-asc/`
   - **Filtros**:
     - Por categoría
     - Por etiqueta
     - Ordenación: recientes, precio ascendente, precio descendente
     - Paginación (12 productos por página)
   - **Redirecciones**: URLs antiguas con query params redirigen a nuevas URLs SEO

3. **Detalle de Producto** (`/mundo-grimmiz/producto/{slug-producto-id}/`)
   - Galería de imágenes con navegación
   - Información del producto (título, precio, descripción)
   - Categoría y etiquetas enlazadas
   - Breadcrumb
   - Botón "Adopta este Grimmiz" (abre modal de contacto)
   - Artículos relacionados

4. **Contacto** (`/contacto/`)
   - Formulario de contacto
   - Validación de campos
   - Envío por email con Resend

5. **Modal de Contacto**
   - Se abre al hacer clic en "Adopta este Grimmiz"
   - Pre-rellena el producto de interés
   - Validación y envío

### Panel de Administración (`/admin/*`)

1. **Login** (`/admin/login`)
   - Autenticación con JWT
   - Redirección automática si ya está logueado

2. **Dashboard** (`/admin/dashboard`)
   - Estadísticas del negocio
   - Resumen de productos y categorías
   - Productos recientes

3. **Gestión de Productos** (`/admin/products`)
   - Listado con búsqueda y filtros
   - Paginación
   - Crear/Editar/Eliminar productos
   - Gestión de imágenes (principal + adicionales)
   - Gestión de etiquetas
   - Marcar como "interno" (oculto en portal)
   - Duplicar producto
   - Vista previa en web

4. **Gestión de Categorías** (`/admin/categories`)
   - Listado de categorías
   - Crear/Editar/Eliminar categorías
   - Gestión de imagen de categoría

## 🔍 SEO Implementado

### Características SEO

1. **Trailing Slashes**
   - Todas las URLs terminan con `/`
   - Configurado en `next.config.mjs`: `trailingSlash: true`

2. **Meta Tags Dinámicos**
   - `<title>`: Único para cada página con estructura consistente
   - `<meta name="description">`: Descripción única y descriptiva
   - `<link rel="canonical">`: URL canónica en todas las páginas indexables
   - `<meta name="robots">`: `noindex, nofollow` en páginas con ordenación

3. **Títulos de Página**
   - Home: "Grimmiz"
   - Mundo Grimmiz: "{Categoría} #{Etiqueta} - página {N} de {Total} | Grimmiz"
   - Producto: "{Nombre del Producto} | {Categoría} | Grimmiz"
   - Contacto: "Contacto | Grimmiz"
   - Páginas con ordenación: Mismo título que sin ordenación

4. **Meta Descriptions**
   - Home: Descripción general del negocio
   - Mundo Grimmiz: Incluye categoría, etiqueta, paginación y ordenación
   - Producto: "Ver las fotos y detalles de {categoria} {nombre}. Hecho a mano en Grimmiz."
   - Contacto: Descripción del formulario de contacto

5. **URLs SEO-Friendly**
   - Estructura jerárquica y descriptiva
   - Sin query parameters para filtros
   - Slugs legibles y descriptivos

6. **Robots y Canonical**
   - Páginas con ordenación: `noindex, nofollow` (sin canonical)
   - Resto de páginas: indexables con canonical

## 🧪 Testing

### Configuración
- **Framework**: Jest 30.2.0
- **Testing Library**: React Testing Library 16.3.0
- **Entorno**: jsdom
- **Coverage**: Configurado en `jest.config.js`

### Scripts
```bash
npm test              # Modo watch
npm run test:coverage # Con reporte de coverage
```

### Cobertura Actual
- **Total de tests**: 483 tests ✅
- **Coverage general**: ~27% (enfocado en código crítico)
- **lib/**: ~100% de cobertura
  - `lib/utils.ts`: 100%
  - `lib/auth.ts`: 100%
  - `lib/url-builder.ts`: 100%
  - `lib/supabase/image-utils.ts`: 100%
  - `lib/supabase/storage.ts`: ~95%

### Archivos con Tests

**Utilidades (`lib/__tests__/`)**:
- `url-builder.test.ts`: URLs SEO-friendly
- `utils.test.ts`: Generación de slugs
- `auth.test.ts`: JWT y autenticación
- `supabase/image-utils.test.ts`: Optimización de imágenes
- `supabase/storage.test.ts`: Subida y validación de imágenes

**Componentes Públicos (`components/__tests__/`)**:
- `ProductCard.test.tsx`
- `ArticleCard.test.tsx`
- `OptimizedImage.test.tsx`
- `AdoptButton.test.tsx`
- `Header.test.tsx`
- `Footer.test.tsx`
- `ProductFilters.test.tsx`
- `ProductImageGallery.test.tsx`
- `ContactModal.test.tsx`

**Componentes Admin (`components/admin/__tests__/`)**:
- `SearchBar.test.tsx`
- `Pagination.test.tsx`
- `DeleteModal.test.tsx`
- `ImageUpload.test.tsx`
- `TagInput.test.tsx`
- `CategoryForm.test.tsx`
- `CategoriesTable.test.tsx`

### Archivos Excluidos del Coverage
- Archivos de configuración (`.config.js`)
- Páginas de Next.js (`app/**/*.tsx`)
- API Routes (`app/api/**/*.ts`)
- Middleware (`middleware.ts`)
- Clientes de Supabase (`lib/supabase/client.ts`, `lib/supabase/server.ts`)
- Base de datos (`db/**`)

## 🌍 Variables de Entorno

Archivo: `.env.local` (no en repo, ver `env.example`)

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_supabase_service_role_key

# Resend Configuration
RESEND_API_KEY=re_tu_resend_api_key
RESEND_FROM_EMAIL=noreply@tudominio.com
CONTACT_EMAIL=tu-email@ejemplo.com

# Admin Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD=tu_contraseña_segura_aqui
JWT_SECRET=tu_clave_secreta_jwt_muy_larga_y_segura

# Site URL for canonical links
NEXT_PUBLIC_SITE_URL=https://tudominio.com
```

## 📦 Dependencias Principales

### Producción
```json
{
  "next": "15.0.3",
  "react": "19.0.0",
  "react-dom": "19.0.0",
  "@supabase/supabase-js": "^2.48.1",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "resend": "^4.0.1"
}
```

### Desarrollo
```json
{
  "@testing-library/jest-dom": "^6.9.1",
  "@testing-library/react": "^16.3.0",
  "@testing-library/user-event": "^14.6.1",
  "@types/jest": "^30.0.0",
  "jest": "^30.2.0",
  "jest-environment-jsdom": "^30.2.0",
  "typescript": "^5"
}
```

## 🚀 Comandos Útiles

```bash
# Desarrollo
npm run dev           # Iniciar servidor de desarrollo (puerto 3000)
npm run build         # Construir para producción
npm run start         # Iniciar servidor de producción
npm run lint          # Ejecutar linter

# Testing
npm test              # Ejecutar tests en modo watch
npm run test:coverage # Ejecutar tests con reporte de coverage

# Git
git status            # Ver estado del repo
git add .             # Añadir todos los cambios
git commit -m "msg"   # Hacer commit
git push              # Subir cambios a origin/main
git pull              # Descargar cambios desde origin/main
```

## 📝 Decisiones de Arquitectura Importantes

### 1. URLs SEO-Friendly con Catch-All Routes
- Usamos `[[...filters]]/page.tsx` para capturar todas las combinaciones de filtros
- `url-builder.ts` centraliza la lógica de construcción y parsing de URLs
- Redirecciones automáticas desde URLs antiguas con query params

### 2. Separación de Rutas de Producto
- Productos en `/mundo-grimmiz/producto/[slug]/`
- Filtros en `/mundo-grimmiz/[[...filters]]/`
- Evita conflictos de routing de Next.js

### 3. Optimización de Imágenes
- Transformaciones de Supabase Storage en lugar de next/image
- URLs con parámetros de optimización: `?width=X&quality=Y&format=webp`
- SrcSet para diferentes tamaños y responsive

### 4. SSR para SEO
- `generateMetadata` en todas las páginas públicas
- Datos obtenidos en server-side para mejor SEO
- No usar `use client` en páginas que necesitan SEO

### 5. Testing Enfocado
- Cobertura alta en código crítico (lib/)
- Tests de componentes enfocados en funcionalidad, no en implementación
- Mocks simples para dependencias externas (Supabase, Next.js)

## 🔄 Flujo de Trabajo Git

1. **Branch principal**: `main`
2. **Commits**: Mensajes descriptivos en español
3. **Push**: Directamente a `main` (proyecto personal)
4. **Estado actual**: Todo sincronizado con `origin/main`

## 📚 Documentación Adicional

- `README.md`: Descripción general del proyecto
- `TESTING.md`: Guía completa de testing
- `CONTEXT.md`: Este archivo - Contexto completo del proyecto
- `db/migrations/README.md`: Historial de migraciones

## 🎯 Próximos Pasos Sugeridos

1. **Aumentar cobertura de tests** en componentes complejos (ProductForm, AdminLayout)
2. **Optimizar rendimiento**: Lazy loading, code splitting
3. **Añadir más features SEO**: Sitemap XML, robots.txt
4. **Implementar analytics**: Google Analytics o similar
5. **Mejorar accesibilidad**: ARIA labels, navegación por teclado
6. **Añadir más tests E2E**: Playwright o Cypress

## 👤 Información del Desarrollador

- **Nombre**: Ivan Marquez
- **Email**: ivanm_082@hotmail.com
- **GitHub**: ivanm082

---

**Última actualización**: 5 de diciembre de 2025  
**Versión del contexto**: 2.0 (completa con SEO y Testing)


