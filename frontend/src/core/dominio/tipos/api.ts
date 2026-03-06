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

// Locations Module
export interface LocationCreateRequestDTO {
  name: string;
  description?: string;
  address: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
}

export interface LocationResponseDTO {
  id: number;
  name: string;
  description: string | null;
  address: string;
  latitude: number;
  longitude: number;
  active: boolean;
  imageUrl?: string | null;
}

// Paginación extendida del backend
export interface BackendPage<T> {
  content: T[];
  pageable: {
    paged: boolean;
    pageNumber: number;
    pageSize: number;
    unpaged: boolean;
    offset: number;
    sort: Array<{
      direction: string;
      nullHandling: string;
      ascending: boolean;
      property: string;
      ignoreCase: boolean;
    }>;
  };
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: Array<{
    direction: string;
    nullHandling: string;
    ascending: boolean;
    property: string;
    ignoreCase: boolean;
  }>;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// Paginación simple para frontend
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

// Cubículos Module
export const CaracteristicaNombre = {
  REFRIGERADO: "REFRIGERADO",
  SIN_VENTANAS_EXTERNAS: "SIN_VENTANAS_EXTERNAS",
  CLIMATIZACION: "CLIMATIZACION",
  VENTILACION_NATURAL: "VENTILACION_NATURAL",
  ILUMINACION_CALIDA: "ILUMINACION_CALIDA",
  ILUMINACION_REGULABLE: "ILUMINACION_REGULABLE",
  TEMPERATURA_CONTROLABLE: "TEMPERATURA_CONTROLABLE",
  SILLON_PARA_PACIENTE: "SILLON_PARA_PACIENTE",
  SILLON_PARA_PSICOLOGO: "SILLON_PARA_PSICOLOGO",
  ESCRITORIO: "ESCRITORIO",
  MESA_AUXILIAR: "MESA_AUXILIAR",
  LIBRERO: "LIBRERO",
  SOFA: "SOFA",
  RELOJ_SILENCIOSO: "RELOJ_SILENCIOSO",
  PIZARRON: "PIZARRON",
  CONEXION_INTERNET: "CONEXION_INTERNET",
  CAMARA_SEGURIDAD_EXTERNA: "CAMARA_SEGURIDAD_EXTERNA",
  ENCHUFES_DISPONIBLES: "ENCHUFES_DISPONIBLES",
} as const;

export type CaracteristicaNombre =
  (typeof CaracteristicaNombre)[keyof typeof CaracteristicaNombre];

export interface CaracteristicaDTO {
  id: number;
  nombre: CaracteristicaNombre;
}

export interface CubiculoCreateRequestDTO {
  locationId: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  imageUrl?: string;
  caracteristicasIds?: number[];
  active?: boolean;
  disponibilidades?: DisponibilidadCreateRequestDTO[];
}

export interface CubiculoUpdateRequestDTO {
  nombre?: string;
  descripcion?: string;
  precio?: number;
  imageUrl?: string;
  caracteristicasIds?: number[] | null;
  active?: boolean;
}

export interface CubiculoResponse {
  id: number;
  locationId: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imageUrl: string;
  caracteristicas: CaracteristicaDTO[];
  isActive: boolean;
}

export type DiaSemana =
  | "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY"
  | "FRIDAY" | "SATURDAY" | "SUNDAY";

export interface DisponibilidadResponseDTO {
  id: number;
  diaSemana: DiaSemana;
  horaInicio: string; // "HH:mm"
  horaFin: string;    // "HH:mm"
}

export interface DisponibilidadCreateRequestDTO {
  diaSemana: DiaSemana;
  horaInicio: string;
  horaFin: string;
}

export interface DisponibilidadUpdateRequestDTO {
  diaSemana: DiaSemana;
  horaInicio: string;
  horaFin: string;
}

// ─── Suscripciones ────────────────────────────────────────────────────────────
export interface SuscripcionDTO {
  id: number;
  nombre: string;
  precio: number;
  cubiculosActivosPermitidos: number;
  comisionPorcentaje: number;
  descripcion?: string;
}

export interface CrearSuscripcionRequest {
  nombre: string;
  precio: number;
  cubiculosActivosPermitidos: number;
  comisionPorcentaje: number;
  descripcion?: string;
}

// ─── Reservas ────────────────────────────────────────────────────────────────
export const EstadoReserva = {
  PENDIENTE: "PENDIENTE",
  RECHAZADO: "RECHAZADO",
  CONFIRMADA: "CONFIRMADA",
  CANCELADA: "CANCELADA",
  FINALIZADA: "FINALIZADA",
} as const;
export type EstadoReserva = (typeof EstadoReserva)[keyof typeof EstadoReserva];

export interface ReservaCreateRequestDTO {
  cubiculoId: number;
  /** ISO 8601: "2026-03-10T09:00:00" */
  inicio: string;
  /** ISO 8601: "2026-03-10T11:00:00" */
  fin: string;
  notas?: string;
}

export interface ReservaDTO {
  id: number;
  cubiculoId: number;
  cubiculoNombre: string;
  psicologoId: number;
  inicio: string;
  fin: string;
  notas?: string;
  estadoReserva: EstadoReserva;
  createdAt: string;
}

export interface PagoResponse {
  id: string;
  monto: number;
  moneda: string;
  estado: string;
  estadoDescripcion: string;
  metodoPago?: string;
  descripcion?: string;
  requiereFactura: boolean;
  fechaExpiracion?: string;
  createdAt: string;
}

export interface ReservaCreateResponseDTO {
  reservaDTO: ReservaDTO;
  cubiculoDTO: CubiculoResponse;
  pagoDTO: PagoResponse;
}

// Para la paginación extendida de cubículos
export interface CubiculoPage extends Page<CubiculoResponse> {
  content: CubiculoResponse[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
    };
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
