package mx.sisati.sisatibackend.usuarios.politicas.dto;

public record UsuarioRegisterDTO(
        String username,
        String password,
        String fullName,
        String email
) {
}
