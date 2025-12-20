import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Política de Privacidad | Grimmiz',
    description: 'Conoce cómo Grimmiz recopila, utiliza y protege tu información personal. Tu privacidad es importante para nosotros.',
}

export default function PrivacyPolicyPage() {
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
                            <span className="text-grimmiz-text font-medium">Política de Privacidad</span>
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
                            <h1>🛡️ Política de Privacidad</h1>

                            <div className="bg-blue-50 border-l-4 border-blue-500 p-8 mb-12 rounded-r-lg">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-blue-800">
                                            <strong>Última actualización:</strong> 20 de diciembre de 2025
                                        </p>
                                        <p className="text-sm text-blue-700 mt-1">
                                            Esta política explica cómo recopilamos, usamos y protegemos tu información personal.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <h2>1. Información que Recopilamos</h2>

                            <h3>Información que nos proporcionas directamente</h3>
                            <ul>
                                <li><strong>Información de contacto:</strong> Nombre, dirección de correo electrónico, número de teléfono cuando te registras o realizas una compra.</li>
                                <li><strong>Información de la cuenta:</strong> Datos de registro cuando creas una cuenta en nuestro sitio.</li>
                                <li><strong>Información de pedidos:</strong> Detalles de productos, dirección de envío y facturación cuando realizas compras.</li>
                                <li><strong>Comunicaciones:</strong> Mensajes que nos envías a través de formularios de contacto, correos electrónicos o chat.</li>
                            </ul>

                            <h3>Información que recopilamos automáticamente</h3>
                            <ul>
                                <li><strong>Información técnica:</strong> Dirección IP, tipo de navegador, sistema operativo, páginas visitadas, tiempo de visita.</li>
                                <li><strong>Cookies y tecnologías similares:</strong> Para más información, consulta nuestra <Link href="/politica-cookies" className="text-primary hover:text-primary-dark underline">Política de Cookies</Link>.</li>
                                <li><strong>Información de uso:</strong> Cómo interactúas con nuestro sitio web, productos que ves, tiempo en cada página.</li>
                            </ul>

                            <h2>2. Cómo Utilizamos tu Información</h2>
                            <p>Utilizamos la información que recopilamos para:</p>
                            <ul>
                                <li><strong>Procesar pedidos:</strong> Gestionar tus compras, pagos y envíos.</li>
                                <li><strong>Mejorar nuestros servicios:</strong> Analizar cómo usas nuestro sitio para mejorar la experiencia del usuario.</li>
                                <li><strong>Comunicaciones:</strong> Enviarte confirmaciones de pedidos, actualizaciones de envío y respuestas a tus consultas.</li>
                                <li><strong>Marketing:</strong> Enviarte información sobre productos similares o promociones (solo con tu consentimiento).</li>
                                <li><strong>Seguridad:</strong> Proteger nuestro sitio web y prevenir fraudes.</li>
                                <li><strong>Cumplimiento legal:</strong> Cumplir con obligaciones legales y regulatorias.</li>
                            </ul>

                            <h2>3. Compartir tu Información</h2>
                            <p>No vendemos, alquilamos ni compartimos tu información personal con terceros, excepto en las siguientes situaciones:</p>

                            <h3>Proveedores de servicios</h3>
                            <p>Compartimos información con proveedores de servicios que nos ayudan a operar nuestro negocio:</p>
                            <ul>
                                <li><strong>Procesadores de pagos:</strong> Para procesar tus pagos de forma segura.</li>
                                <li><strong>Empresas de envío:</strong> Para entregar tus pedidos.</li>
                                <li><strong>Proveedores de hosting:</strong> Para almacenar y procesar datos.</li>
                                <li><strong>Herramientas de análisis:</strong> Para mejorar nuestro sitio web.</li>
                            </ul>

                            <h3>Requisitos legales</h3>
                            <p>Podemos compartir tu información si:</p>
                            <ul>
                                <li>Es requerido por ley o por una orden judicial.</li>
                                <li>Es necesario para proteger nuestros derechos o los de otros.</li>
                                <li>Es necesario para investigar actividades fraudulentas o ilegales.</li>
                            </ul>

                            <h2>4. Tus Derechos</h2>
                            <p>Tienes los siguientes derechos respecto a tus datos personales:</p>

                            <h3>Derecho de acceso</h3>
                            <p>Puedes solicitar una copia de la información personal que tenemos sobre ti.</p>

                            <h3>Derecho de rectificación</h3>
                            <p>Puedes solicitar la corrección de información inexacta o incompleta.</p>

                            <h3>Derecho de supresión</h3>
                            <p>Puedes solicitar la eliminación de tus datos personales en ciertas circunstancias.</p>

                            <h3>Derecho a la portabilidad</h3>
                            <p>Puedes solicitar que te proporcionemos tus datos en un formato estructurado.</p>

                            <h3>Derecho a la limitación del tratamiento</h3>
                            <p>Puedes solicitar que limitemos el procesamiento de tus datos en ciertas situaciones.</p>

                            <h3>Derecho de oposición</h3>
                            <p>Puedes oponerte al procesamiento de tus datos para fines de marketing directo.</p>

                            <h3>Derecho a retirar el consentimiento</h3>
                            <p>Puedes retirar tu consentimiento en cualquier momento cuando el procesamiento se base en el consentimiento.</p>

                            <h2>5. Seguridad de los Datos</h2>
                            <p>Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger tu información personal contra pérdida, uso indebido, acceso no autorizado, divulgación, alteración o destrucción. Estas medidas incluyen:</p>
                            <ul>
                                <li>Encriptación de datos sensibles en tránsito y en reposo.</li>
                                <li>Controles de acceso restringidos a la información personal.</li>
                                <li>Monitoreo regular de nuestros sistemas para detectar vulnerabilidades.</li>
                                <li>Actualizaciones regulares de software y parches de seguridad.</li>
                            </ul>

                            <h2>6. Retención de Datos</h2>
                            <p>Retenemos tu información personal solo durante el tiempo necesario para cumplir con los fines para los que fue recopilada, incluyendo cualquier requisito legal, contable o de informes. Los períodos específicos de retención dependen del tipo de información y el propósito del procesamiento.</p>

                            <h2>7. Transferencias Internacionales</h2>
                            <p>Tu información puede ser transferida y procesada en países diferentes al tuyo. Cuando transferimos información personal fuera de tu país, implementamos medidas de protección adecuadas para garantizar que tu información esté protegida de acuerdo con esta política de privacidad.</p>

                            <h2>8. Enlaces a Otros Sitios Web</h2>
                            <p>Nuestro sitio web puede contener enlaces a otros sitios web. No somos responsables de las prácticas de privacidad o el contenido de esos sitios web. Te recomendamos revisar las políticas de privacidad de cualquier sitio web que visites.</p>

                            <h2>9. Privacidad de Menores</h2>
                            <p>Nuestro sitio web no está dirigido a menores de 16 años. No recopilamos conscientemente información personal de menores de 16 años. Si descubrimos que hemos recopilado información personal de un menor de 16 años, eliminaremos esa información inmediatamente.</p>

                            <h2>10. Cambios a esta Política de Privacidad</h2>
                            <p>Podemos actualizar esta política de privacidad de vez en cuando. Cuando realicemos cambios significativos, te notificaremos mediante un aviso destacado en nuestro sitio web o enviándote un correo electrónico. El uso continuado de nuestro sitio web después de dichos cambios constituirá tu aceptación de la política actualizada.</p>

                            <h2>11. Contacto</h2>
                            <p>Si tienes preguntas sobre esta política de privacidad o deseas ejercer tus derechos, puedes contactarnos:</p>

                            <div className="bg-gray-50 p-8 rounded-lg mt-10 mb-8">
                                <h3 className="font-semibold text-grimmiz-text mb-6 text-lg">Información de Contacto</h3>
                                <div className="space-y-4 text-base">
                                    <p><strong className="text-grimmiz-text">Email:</strong> privacidad@grimmiz.com</p>
                                    <p><strong className="text-grimmiz-text">Dirección:</strong> [Tu dirección aquí]</p>
                                    <p><strong className="text-grimmiz-text">Teléfono:</strong> [Tu teléfono aquí]</p>
                                </div>
                            </div>

                            <p className="mt-8 mb-6 text-base text-gray-600 leading-relaxed">
                                Para ejercer tus derechos de protección de datos, incluye suficiente información para identificarte y especifica qué derecho deseas ejercer. Responderemos a tu solicitud dentro de los plazos legales aplicables.
                            </p>

                            <div className="bg-green-50 border-l-4 border-green-500 p-8 mt-12 rounded-r-lg">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-lg font-semibold text-green-800 mb-2">
                                            Tu Privacidad es Nuestra Prioridad
                                        </h3>
                                        <p className="text-green-700">
                                            En Grimmiz nos comprometemos a proteger tu privacidad y a ser transparentes sobre cómo utilizamos tu información. Si tienes alguna duda sobre esta política, no dudes en contactarnos.
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