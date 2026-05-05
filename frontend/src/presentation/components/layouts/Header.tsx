import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../core/aplicacion/hooks/useAuth";
import { useTheme } from "../../../core/aplicacion/contexto/ThemeContext";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { ChevronDown, LogOut, User, Sun, Moon } from "lucide-react";

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <header className="bg-surface border-b border-default shadow-sm">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end items-center h-16 gap-2">
          {/* Toggle de tema */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "dark"
                ? "Cambiar a modo claro"
                : "Cambiar a modo oscuro"
            }
            className="p-2 rounded-md text-muted-foreground hover:bg-surface-2 hover:text-default transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Profile Dropdown */}
          <Menu>
            <MenuButton className="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 p-1 hover:bg-surface-2 transition-colors">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-default">
                  {user.usuarioInfoDTO.fullName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {Array.from(user.usuarioInfoDTO.roles).join(", ")}
                </p>
              </div>
              <div className="relative">
                <img
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-default"
                  src={
                    user.usuarioInfoDTO.profileImageUrl ||
                    "https://ui-avatars.com/api/?name=" +
                      encodeURIComponent(user.usuarioInfoDTO.fullName) +
                      "&background=3B82F6&color=fff"
                  }
                  alt={user.usuarioInfoDTO.fullName}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://ui-avatars.com/api/?name=" +
                      encodeURIComponent(user.usuarioInfoDTO.fullName) +
                      "&background=3B82F6&color=fff";
                  }}
                />
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </MenuButton>

            <MenuItems
              anchor="bottom end"
              className="absolute right-0 mt-2 w-48 rounded-md bg-surface shadow-lg ring-1 ring-black/10 dark:ring-white/10 focus:outline-none z-50 border border-default"
            >
              <div className="py-1">
                <div className="px-4 py-2 text-sm text-default border-b border-default">
                  <p className="font-medium">{user.usuarioInfoDTO.fullName}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.usuarioInfoDTO.email}
                  </p>
                </div>
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() => navigate("/profile")}
                      className={`${
                        active ? "bg-surface-2" : ""
                      } flex items-center w-full px-4 py-2 text-sm text-default`}
                    >
                      <User className="h-4 w-4 mr-3" />
                      Mi Perfil
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() => logout().then(() => navigate("/login"))}
                      className={`${
                        active ? "bg-red-500/10" : ""
                      } flex items-center w-full px-4 py-2 text-sm text-red-500`}
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Cerrar Sesión
                    </button>
                  )}
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        </div>
      </div>
    </header>
  );
};
