package mx.sisati.sisatibackend.usuarios.politicas.dto;

import mx.sisati.sisatibackend.usuarios.politicas.Usuario;

public record UsuarioLoginResponseDTO(
        String token
) {
    public UsuarioLoginResponseDTO(String token) {
        this.token = token;
    }
}
