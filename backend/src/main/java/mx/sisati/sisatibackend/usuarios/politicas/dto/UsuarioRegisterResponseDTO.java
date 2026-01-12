package mx.sisati.sisatibackend.usuarios.politicas.dto;

import mx.sisati.sisatibackend.usuarios.politicas.Usuario;

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
