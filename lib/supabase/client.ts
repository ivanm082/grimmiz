import { createBrowserClient } from '@supabase/ssr'

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

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

