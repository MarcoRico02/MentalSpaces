package mx.sisati.sisatibackend.identidad.usuarios.dto;

public record UsuarioLoginResponseDTO(
        String token
) {
    public UsuarioLoginResponseDTO(String token) {
        this.token = token;
    }
}
