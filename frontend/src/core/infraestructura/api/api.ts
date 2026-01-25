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
    register: (data: any) => apiClient.post("/psicologos", data),
  },
  propietarios: {
    register: (data: any) => apiClient.post("/propietarios", data),
  },
};
