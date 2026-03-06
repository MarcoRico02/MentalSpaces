import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Label, Input, Button } from "../ui";
import {
  psicologoRegisterSchema,
  type PsicologoRegisterFormData,
} from "../../../core/dominio/tipos/schemas";
import { usePsicologoRegisterMutation } from "../../../core/aplicacion/hooks/usePsicologoRegisterMutation";

// Professional type options for psychologist registration
const PROFESSIONAL_TYPES = [
  "Clínico",
  "Cognitivo-Conductual",
  "Psicoanalista",
  "Humanista",
  "Sistémico",
  "Infantil",
  "Organizacional",
  "Educativo",
  "Deportivo",
  "Otro",
];

export const PsicologoRegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { mutateAsync: registerPsicologo, isPending } =
    usePsicologoRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PsicologoRegisterFormData>({
    resolver: zodResolver(psicologoRegisterSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: PsicologoRegisterFormData) => {
    try {
      await registerPsicologo({
        usuarioRegisterDTO: {
          username: data.username,
          password: data.password,
          fullName: data.fullName,
          email: data.email,
        },
        professionalType: data.professionalType,
      });

      // Auto-login and redirect to dashboard (as requested)
      navigate("/dashboard");
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="fullName">Nombre completo</Label>
        <Input
          id="fullName"
          type="text"
          placeholder="Dr. Juan Pérez Martínez"
          {...register("fullName")}
          disabled={isPending}
          className={errors.fullName ? "border-red-500" : ""}
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="username">Nombre de usuario</Label>
        <Input
          id="username"
          type="text"
          placeholder="juan.perez"
          {...register("username")}
          disabled={isPending}
          className={errors.username ? "border-red-500" : ""}
        />
        {errors.username && (
          <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          type="email"
          placeholder="juan.perez@ejemplo.com"
          {...register("email")}
          disabled={isPending}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          disabled={isPending}
          className={errors.password ? "border-red-500" : ""}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="professionalType">Tipo profesional</Label>
        <select
          id="professionalType"
          {...register("professionalType")}
          disabled={isPending}
          className={`w-full px-3 py-2 border border-default rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.professionalType ? "border-red-500" : ""
          }`}
        >
          <option value="">Selecciona tu especialidad...</option>
          {PROFESSIONAL_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.professionalType && (
          <p className="text-red-500 text-sm mt-1">
            {errors.professionalType.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isPending || !isValid} className="w-full">
        {isPending ? "Registrando..." : "Registrarse como Psicólogo"}
      </Button>
    </form>
  );
};
