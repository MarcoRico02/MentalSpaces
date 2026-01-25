import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../core/aplicacion/hooks/useAuth";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { ChevronDown, LogOut, User } from "lucide-react";

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end items-center h-16">
          {/* Profile Dropdown con Headless UI */}
          <Menu>
            <MenuButton className="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 p-1 hover:bg-gray-50 transition-colors">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-gray-900">
                  {user.usuarioInfoDTO.fullName}
                </p>
                <p className="text-xs text-gray-500">
                  {Array.from(user.usuarioInfoDTO.roles).join(", ")}
                </p>
              </div>
              <div className="relative">
                <img
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-gray-200"
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
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </MenuButton>

            <MenuItems
              anchor="bottom end"
              className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
            >
              <div className="py-1">
                <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                  <p className="font-medium">{user.usuarioInfoDTO.fullName}</p>
                  <p className="text-xs text-gray-500">
                    {user.usuarioInfoDTO.email}
                  </p>
                </div>
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() => navigate("/profile")}
                      className={`${
                        active ? "bg-gray-100" : ""
                      } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
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
                        active ? "bg-red-50" : ""
                      } flex items-center w-full px-4 py-2 text-sm text-red-600`}
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
