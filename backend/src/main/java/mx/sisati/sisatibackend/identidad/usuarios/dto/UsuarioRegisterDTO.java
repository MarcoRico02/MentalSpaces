package mx.sisati.sisatibackend.identidad.usuarios.dto;

public record UsuarioRegisterDTO(
        String username,
        String password,
        String fullName,
        String email
) {
}
