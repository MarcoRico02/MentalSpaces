// Auth DTOs
export interface UsuarioLoginDTO {
  username: string;
  password: string;
}

export interface UsuarioLoginResponseDTO {
  token: string;
}

// Registro DTOs
export interface UsuarioRegisterDTO {
  username: string;
  password: string;
  fullName: string;
  email: string;
}

export interface UsuarioRegisterResponseDTO {
  id: number;
  username: string;
  fullName: string;
  email: string;
}

export interface PsicologoRegisterRequestDTO {
  usuarioRegisterDTO: UsuarioRegisterDTO;
  professionalType: string;
}

export interface PsicologoRegisterResponseDTO {
  usuarioRegisterResponseDTO: UsuarioRegisterResponseDTO;
  professionalType: string;
}

export interface PropietarioRegisterRequestDTO {
  usuarioRegisterDTO: UsuarioRegisterDTO;
}

export interface PropietarioRegisterResponseDTO {
  usuarioRegisterResponseDTO: UsuarioRegisterResponseDTO;
}

// Info DTOs - Estructura real del backend
export interface UsuarioInfoDTO {
  id: number;
  username: string;
  fullName: string;
  email: string;
  bio?: string;
  profileImageUrl?: string;
  roles: RolNombre[]; // JSON convierte Set a array
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

export interface PsicologoInfoDTO {
  professionalType: string;
  identificationUrl: string;
  diplomaUrl: string;
  documentationStatus: DocumentationStatus;
}

export interface PropietarioInfoDTO {
  rfc: string;
  facturacionHabilitada: boolean;
}

export interface UsuarioMeResponseDTO {
  usuarioInfoDTO: UsuarioInfoDTO;
  psicologoInfoDTO?: PsicologoInfoDTO;
  propietarioInfoDTO?: PropietarioInfoDTO;
}

// Enums del backend
export const RolNombre = {
  PSICOLOGO: "PSICOLOGO",
  PROPIETARIO: "PROPIETARIO",
  ADMIN: "ADMIN",
} as const;

export type RolNombre = (typeof RolNombre)[keyof typeof RolNombre];

export const DocumentationStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type DocumentationStatus =
  (typeof DocumentationStatus)[keyof typeof DocumentationStatus];

// Paginación
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// Usuario completo
export interface Usuario {
  id: string;
  username: string;
  fullName: string;
  email: string;
  bio?: string;
  profileImageUrl?: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

// Tipos útiles
export type UserRole = "PSICOLOGO" | "PROPIETARIO" | "ADMIN";

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}
