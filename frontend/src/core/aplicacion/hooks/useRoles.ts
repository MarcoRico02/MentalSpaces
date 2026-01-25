import { useAuthState } from "./useAuthState";

export const useRoles = () => {
  const { user } = useAuthState();

  const hasRole = (role: string): boolean => {
    return user?.usuarioInfoDTO.roles.includes(role as any) || false;
  };

  const isPsicologo = (): boolean => hasRole("PSICOLOGO");
  const isPropietario = (): boolean => hasRole("PROPIETARIO");
  const isAdmin = (): boolean => hasRole("ADMIN");

  return {
    hasRole,
    isPsicologo,
    isPropietario,
    isAdmin,
    roles: user?.usuarioInfoDTO.roles || [],
  };
};
