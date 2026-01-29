import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tab } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { Label, Input, Button } from "../ui";
import {
  loginSchema,
  type LoginFormData,
} from "../../../core/dominio/tipos/schemas";
import { useAuth } from "../../../core/aplicacion/hooks/useAuth";
import { PsicologoRegisterForm } from "./PsicologoRegisterForm";
import { PropietarioRegisterForm } from "./PropietarioRegisterForm";

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [selectedTab, setSelectedTab] = React.useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.username, data.password);
      navigate("/dashboard");
    } catch (error) {
      // Error is handled in the auth context with toast
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="space-y-8">
        {/* Tabs */}
        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex space-x-1 rounded-lg bg-gray-100 p-1">
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
                  ${selected ? "bg-white shadow" : "text-blue-100 hover:bg-white/[0.12] hover:text-blue-600"}`
              }
            >
              Iniciar sesión
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
                  ${selected ? "bg-white shadow" : "text-blue-100 hover:bg-white/[0.12] hover:text-blue-600"}`
              }
            >
              Registrarse
            </Tab>
          </Tab.List>

          <Tab.Panels>
            {/* Login Panel */}
            <Tab.Panel className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* General error */}
                {errors.root && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    {errors.root.message}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Username */}
                  <div>
                    <Label htmlFor="username">Usuario</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="tu_usuario"
                      {...register("username")}
                      error={errors.username?.message}
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Tu contraseña"
                      {...register("password")}
                      error={errors.password?.message}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="please-remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="please-remember-me"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Recordarme
                    </label>
                  </div>

                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                </div>

                <div>
                  <Button
                    type="submit"
                    className="w-full"
                    isLoading={isLoading}
                    disabled={isLoading}
                  >
                    {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
                  </Button>
                </div>
              </form>
            </Tab.Panel>

            {/* Register Panel */}
            <Tab.Panel className="space-y-6">
              <div className="space-y-6">
                {/* Registration type tabs */}
                <Tab.Group>
                  <Tab.List className="flex space-x-1 rounded-lg bg-gray-100 p-1">
                    <Tab
                      className={({ selected }) =>
                        `w-full rounded-lg py-2 text-sm font-medium leading-5 text-blue-700
                          ${selected ? "bg-white shadow" : "text-blue-100 hover:bg-white/[0.12] hover:text-blue-600"}`
                      }
                    >
                      Psicólogo
                    </Tab>
                    <Tab
                      className={({ selected }) =>
                        `w-full rounded-lg py-2 text-sm font-medium leading-5 text-blue-700
                          ${selected ? "bg-white shadow" : "text-blue-100 hover:bg-white/[0.12] hover:text-blue-600"}`
                      }
                    >
                      Propietario
                    </Tab>
                  </Tab.List>

                  <Tab.Panels className="mt-6">
                    <Tab.Panel>
                      <div className="space-y-4">
                        <div className="text-center">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Registro de Psicólogo
                          </h3>
                          <p className="text-sm text-gray-600">
                            Regístrate como profesional de la salud mental
                          </p>
                        </div>
                        <PsicologoRegisterForm />
                      </div>
                    </Tab.Panel>
                    <Tab.Panel>
                      <div className="space-y-4">
                        <div className="text-center">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Registro de Propietario
                          </h3>
                          <p className="text-sm text-gray-600">
                            Publica tus consultorios para reservas
                          </p>
                        </div>
                        <PropietarioRegisterForm />
                      </div>
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};
