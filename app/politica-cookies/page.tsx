import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Política de Cookies | Grimmiz',
    description: 'Información sobre el uso de cookies en Grimmiz. Conoce qué cookies utilizamos y cómo gestionar tus preferencias.',
}

export default function CookiePolicyPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow">
                {/* Breadcrumbs */}
                <div className="bg-gray-50 py-3">
                    <div className="container mx-auto px-4">
                        <nav className="flex items-center space-x-2 text-sm text-grimmiz-text-secondary">
                            <Link href="/" className="hover:text-primary transition-colors">
                                Inicio
                            </Link>
                            <span>/</span>
                            <span className="text-grimmiz-text font-medium">Política de Cookies</span>
                        </nav>
                    </div>
                </div>

                {/* Content */}
                <div className="py-12 bg-white">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="prose prose-lg prose-gray max-w-none">
                            <h1 className="text-4xl font-bold text-grimmiz-text mb-8 text-center">
                                🍪 Política de Cookies
                            </h1>

                            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-blue-800">
                                            <strong>Última actualización:</strong> 20 de diciembre de 2025
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <h2>¿Qué son las Cookies?</h2>
                            <p>
                                Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas
                                nuestro sitio web. Nos permiten recordar tus preferencias y mejorar tu experiencia de navegación.
                            </p>

                            <h2>¿Por qué utilizamos Cookies?</h2>
                            <p>
                                En Grimmiz utilizamos cookies para:
                            </p>
                            <ul>
                                <li><strong>Garantizar el funcionamiento básico</strong> del sitio web</li>
                                <li><strong>Mejorar tu experiencia</strong> de navegación y usabilidad</li>
                                <li><strong>Analizar el tráfico</strong> y comportamiento de los usuarios</li>
                                <li><strong>Personalizar el contenido</strong> y las recomendaciones</li>
                                <li><strong>Recordar tus preferencias</strong> de idioma y configuración</li>
                            </ul>

                            <h2>Tipos de Cookies que Utilizamos</h2>

                            <h3>Cookies Técnicas (Esenciales)</h3>
                            <p>
                                Estas cookies son necesarias para el funcionamiento básico del sitio web y no pueden
                                desactivarse. Incluyen:
                            </p>
                            <ul>
                                <li>Cookies de sesión para mantener tu sesión activa</li>
                                <li>Cookies de seguridad para proteger tus datos</li>
                                <li>Cookies de preferencias de idioma y configuración</li>
                                <li><strong>Siempre activas:</strong> Se usan incluso si rechazas otras cookies</li>
                            </ul>

                            <h3>Cookies de Análisis</h3>
                            <p>
                                Utilizamos cookies de análisis para entender cómo interactúas con nuestro sitio web.
                                Esta información nos ayuda a mejorar nuestros servicios.
                            </p>
                            <ul>
                                <li><strong>Google Analytics:</strong> Para analizar el tráfico web y comportamiento de usuarios</li>
                                <li><strong>Cookies propias:</strong> Para medir el rendimiento del sitio</li>
                            </ul>

                            <h3>Cookies de Marketing</h3>
                            <p>
                                Estas cookies se utilizan para mostrarte anuncios relevantes basados en tus intereses
                                y navegación previa.
                            </p>
                            <ul>
                                <li>Cookies de redes sociales para compartir contenido</li>
                                <li>Cookies de remarketing para campañas publicitarias</li>
                                <li><strong>Se desactiva</strong> si rechazas las cookies no esenciales</li>
                            </ul>

                            <h2>¿Qué Sucede si Rechazas las Cookies?</h2>
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                                            Funcionalidad Limitada
                                        </h3>
                                        <p className="text-yellow-700 mb-3">
                                            Si rechazas las cookies no esenciales, podrás seguir navegando normalmente,
                                            pero algunas funcionalidades estarán limitadas:
                                        </p>
                                        <ul className="text-yellow-700 text-sm space-y-1">
                                            <li>• No podremos analizar tu navegación para mejorar el sitio</li>
                                            <li>• No se mostrarán recomendaciones personalizadas</li>
                                            <li>• Las funciones sociales pueden estar limitadas</li>
                                            <li>• Podrás seguir comprando y contactando normalmente</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <h2>¿Cómo Gestionar tus Cookies?</h2>

                            <h3>A través de nuestro Sitio Web</h3>
                            <p>
                                Puedes gestionar tus preferencias de cookies en cualquier momento utilizando el
                                banner de cookies que aparece en la parte inferior de nuestra web.
                            </p>

                            <h3>A través de tu Navegador</h3>
                            <p>
                                La mayoría de los navegadores web te permiten controlar las cookies a través de sus
                                configuraciones. Puedes:
                            </p>
                            <ul>
                                <li>Ver qué cookies tienes instaladas y borrarlas individualmente</li>
                                <li>Bloquear cookies de terceros</li>
                                <li>Bloquear cookies de determinados sitios</li>
                                <li>Borrar todas las cookies cuando cierras el navegador</li>
                            </ul>

                            <h4>Instrucciones por Navegador:</h4>
                            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                <p className="font-semibold mb-2">Google Chrome:</p>
                                <p className="text-sm text-gray-600 mb-3">Configuración → Privacidad y seguridad → Cookies y otros datos de sitios</p>

                                <p className="font-semibold mb-2">Mozilla Firefox:</p>
                                <p className="text-sm text-gray-600 mb-3">Preferencias → Privacidad y Seguridad → Cookies y datos del sitio</p>

                                <p className="font-semibold mb-2">Safari:</p>
                                <p className="text-sm text-gray-600 mb-3">Preferencias → Privacidad → Gestionar datos de sitios web</p>

                                <p className="font-semibold mb-2">Microsoft Edge:</p>
                                <p className="text-sm text-gray-600">Configuración → Cookies y permisos del sitio → Cookies y datos almacenados</p>
                            </div>

                            <h2>Cookies de Terceros</h2>
                            <p>
                                Algunas cookies son gestionadas por servicios de terceros que utilizamos en nuestro sitio web:
                            </p>

                            <h3>Google Analytics</h3>
                            <p>
                                Utilizamos Google Analytics para analizar el tráfico de nuestro sitio web.
                                Puedes obtener más información sobre cómo Google utiliza tus datos en su{' '}
                                <a
                                    href="https://policies.google.com/privacy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:text-primary-dark underline"
                                >
                                    Política de Privacidad
                                </a>.
                            </p>
                            <p>
                                Puedes desactivar Google Analytics instalando el{' '}
                                <a
                                    href="https://tools.google.com/dlpage/gaoptout"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:text-primary-dark underline"
                                >
                                    complemento de inhabilitación para navegadores
                                </a>.
                            </p>

                            <h2>Contacto</h2>
                            <p>
                                Si tienes alguna pregunta sobre nuestra política de cookies o necesitas ayuda
                                para gestionar tus preferencias, puedes contactarnos a través de:
                            </p>
                            <ul>
                                <li>Email: <a href="mailto:contacto@grimmiz.com" className="text-primary hover:text-primary-dark underline">contacto@grimmiz.com</a></li>
                                <li>Formulario de contacto: <Link href="/contacto" className="text-primary hover:text-primary-dark underline">página de contacto</Link></li>
                            </ul>

                            <h2>Cambios en esta Política</h2>
                            <p>
                                Podemos actualizar esta política de cookies periódicamente. Te recomendamos
                                revisar esta página regularmente para estar informado de cualquier cambio.
                            </p>
                            <p>
                                Los cambios entrarán en vigor inmediatamente después de su publicación en esta página.
                            </p>

                            <div className="bg-green-50 border-l-4 border-green-500 p-6 mt-8 rounded-r-lg">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-lg font-semibold text-green-800 mb-2">
                                            Tus Derechos
                                        </h3>
                                        <p className="text-green-700">
                                            Tienes derecho a acceder, rectificar, suprimir y oponerte al tratamiento
                                            de tus datos personales. Para ejercer estos derechos, contacta con nosotros.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
