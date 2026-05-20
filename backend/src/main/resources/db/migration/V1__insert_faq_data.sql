-- Insert categorías de FAQs
INSERT INTO faq_categorias (nombre, descripcion, orden, activa, icono, created_at, updated_at) VALUES
('Uso del Sistema', 'Preguntas sobre cómo usar la plataforma', 1, true, 'HelpCircle', NOW(), NOW()),
('Reservas', 'Todo sobre cómo hacer y gestionar reservas', 2, true, 'BookOpen', NOW(), NOW()),
('Pagos', 'Preguntas sobre pagos y facturación', 3, true, 'CreditCard', NOW(), NOW()),
('Documentacion', 'Información sobre documentos y certificados', 4, true, 'FileText', NOW(), NOW()),
('Configuracion', 'Opciones de configuración y preferencias', 5, true, 'Settings', NOW(), NOW()),
('Seguridad', 'Preguntas sobre seguridad y privacidad', 6, true, 'Lock', NOW(), NOW());

-- Insert preguntas para cada categoría
-- Categoría: Uso del Sistema
INSERT INTO faq_preguntas (categoria_id, pregunta, respuesta, orden, activa, created_at, updated_at) VALUES
((SELECT id FROM faq_categorias WHERE nombre = 'Uso del Sistema'),
 '¿Qué es MentalSpaces?',
 'MentalSpaces es una plataforma integral para administrar centros de consulta psicológica, permitiendo reservar cubículos, gestionar pagos y documentación profesional.',
 1, true, NOW(), NOW()),

((SELECT id FROM faq_categorias WHERE nombre = 'Uso del Sistema'),
 '¿Cómo inicio sesión?',
 'Ingresa a la página de login con tu usuario y contraseña. También puedes usar tu cuenta de Google para acceso rápido. Si olvidaste tu contraseña, hay una opción de recuperación en la misma página.',
 2, true, NOW(), NOW()),

((SELECT id FROM faq_categorias WHERE nombre = 'Uso del Sistema'),
 '¿Cómo cambio mi contraseña?',
 'Ve a Configuración > Mi Perfil > Seguridad > Cambiar contraseña. Ingresa tu contraseña actual, la nueva contraseña y confirma el cambio.',
 3, true, NOW(), NOW()),

-- Categoría: Reservas
((SELECT id FROM faq_categorias WHERE nombre = 'Reservas'),
 '¿Cómo hago una reserva?',
 '1. Ve a ''Buscar Cubículos''
2. Selecciona la ubicación deseada
3. Elige la fecha y hora disponible
4. Revisa los detalles del cubículo
5. Confirma y realiza el pago
6. Recibirás confirmación por correo',
 1, true, NOW(), NOW()),

((SELECT id FROM faq_categorias WHERE nombre = 'Reservas'),
 '¿Puedo cancelar una reserva?',
 'Sí, puedes cancelar desde ''Mis Reservas''. El reembolso depende de cuándo canceles:
- Más de 24 horas antes: 100% de reembolso
- Entre 12-24 horas: 50% de reembolso
- Menos de 12 horas: Sin reembolso',
 2, true, NOW(), NOW()),

((SELECT id FROM faq_categorias WHERE nombre = 'Reservas'),
 '¿Qué pasa si llego tarde a mi reserva?',
 'Si llegas más de 15 minutos tarde, la reserva se considerará como no presentada y no habrá reembolso. El tiempo restante no se recupera.',
 3, true, NOW(), NOW()),

-- Categoría: Pagos
((SELECT id FROM faq_categorias WHERE nombre = 'Pagos'),
 '¿Qué métodos de pago aceptan?',
 'Aceptamos:
- Tarjetas de crédito (Visa, Mastercard, American Express)
- Transferencia bancaria
- PayPal
- Billeteras digitales (Apple Pay, Google Pay)',
 1, true, NOW(), NOW()),

((SELECT id FROM faq_categorias WHERE nombre = 'Pagos'),
 '¿Cómo descargo mi recibo?',
 'Ve a ''Mis Pagos'' y encuentra la transacción. Haz clic en ''Descargar Recibo'' para obtener el PDF. Si necesitas una factura formal, ve a ''Configuración de Facturación''.',
 2, true, NOW(), NOW()),

((SELECT id FROM faq_categorias WHERE nombre = 'Pagos'),
 '¿Hay suscripciones disponibles?',
 'Sí, ofrecemos planes de suscripción mensual con descuentos. Accede desde ''Mi Perfil'' > ''Suscripción''. Puedes cambiar o cancelar en cualquier momento.',
 3, true, NOW(), NOW()),

-- Categoría: Documentación
((SELECT id FROM faq_categorias WHERE nombre = 'Documentacion'),
 '¿Qué documentos necesito subir?',
 'Depende de tu rol:

Psicólogos:
- Identificación oficial (cédula o pasaporte)
- Título profesional o diploma
- Cédula profesional

Propietarios:
- Identificación oficial
- RFC
- Documentos de propiedad',
 1, true, NOW(), NOW()),

((SELECT id FROM faq_categorias WHERE nombre = 'Documentacion'),
 '¿Cuáles son los formatos aceptados?',
 'Aceptamos: PDF, JPG, PNG
Tamaño máximo: 10 MB por documento
Resolución mínima: 200 DPI',
 2, true, NOW(), NOW()),

((SELECT id FROM faq_categorias WHERE nombre = 'Documentacion'),
 '¿Cuánto tarda la validación de documentos?',
 'Generalmente 2-3 días hábiles. Recibirás notificaciones sobre el estado de la validación. Si algo no está claro, te contactaremos.',
 3, true, NOW(), NOW()),

-- Categoría: Configuración
((SELECT id FROM faq_categorias WHERE nombre = 'Configuracion'),
 '¿Cómo actualizo mi perfil?',
 'Ve a ''Mi Perfil'' y edita los campos que desees actualizar. Puedes cambiar foto de perfil, biografía, email y más. Guarda los cambios al finalizar.',
 1, true, NOW(), NOW()),

((SELECT id FROM faq_categorias WHERE nombre = 'Configuracion'),
 '¿Cómo activo notificaciones?',
 'Ve a ''Configuración'' > ''Notificaciones''. Aquí puedes activar/desactivar:
- Notificaciones de reserva
- Cambios en cubículos
- Recordatorios de pagos
- Actualizaciones de documentos',
 2, true, NOW(), NOW()),

((SELECT id FROM faq_categorias WHERE nombre = 'Configuracion'),
 '¿Puedo cambiar el idioma de la interfaz?',
 'Actualmente, la interfaz está disponible en español. Estamos trabajando en agregar más idiomas próximamente.',
 3, true, NOW(), NOW()),

-- Categoría: Seguridad
((SELECT id FROM faq_categorias WHERE nombre = 'Seguridad'),
 '¿Mis datos están seguros?',
 'Sí. Usamos encriptación SSL/TLS de 256 bits, cumplimos con GDPR, y tus datos se almacenan en servidores seguros. Nunca compartimos información personal con terceros sin tu consentimiento.',
 1, true, NOW(), NOW()),

((SELECT id FROM faq_categorias WHERE nombre = 'Seguridad'),
 '¿Cómo activo autenticación de dos factores?',
 'Ve a ''Configuración'' > ''Seguridad'' > ''Autenticación de dos factores''. Sigue las instrucciones para configurar con una app de autenticación como Google Authenticator.',
 2, true, NOW(), NOW()),

((SELECT id FROM faq_categorias WHERE nombre = 'Seguridad'),
 '¿Qué pasa si pierdo acceso a mi cuenta?',
 'Contacta a soporte y verifica tu identidad. Podemos ayudarte a recuperar acceso verificando tu email registrado. El proceso tarda 24-48 horas.',
 3, true, NOW(), NOW());

