package mx.sisati.sisatibackend.identidad.usuarios.dto;

import mx.sisati.sisatibackend.identidad.usuarios.Usuario;

public record UsuarioRegisterDTO(
        String username,
        String password,
        String fullName,
        String email
) {
    public static UsuarioRegisterDTO fromEntity(Usuario usuario) {
        if (usuario == null) return null;

        return new UsuarioRegisterDTO(
                usuario.getUsername(),
                usuario.getPassword(),
                usuario.getFullName(),
                usuario.getEmail()
        );
    }
}
