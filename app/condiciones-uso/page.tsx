import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Condiciones de Uso | Grimmiz',
    description: 'Lee los términos y condiciones de uso de Grimmiz. Conoce las reglas que aplican a tu uso de nuestro sitio web y servicios.',
}

export default function TermsOfUsePage() {
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
                            <span className="text-grimmiz-text font-medium">Condiciones de Uso</span>
                        </nav>
                    </div>
                </div>

                {/* Content */}
                <div className="py-16 bg-white">
                    <div className="container mx-auto px-6 max-w-5xl">
                        <div className="prose prose-xl prose-gray max-w-none
                                        [&>h1]:text-4xl [&>h1]:md:text-5xl [&>h1]:font-bold [&>h1]:text-grimmiz-text [&>h1]:leading-tight [&>h1]:mt-16 [&>h1]:mb-8 [&>h1]:text-center
                                        [&>h2]:text-3xl [&>h2]:md:text-4xl [&>h2]:font-bold [&>h2]:text-grimmiz-text [&>h2]:leading-tight [&>h2]:mt-16 [&>h2]:mb-8 [&>h2]:border-b-2 [&>h2]:border-primary/20 [&>h2]:pb-4
                                        [&>h3]:text-2xl [&>h3]:md:text-3xl [&>h3]:font-bold [&>h3]:text-grimmiz-text [&>h3]:leading-tight [&>h3]:mt-12 [&>h3]:mb-6
                                        [&>p]:text-lg [&>p]:text-grimmiz-text-secondary [&>p]:leading-relaxed [&>p]:mb-8 [&>p]:last:mb-0
                                        [&>ul]:list-disc [&>ul]:list-inside [&>ul]:space-y-4 [&>ul]:my-10 [&>ul]:text-lg [&>ul]:text-grimmiz-text-secondary [&>ul]:ml-6
                                        [&>ol]:list-decimal [&>ol]:list-inside [&>ol]:space-y-4 [&>ol]:my-10 [&>ol]:text-lg [&>ol]:text-grimmiz-text-secondary [&>ol]:ml-6
                                        [&>li]:leading-relaxed
                                        [&>strong]:font-bold [&>strong]:text-grimmiz-text
                                        [&>a]:text-primary [&>a]:font-medium [&>a]:hover:text-primary-dark [&>a]:transition-colors [&>a]:duration-200 [&>a]:underline [&>a]:decoration-2 [&>a]:decoration-primary/30 [&>a]:hover:decoration-primary/60 [&>a]:underline-offset-2
                                        [&>blockquote]:my-12 [&>blockquote]:py-6 [&>blockquote]:px-8 [&>blockquote]:bg-blue-50 [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:rounded-r-lg">
                            <h1 className="text-4xl font-bold text-grimmiz-text mb-8 text-center">
                                📋 Condiciones de Uso
                            </h1>

                            <div className="bg-blue-50 border-l-4 border-blue-500 p-8 mb-12 rounded-r-lg">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-blue-800">
                                            <strong>Última actualización:</strong> 20 de diciembre de 2025
                                        </p>
                                        <p className="text-sm text-blue-700 mt-1">
                                            Estas condiciones rigen tu uso de nuestro sitio web y servicios.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <h2>1. Aceptación de los Términos</h2>
                            <p>
                                Al acceder y utilizar el sitio web de Grimmiz (&quot;nosotros&quot;, &quot;nuestro&quot; o &quot;Grimmiz&quot;), aceptas estar sujeto
                                a estos términos y condiciones de uso (&quot;Términos&quot;). Si no estás de acuerdo con estos Términos,
                                no debes utilizar nuestro sitio web.
                            </p>
                            <p>
                                Estos Términos aplican a todos los visitantes, usuarios y otras personas que accedan o utilicen nuestro sitio web.
                            </p>

                            <h2>2. Descripción del Servicio</h2>
                            <p>
                                Grimmiz es una tienda online especializada en productos de manualidades hechos a mano. Ofrecemos:
                            </p>
                            <ul>
                                <li>Venta de productos artesanales y de manualidades</li>
                                <li>Información sobre técnicas de manualidades en nuestro blog</li>
                                <li>Comunidad de creadores y artistas</li>
                                <li>Servicio de atención al cliente</li>
                            </ul>

                            <h2>3. Uso Aceptable</h2>
                            <p>Al utilizar nuestro sitio web, te comprometes a:</p>

                            <h3>Uso Permitido</h3>
                            <ul>
                                <li>Utilizar el sitio web únicamente para fines legales y de acuerdo con estos Términos</li>
                                <li>Proporcionar información veraz y actualizada</li>
                                <li>Respetar los derechos de propiedad intelectual de Grimmiz y terceros</li>
                                <li>No interferir con el funcionamiento normal del sitio web</li>
                            </ul>

                            <h3>Uso Prohibido</h3>
                            <p>No debes:</p>
                            <ul>
                                <li>Utilizar el sitio web para cualquier propósito ilegal o no autorizado</li>
                                <li>Transmitir virus, malware o código dañino</li>
                                <li>Intentar acceder sin autorización a nuestros sistemas</li>
                                <li>Utilizar robots, spiders o herramientas automáticas para acceder al sitio</li>
                                <li>Realizar compras fraudulentas o proporcionar información falsa</li>
                                <li>Violar cualquier ley o regulación aplicable</li>
                                <li>Interferir con la seguridad o integridad del sitio web</li>
                            </ul>

                            <h2>4. Cuentas de Usuario</h2>
                            <p>
                                Para acceder a ciertas funciones de nuestro sitio web, puedes necesitar crear una cuenta.
                                Eres responsable de mantener la confidencialidad de tu cuenta y contraseña.
                            </p>
                            <p>
                                Debes notificarnos inmediatamente si sospechas de cualquier uso no autorizado de tu cuenta.
                                No somos responsables de pérdidas causadas por el uso no autorizado de tu cuenta.
                            </p>

                            <h2>5. Productos y Precios</h2>
                            <p>
                                Nos esforzamos por mostrar información precisa sobre nuestros productos, incluyendo precios,
                                descripciones y disponibilidad. Sin embargo, podemos cometer errores ocasionales.
                            </p>
                            <p>
                                Nos reservamos el derecho de corregir errores, cambiar precios, cancelar pedidos o
                                modificar productos en cualquier momento sin previo aviso.
                            </p>

                            <h2>6. Pedidos y Pagos</h2>
                            <h3>Proceso de Compra</h3>
                            <ul>
                                <li>Todos los pedidos están sujetos a aceptación y disponibilidad</li>
                                <li>Los precios pueden cambiar sin previo aviso</li>
                                <li>Nos reservamos el derecho de rechazar cualquier pedido</li>
                            </ul>

                            <h3>Pagos</h3>
                            <ul>
                                <li>Aceptamos los métodos de pago especificados en nuestro sitio web</li>
                                <li>Los pagos se procesan de forma segura a través de proveedores certificados</li>
                                <li>Debes proporcionar información de pago exacta y completa</li>
                            </ul>

                            <h2>7. Envíos y Entregas</h2>
                            <p>
                                Las políticas de envío, costos y tiempos de entrega están disponibles en nuestro sitio web.
                                Los tiempos de entrega son aproximados y no garantizados.
                            </p>
                            <p>
                                No somos responsables de retrasos causados por factores fuera de nuestro control,
                                incluyendo pero no limitándose a condiciones climáticas, huelgas o problemas postales.
                            </p>

                            <h2>8. Devoluciones y Reembolsos</h2>
                            <p>
                                Nuestra política de devoluciones está disponible en nuestro sitio web. Los productos deben
                                devolverse en su condición original y dentro del período especificado.
                            </p>
                            <p>
                                Los reembolsos se procesarán según nuestra política de devoluciones. Los costos de envío
                                para devoluciones pueden ser responsabilidad del cliente.
                            </p>

                            <h2>9. Propiedad Intelectual</h2>
                            <h3>Contenido de Grimmiz</h3>
                            <p>
                                Todo el contenido de nuestro sitio web, incluyendo pero no limitándose a texto, gráficos,
                                logotipos, imágenes, audio, video y software, está protegido por derechos de autor,
                                marcas registradas y otras leyes de propiedad intelectual.
                            </p>

                            <h3>Tu Contenido</h3>
                            <p>
                                Al enviar contenido a nuestro sitio web (por ejemplo, reseñas, comentarios o imágenes),
                                nos otorgas una licencia no exclusiva, gratuita y transferible para usar, modificar,
                                publicar y distribuir dicho contenido.
                            </p>

                            <h2>10. Limitación de Responsabilidad</h2>
                            <p>
                                En la medida máxima permitida por la ley aplicable, Grimmiz no será responsable de
                                daños directos, indirectos, incidentales, especiales o consecuentes que resulten de:
                            </p>
                            <ul>
                                <li>El uso o la imposibilidad de usar nuestro sitio web</li>
                                <li>Errores, omisiones o inexactitudes en el contenido</li>
                                <li>Interrupciones, virus o otros problemas técnicos</li>
                                <li>Pérdida de datos o ganancias</li>
                            </ul>
                            <p>
                                Nuestra responsabilidad total por cualquier reclamación relacionada con estos Términos
                                no excederá el monto pagado por ti por los productos o servicios en cuestión.
                            </p>

                            <h2>11. Indemnización</h2>
                            <p>
                                Aceptas indemnizar y mantener indemne a Grimmiz, sus directores, empleados y agentes
                                de cualquier reclamación, demanda, pérdida, responsabilidad y gasto (incluyendo honorarios
                                de abogados) que surjan de tu uso del sitio web o violación de estos Términos.
                            </p>

                            <h2>12. Enlaces a Terceros</h2>
                            <p>
                                Nuestro sitio web puede contener enlaces a sitios web de terceros. No somos responsables
                                del contenido, políticas de privacidad o prácticas de esos sitios web. El uso de enlaces
                                a terceros es bajo tu propio riesgo.
                            </p>

                            <h2>13. Terminación</h2>
                            <p>
                                Podemos terminar o suspender tu acceso a nuestro sitio web inmediatamente, sin previo
                                aviso, por cualquier razón, incluyendo pero no limitándose a violaciones de estos Términos.
                            </p>
                            <p>
                                Al terminar tu acceso, cesarán todos los derechos y obligaciones bajo estos Términos,
                                excepto aquellos que por su naturaleza deban sobrevivir a la terminación.
                            </p>

                            <h2>14. Modificaciones a los Términos</h2>
                            <p>
                                Nos reservamos el derecho de modificar estos Términos en cualquier momento. Los cambios
                                entrarán en vigor inmediatamente después de su publicación en nuestro sitio web.
                            </p>
                            <p>
                                El uso continuado de nuestro sitio web después de los cambios constituirá tu aceptación
                                de los Términos modificados.
                            </p>

                            <h2>15. Ley Aplicable y Jurisdicción</h2>
                            <p>
                                Estos Términos se regirán e interpretarán de acuerdo con las leyes de España.
                                Cualquier disputa que surja de estos Términos estará sujeta a la jurisdicción exclusiva
                                de los tribunales de [tu ciudad/país].
                            </p>

                            <h2>16. Resolución de Disputas</h2>
                            <p>
                                Intentaremos resolver cualquier disputa de manera amistosa. Si no podemos resolver
                                la disputa, estará sujeta a los procedimientos legales aplicables en la jurisdicción
                                especificada anteriormente.
                            </p>

                            <h2>17. Divisibilidad</h2>
                            <p>
                                Si alguna disposición de estos Términos es considerada inválida o inaplicable,
                                las demás disposiciones permanecerán en pleno vigor y efecto.
                            </p>

                            <h2>18. Renuncia</h2>
                            <p>
                                El hecho de que no hagamos cumplir estrictamente cualquier disposición de estos
                                Términos no constituirá una renuncia a nuestro derecho de hacer cumplir dicha disposición
                                o cualquier otra disposición.
                            </p>

                            <h2>19. Acuerdo Completo</h2>
                            <p>
                                Estos Términos constituyen el acuerdo completo entre tú y Grimmiz con respecto
                                al uso de nuestro sitio web y reemplazan todos los acuerdos anteriores.
                            </p>

                            <h2>20. Contacto</h2>
                            <p>
                                Si tienes preguntas sobre estos Términos, puedes contactarnos:
                            </p>

                            <div className="bg-gray-50 p-8 rounded-lg mt-10 mb-8">
                                <h3 className="font-semibold text-grimmiz-text mb-6 text-lg">Información de Contacto</h3>
                                <div className="space-y-4 text-base">
                                    <p><strong className="text-grimmiz-text">Email:</strong> legal@grimmiz.com</p>
                                    <p><strong className="text-grimmiz-text">Dirección:</strong> [Tu dirección aquí]</p>
                                    <p><strong className="text-grimmiz-text">Teléfono:</strong> [Tu teléfono aquí]</p>
                                </div>
                            </div>

                            <p className="mt-8 mb-6 text-base text-gray-600 leading-relaxed">
                                Para asuntos legales específicos, te recomendamos consultar con un abogado calificado.
                                Estos términos son proporcionados únicamente con fines informativos.
                            </p>

                            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-8 mt-12 rounded-r-lg">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                                            Aviso Importante
                                        </h3>
                                        <p className="text-yellow-700">
                                            Estos términos y condiciones pueden cambiar. Te recomendamos revisarlos periódicamente.
                                            El uso continuado de nuestro sitio web implica la aceptación de estos términos.
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