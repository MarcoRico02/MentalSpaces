import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Label, Input, Button } from "../ui";
import {
  propietarioRegisterSchema,
  type PropietarioRegisterFormData,
} from "../../../core/dominio/tipos/schemas";
import { usePropietarioRegisterMutation } from "../../../core/aplicacion/hooks/usePropietarioRegisterMutation";

export const PropietarioRegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { mutateAsync: registerPropietario, isPending } =
    usePropietarioRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PropietarioRegisterFormData>({
    resolver: zodResolver(propietarioRegisterSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: PropietarioRegisterFormData) => {
    try {
      await registerPropietario({
        usuarioRegisterDTO: {
          username: data.username,
          password: data.password,
          fullName: data.fullName,
          email: data.email,
        },
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
          placeholder="Carlos Rodríguez López"
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
          placeholder="carlos.rodriguez"
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
          placeholder="carlos.rodriguez@ejemplo.com"
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

      <Button type="submit" disabled={isPending || !isValid} className="w-full">
        {isPending ? "Registrando..." : "Registrarse como Propietario"}
      </Button>
    </form>
  );
};
