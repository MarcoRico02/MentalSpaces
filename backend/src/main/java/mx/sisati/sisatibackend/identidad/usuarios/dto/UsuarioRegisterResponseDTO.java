package mx.sisati.sisatibackend.identidad.usuarios.dto;

import mx.sisati.sisatibackend.identidad.usuarios.Usuario;

public record UsuarioRegisterResponseDTO(
        Long id,
        String username,
        String fullName,
        String email
) {
    public UsuarioRegisterResponseDTO(Usuario usuario) {
        this(usuario.getId(), usuario.getUsername(), usuario.getFullName(), usuario.getEmail());
    }
}
