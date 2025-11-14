# Grimmiz - Tienda de Manualidades

Tienda online para productos de manualidades hechos a mano.

## Tecnologías

- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase (base de datos)

## Configuración

### Variables de Entorno

1. Copia el archivo de ejemplo de variables de entorno:
   ```bash
   cp env.example .env.local
   ```

2. Obtén tus credenciales de Supabase desde tu proyecto:
   - Ve a [Supabase Dashboard](https://app.supabase.com)
   - Selecciona tu proyecto
   - Ve a Settings > API
   - Copia la `URL` y la `anon public` key

3. Actualiza `.env.local` con tus credenciales:
   ```
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon
   ```

## Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Uso de Supabase

### En Server Components (app directory)

```typescript
import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = createClient()
  const { data } = await supabase.from('tu_tabla').select()
  // ...
}
```

### En Client Components

```typescript
'use client'
import { createClient } from '@/lib/supabase/client'

export default function Component() {
  const supabase = createClient()
  // ...
}
```

## Despliegue

Este proyecto está configurado para desplegarse en Vercel.

### Configurar variables de entorno en Vercel

1. Ve a tu proyecto en Vercel
2. Settings > Environment Variables
3. Añade `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`


