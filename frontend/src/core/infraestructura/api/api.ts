import axios from "axios";

// Cliente axios configurado para trabajar con HttpOnly cookies
export const apiClient = axios.create({
  baseURL: "/api",
  withCredentials: true, // Para cookies HTTP-only JWT
  headers: {
    "Content-Type": "application/json",
  },
});

  // Endpoints del backend
export const authAPI = {
  login: (data: import("../../dominio/tipos/api").UsuarioLoginDTO) =>
    apiClient.post("/auth/login", data),

  // Endpoints de usuarios
  usuarios: {
    getPsicologos: () =>
      apiClient.get<import("../../dominio/tipos/api").UsuarioInfoDTO[]>(
        "/usuarios/psicologos",
      ),
  },
  logout: () => apiClient.post("/auth/logout"),
  me: () => apiClient.get("/usuarios/me"),

  // Endpoints de registro
  psicologos: {
    register: (
      data: import("../../dominio/tipos/api").PsicologoRegisterRequestDTO,
    ) =>
      apiClient.post<
        import("../../dominio/tipos/api").PsicologoRegisterResponseDTO
      >("/psicologos", data),
  },
  propietarios: {
    register: (
      data: import("../../dominio/tipos/api").PropietarioRegisterRequestDTO,
    ) =>
      apiClient.post<
        import("../../dominio/tipos/api").PropietarioRegisterResponseDTO
      >("/propietarios", data),
  },

  // Locations endpoints
  locations: {
    getAll: (params?: { page?: number; size?: number; sort?: string[] }) =>
      apiClient.get<
        import("../../dominio/tipos/api").BackendPage<
          import("../../dominio/tipos/api").LocationResponseDTO
        >
      >("/locations", { params }),
    getById: (id: number) =>
      apiClient.get<import("../../dominio/tipos/api").LocationResponseDTO>(
        `/locations/${id}`,
      ),
    create: (
      data: import("../../dominio/tipos/api").LocationCreateRequestDTO,
    ) =>
      apiClient.post<import("../../dominio/tipos/api").LocationResponseDTO>(
        "/locations",
        data,
      ),
    update: (
      id: number,
      data: import("../../dominio/tipos/api").LocationCreateRequestDTO,
    ) =>
      apiClient.put<import("../../dominio/tipos/api").LocationResponseDTO>(
        `/locations/${id}`,
        data,
      ),
    deactivate: (id: number) => apiClient.patch(`/locations/${id}/deactivate`),
    activate: (id: number) => apiClient.patch(`/locations/${id}/activate`),
    getAllActive: () =>
      apiClient.get<import("../../dominio/tipos/api").LocationResponseDTO[]>(
        "/locations/active",
      ),
    getActiveWithActiveCubiculos: () =>
      apiClient.get<import("../../dominio/tipos/api").LocationResponseDTO[]>(
        "/locations/with-active-cubiculos",
      ),
  },

  // Cubículos endpoints
  cubiculos: {
    getAllByLocation: (
      locationId: number,
      params?: {
        page?: number;
        size?: number;
        sort?: string;
      },
    ) =>
      apiClient.get<import("../../dominio/tipos/api").CubiculoPage>(
        `/cubiculos/location/${locationId}`,
        { params },
      ),
    getActiveByLocation: (
      locationId: number,
      params?: {
        page?: number;
        size?: number;
        sort?: string;
      },
    ) =>
      apiClient.get<import("../../dominio/tipos/api").CubiculoPage>(
        `/cubiculos/location/${locationId}/active`,
        { params },
      ),
    getById: (id: number) =>
      apiClient.get<import("../../dominio/tipos/api").CubiculoResponse>(
        `/cubiculos/${id}`,
      ),
    create: (
      data: import("../../dominio/tipos/api").CubiculoCreateRequestDTO,
    ) =>
      apiClient.post<import("../../dominio/tipos/api").CubiculoResponse>(
        "/cubiculos",
        data,
      ),
    update: (
      id: number,
      data: import("../../dominio/tipos/api").CubiculoUpdateRequestDTO,
    ) =>
      apiClient.put<import("../../dominio/tipos/api").CubiculoResponse>(
        `/cubiculos/${id}`,
        data,
      ),
    activate: (id: number) => apiClient.patch(`/cubiculos/${id}/activate`),
    deactivate: (id: number) => apiClient.patch(`/cubiculos/${id}/deactivate`),
    getActiveByLocationPublic: (locationId: number) =>
      apiClient.get<import("../../dominio/tipos/api").CubiculoResponse[]>(
        `/cubiculos/location/${locationId}/active-public`,
      ),
    getAllActivePublic: () =>
      apiClient.get<import("../../dominio/tipos/api").CubiculoResponse[]>(
        "/cubiculos/active-public",
      ),
  },

  // Disponibilidades endpoints
  disponibilidades: {
    getByCubiculo: (cubiculoId: number) =>
      apiClient.get<import("../../dominio/tipos/api").DisponibilidadResponseDTO[]>(
        `/cubiculos/${cubiculoId}/disponibilidades`,
      ),
    create: (cubiculoId: number, data: import("../../dominio/tipos/api").DisponibilidadCreateRequestDTO[]) =>
      apiClient.post(`/cubiculos/${cubiculoId}/disponibilidades`, data),
    update: (cubiculoId: number, disponibilidadId: number, data: import("../../dominio/tipos/api").DisponibilidadUpdateRequestDTO) =>
      apiClient.put(`/cubiculos/${cubiculoId}/disponibilidades/${disponibilidadId}`, data),
    delete: (cubiculoId: number, disponibilidadId: number) =>
      apiClient.delete(`/cubiculos/${cubiculoId}/disponibilidades/${disponibilidadId}`),
    deleteAll: (cubiculoId: number) =>
      apiClient.delete(`/cubiculos/${cubiculoId}/disponibilidades`),
  },

  // Características endpoints
  caracteristicas: {
    getAll: () =>
      apiClient.get<import("../../dominio/tipos/api").CaracteristicaDTO[]>(
        "/caracteristicas",
      ),
  },

  // Suscripciones (planes) — solo ADMIN puede crear/editar/eliminar
  suscripciones: {
    getAll: () =>
      apiClient.get<import("../../dominio/tipos/api").SuscripcionDTO[]>("/suscripciones"),
    getById: (id: number) =>
      apiClient.get<import("../../dominio/tipos/api").SuscripcionDTO>(`/suscripciones/${id}`),
    getOrdenadosPorPrecio: () =>
      apiClient.get<import("../../dominio/tipos/api").SuscripcionDTO[]>("/suscripciones/ordenados-por-precio"),
    crear: (data: import("../../dominio/tipos/api").CrearSuscripcionRequest) =>
      apiClient.post<import("../../dominio/tipos/api").SuscripcionDTO>("/suscripciones", data),
    actualizar: (id: number, data: import("../../dominio/tipos/api").CrearSuscripcionRequest) =>
      apiClient.put<import("../../dominio/tipos/api").SuscripcionDTO>(`/suscripciones/${id}`, data),
    eliminar: (id: number) =>
      apiClient.delete(`/suscripciones/${id}`),
  },

  // Reservas endpoints
  reservas: {
    getMine: (filtro?: import("../../dominio/tipos/api").FiltroTemporal) =>
      apiClient.get<import("../../dominio/tipos/api").ReservaConsultaResponseDTO>("/reservas", {
        params: filtro ? { filtro } : undefined,
      }),
    crear: (data: import("../../dominio/tipos/api").ReservaCreateRequestDTO) =>
      apiClient.post<import("../../dominio/tipos/api").ReservaCreateResponseDTO>(
        "/reservas",
        data,
      ),
    cancelar: (id: number) => apiClient.delete(`/reservas/${id}`),
  },

  // FAQs endpoints
  faqs: {
    getCategorias: () =>
      apiClient.get<import("../../dominio/tipos/api").CategoriaFAQDTO[]>("/faqs/categorias"),
    getPreguntasByCategoria: (categoriaId: number) =>
      apiClient.get<import("../../dominio/tipos/api").PreguntaFAQDTO[]>(
        `/faqs/categorias/${categoriaId}/preguntas`,
      ),
    getAllCategoriesWithQuestions: () =>
      apiClient.get<import("../../dominio/tipos/api").CategoriaPreguntasDTO[]>(
        "/faqs/categorias-preguntas",
      ),
    searchPreguntas: (query: string) =>
      apiClient.get<import("../../dominio/tipos/api").PreguntaFAQDTO[]>(
        "/faqs/buscar",
        { params: { query } },
      ),
    // Admin CRUD endpoints
    createCategoria: (data: import("../../dominio/tipos/api").CreateUpdateCategoriaFaqDto) =>
      apiClient.post<import("../../dominio/tipos/api").CategoriaFAQDTO>(
        "/faqs/categorias",
        data,
      ),
    updateCategoria: (id: number, data: import("../../dominio/tipos/api").CreateUpdateCategoriaFaqDto) =>
      apiClient.put<import("../../dominio/tipos/api").CategoriaFAQDTO>(
        `/faqs/categorias/${id}`,
        data,
      ),
    deleteCategoria: (id: number) =>
      apiClient.delete(`/faqs/categorias/${id}`),
    createPregunta: (data: import("../../dominio/tipos/api").CreateUpdatePreguntaFaqDto) =>
      apiClient.post<import("../../dominio/tipos/api").PreguntaFAQDTO>(
        "/faqs/preguntas",
        data,
      ),
    updatePregunta: (id: number, data: import("../../dominio/tipos/api").CreateUpdatePreguntaFaqDto) =>
      apiClient.put<import("../../dominio/tipos/api").PreguntaFAQDTO>(
        `/faqs/preguntas/${id}`,
        data,
      ),
    deletePregunta: (id: number) =>
      apiClient.delete(`/faqs/preguntas/${id}`),
    getByFilter: (
      params?: import("../../dominio/tipos/api").ReservaFilterRequestDTO,
    ) =>
      apiClient.get<import("../../dominio/tipos/api").ReservaDTO[]>(
        "/reservas",
        { params },
      ),
  },
};
