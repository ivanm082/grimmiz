import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  let notes = null
  let error = null
  let configError = null

  try {
    const supabase = createClient()
    const result = await supabase
      .from('notes')
      .select('*')
    
    notes = result.data
    error = result.error
  } catch (err: any) {
    configError = err.message
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Hola mundo</h1>
      
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">Contenido de la tabla "notes"</h2>
        
        {configError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Error de configuración:</p>
            <p className="mb-2">{configError}</p>
            <div className="mt-3 text-sm">
              <p className="font-semibold">Pasos para solucionarlo:</p>
              <ol className="list-decimal list-inside mt-1 space-y-1">
                <li>Crea un archivo <code className="bg-red-200 px-1 rounded">.env.local</code> en la raíz del proyecto</li>
                <li>Añade las siguientes variables:</li>
              </ol>
              <pre className="mt-2 bg-red-200 p-2 rounded text-xs overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}
              </pre>
              <div className="mt-2 text-xs space-y-1">
                <p><strong>Importante:</strong> La URL debe comenzar con <code className="bg-red-200 px-1 rounded">https://</code> o <code className="bg-red-200 px-1 rounded">http://</code></p>
                <p>Puedes obtener estas credenciales en: <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" className="underline">Supabase Dashboard</a> → Settings → API</p>
                <p className="mt-2"><strong>Después de crear/editar .env.local, reinicia el servidor:</strong></p>
                <code className="block bg-red-200 p-1 rounded mt-1">npm run dev</code>
              </div>
            </div>
          </div>
        )}
        
        {!configError && error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Error al conectar con Supabase:</p>
            <p>{error.message}</p>
          </div>
        )}
        
        {!configError && !error && notes && notes.length === 0 && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <p>La tabla "notes" está vacía.</p>
          </div>
        )}
        
        {!configError && !error && notes && notes.length > 0 && (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {Object.keys(notes[0]).map((key) => (
                    <th
                      key={key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {notes.map((note: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    {Object.keys(note).map((key) => (
                      <td
                        key={key}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                      >
                        {typeof note[key] === 'object'
                          ? JSON.stringify(note[key])
                          : String(note[key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}


