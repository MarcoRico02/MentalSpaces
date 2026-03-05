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
};
