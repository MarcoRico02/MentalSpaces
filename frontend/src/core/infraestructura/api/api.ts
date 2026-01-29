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
    getAll: () =>
      apiClient.get<import("../../dominio/tipos/api").LocationResponseDTO[]>(
        "/locations",
      ),
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
};
