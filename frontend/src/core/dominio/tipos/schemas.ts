import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "El nombre de usuario es requerido")
    .min(3, "Mínimo 3 caracteres"),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(6, "Mínimo 6 caracteres"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Base user registration schema
export const usuarioRegisterSchema = z.object({
  username: z
    .string()
    .min(1, "El nombre de usuario es requerido")
    .min(3, "Mínimo 3 caracteres")
    .max(50, "Máximo 50 caracteres"),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(6, "Mínimo 6 caracteres")
    .max(100, "Máximo 100 caracteres"),
  fullName: z
    .string()
    .min(1, "El nombre completo es requerido")
    .min(2, "Mínimo 2 caracteres")
    .max(100, "Máximo 100 caracteres"),
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Formato de correo inválido")
    .max(100, "Máximo 100 caracteres"),
});

export type UsuarioRegisterFormData = z.infer<typeof usuarioRegisterSchema>;

// Psychologist registration schema
export const psicologoRegisterSchema = usuarioRegisterSchema.extend({
  professionalType: z
    .string()
    .min(1, "El tipo profesional es requerido")
    .min(2, "Mínimo 2 caracteres")
    .max(100, "Máximo 100 caracteres"),
});

export type PsicologoRegisterFormData = z.infer<typeof psicologoRegisterSchema>;

// Owner registration schema (same as base user)
export const propietarioRegisterSchema = usuarioRegisterSchema;

export type PropietarioRegisterFormData = z.infer<
  typeof propietarioRegisterSchema
>;

// Location schemas
export const locationCreateSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "Máximo 100 caracteres"),
  description: z.string().max(500, "Máximo 500 caracteres").optional(),
  address: z.string().min(1, "La dirección es requerida"),
  latitude: z
    .number()
    .min(-90, "La latitud debe estar entre -90 y 90")
    .max(90, "La latitud debe estar entre -90 y 90"),
  longitude: z
    .number()
    .min(-180, "La longitud debe estar entre -180 y 180")
    .max(180, "La longitud debe estar entre -180 y 180"),
  imageUrl: z.string().optional(),
});

export type LocationCreateFormData = z.infer<typeof locationCreateSchema>;
