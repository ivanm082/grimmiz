import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Faltan las variables de entorno de Supabase. Por favor, configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en tu archivo .env.local'
    )
  }

  // Validar que la URL sea válida
  try {
    const url = new URL(supabaseUrl)
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('La URL debe usar HTTP o HTTPS')
    }
  } catch (urlError) {
    throw new Error(
      `La URL de Supabase no es válida: "${supabaseUrl}". Debe ser una URL completa que comience con http:// o https://. Ejemplo: https://xxxxx.supabase.co`
    )
  }

  const cookieStore = cookies()

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

// Cliente de admin que bypasea RLS usando service role key
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Faltan las variables de entorno de Supabase para admin. Por favor, configura NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en tu archivo .env.local'
    )
  }

  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      fetch: (url, options) => {
        return fetch(url, {
          ...options,
          cache: 'no-store',
        })
      },
    },
  })
}
