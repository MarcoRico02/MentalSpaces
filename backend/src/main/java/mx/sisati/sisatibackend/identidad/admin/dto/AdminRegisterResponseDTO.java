package mx.sisati.sisatibackend.identidad.admin.dto;

import mx.sisati.sisatibackend.identidad.admin.Admin;
import mx.sisati.sisatibackend.identidad.propietarios.Propietario;
import mx.sisati.sisatibackend.identidad.usuarios.dto.UsuarioRegisterResponseDTO;

public record AdminRegisterResponseDTO(
        UsuarioRegisterResponseDTO usuarioRegisterResponseDTO
) {
    public AdminRegisterResponseDTO(Admin admin) {
        this(new UsuarioRegisterResponseDTO(admin.getUsuario().getId(), admin.getUsuario().getUsername(), admin.getUsuario().getFullName(), admin.getUsuario().getEmail()));
    }
}