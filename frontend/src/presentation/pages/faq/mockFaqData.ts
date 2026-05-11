import type {
  CategoriaFAQDTO,
  PreguntaFAQDTO,
  CategoriaPreguntasDTO,
} from "../../core/dominio/tipos/api";

// Datos mockados para pruebas y desarrollo
export const MOCK_FAQ_DATA: CategoriaPreguntasDTO[] = [
  {
    categoria: {
      id: 1,
      nombre: "Uso del Sistema",
      descripcion: "Preguntas sobre cómo usar la plataforma",
      orden: 1,
      activa: true,
    },
    preguntas: [
      {
        id: 1,
        categoriaId: 1,
        pregunta: "¿Qué es MentalSpaces?",
        respuesta:
          "MentalSpaces es una plataforma integral para administrar centros de consulta psicológica, permitiendo reservar cubículos, gestionar pagos y documentación profesional.",
        orden: 1,
        activa: true,
      },
      {
        id: 2,
        categoriaId: 1,
        pregunta: "¿Cómo inicio sesión?",
        respuesta:
          "Ingresa a la página de login con tu usuario y contraseña. También puedes usar tu cuenta de Google para acceso rápido. Si olvidaste tu contraseña, hay una opción de recuperación en la misma página.",
        orden: 2,
        activa: true,
      },
      {
        id: 3,
        categoriaId: 1,
        pregunta: "¿Cómo cambio mi contraseña?",
        respuesta:
          "Ve a Configuración > Mi Perfil > Seguridad > Cambiar contraseña. Ingresa tu contraseña actual, la nueva contraseña y confirma el cambio.",
        orden: 3,
        activa: true,
      },
    ],
  },
  {
    categoria: {
      id: 2,
      nombre: "Reservas",
      descripcion: "Todo sobre cómo hacer y gestionar reservas",
      orden: 2,
      activa: true,
    },
    preguntas: [
      {
        id: 4,
        categoriaId: 2,
        pregunta: "¿Cómo hago una reserva?",
        respuesta:
          "1. Ve a 'Buscar Cubículos'\n2. Selecciona la ubicación deseada\n3. Elige la fecha y hora disponible\n4. Revisa los detalles del cubículo\n5. Confirma y realiza el pago\n6. Recibirás confirmación por correo",
        orden: 1,
        activa: true,
      },
      {
        id: 5,
        categoriaId: 2,
        pregunta: "¿Puedo cancelar una reserva?",
        respuesta:
          "Sí, puedes cancelar desde 'Mis Reservas'. El reembolso depende de cuándo canceles:\n- Más de 24 horas antes: 100% de reembolso\n- Entre 12-24 horas: 50% de reembolso\n- Menos de 12 horas: Sin reembolso",
        orden: 2,
        activa: true,
      },
      {
        id: 6,
        categoriaId: 2,
        pregunta: "¿Qué pasa si llego tarde a mi reserva?",
        respuesta:
          "Si llegas más de 15 minutos tarde, la reserva se considerará como no presentada y no habrá reembolso. El tiempo restante no se recupera.",
        orden: 3,
        activa: true,
      },
    ],
  },
  {
    categoria: {
      id: 3,
      nombre: "Pagos",
      descripcion: "Preguntas sobre pagos y facturación",
      orden: 3,
      activa: true,
    },
    preguntas: [
      {
        id: 7,
        categoriaId: 3,
        pregunta: "¿Qué métodos de pago aceptan?",
        respuesta:
          "Aceptamos:\n- Tarjetas de crédito (Visa, Mastercard, American Express)\n- Transferencia bancaria\n- PayPal\n- Billeteras digitales (Apple Pay, Google Pay)",
        orden: 1,
        activa: true,
      },
      {
        id: 8,
        categoriaId: 3,
        pregunta: "¿Cómo descargo mi recibo?",
        respuesta:
          "Ve a 'Mis Pagos' y encuentra la transacción. Haz clic en 'Descargar Recibo' para obtener el PDF. Si necesitas una factura formal, ve a 'Configuración de Facturación'.",
        orden: 2,
        activa: true,
      },
      {
        id: 9,
        categoriaId: 3,
        pregunta: "¿Hay suscripciones disponibles?",
        respuesta:
          "Sí, ofrecemos planes de suscripción mensual con descuentos. Accede desde 'Mi Perfil' > 'Suscripción'. Puedes cambiar o cancelar en cualquier momento.",
        orden: 3,
        activa: true,
      },
    ],
  },
  {
    categoria: {
      id: 4,
      nombre: "Documentacion",
      descripcion: "Información sobre documentos y certificados",
      orden: 4,
      activa: true,
    },
    preguntas: [
      {
        id: 10,
        categoriaId: 4,
        pregunta: "¿Qué documentos necesito subir?",
        respuesta:
          "Depende de tu rol:\n\nPsicólogos:\n- Identificación oficial (cédula o pasaporte)\n- Título profesional o diploma\n- Cédula profesional\n\nPropietarios:\n- Identificación oficial\n- RFC\n- Documentos de propiedad",
        orden: 1,
        activa: true,
      },
      {
        id: 11,
        categoriaId: 4,
        pregunta: "¿Cuáles son los formatos aceptados?",
        respuesta:
          "Aceptamos: PDF, JPG, PNG\nTamaño máximo: 10 MB por documento\nResolución mínima: 200 DPI",
        orden: 2,
        activa: true,
      },
      {
        id: 12,
        categoriaId: 4,
        pregunta: "¿Cuánto tarda la validación de documentos?",
        respuesta:
          "Generalmente 2-3 días hábiles. Recibirás notificaciones sobre el estado de la validación. Si algo no está claro, te contactaremos.",
        orden: 3,
        activa: true,
      },
    ],
  },
  {
    categoria: {
      id: 5,
      nombre: "Configuracion",
      descripcion: "Opciones de configuración y preferencias",
      orden: 5,
      activa: true,
    },
    preguntas: [
      {
        id: 13,
        categoriaId: 5,
        pregunta: "¿Cómo actualizo mi perfil?",
        respuesta:
          "Ve a 'Mi Perfil' y edita los campos que desees actualizar. Puedes cambiar foto de perfil, biografía, email y más. Guarda los cambios al finalizar.",
        orden: 1,
        activa: true,
      },
      {
        id: 14,
        categoriaId: 5,
        pregunta: "¿Cómo activo notificaciones?",
        respuesta:
          "Ve a 'Configuración' > 'Notificaciones'. Aquí puedes activar/desactivar:\n- Notificaciones de reserva\n- Cambios en cubículos\n- Recordatorios de pagos\n- Actualizaciones de documentos",
        orden: 2,
        activa: true,
      },
      {
        id: 15,
        categoriaId: 5,
        pregunta: "¿Puedo cambiar el idioma de la interfaz?",
        respuesta:
          "Actualmente, la interfaz está disponible en español. Estamos trabajando en agregar más idiomas próximamente.",
        orden: 3,
        activa: true,
      },
    ],
  },
  {
    categoria: {
      id: 6,
      nombre: "Seguridad",
      descripcion: "Preguntas sobre seguridad y privacidad",
      orden: 6,
      activa: true,
    },
    preguntas: [
      {
        id: 16,
        categoriaId: 6,
        pregunta: "¿Mis datos están seguros?",
        respuesta:
          "Sí. Usamos encriptación SSL/TLS de 256 bits, cumplimos con GDPR, y tus datos se almacenan en servidores seguros. Nunca compartimos información personal con terceros sin tu consentimiento.",
        orden: 1,
        activa: true,
      },
      {
        id: 17,
        categoriaId: 6,
        pregunta: "¿Cómo activo autenticación de dos factores?",
        respuesta:
          "Ve a 'Configuración' > 'Seguridad' > 'Autenticación de dos factores'. Sigue las instrucciones para configurar con una app de autenticación como Google Authenticator.",
        orden: 2,
        activa: true,
      },
      {
        id: 18,
        categoriaId: 6,
        pregunta: "¿Qué pasa si pierdo acceso a mi cuenta?",
        respuesta:
          "Contacta a soporte y verifica tu identidad. Podemos ayudarte a recuperar acceso verificando tu email registrado. El proceso tarda 24-48 horas.",
        orden: 3,
        activa: true,
      },
    ],
  },
];

// Función para proporcionar datos mockados en pruebas
export const useMockFaqData = () => {
  return {
    categorias: MOCK_FAQ_DATA.map((item) => item.categoria),
    preguntasByCategoria: MOCK_FAQ_DATA.reduce(
      (acc, item) => ({
        ...acc,
        [item.categoria.id]: item.preguntas,
      }),
      {} as Record<number, PreguntaFAQDTO[]>
    ),
    allData: MOCK_FAQ_DATA,
  };
};

