package mx.sisati.sisatibackend.identidad.usuarios.dto;

import mx.sisati.sisatibackend.roles.Rol;
import mx.sisati.sisatibackend.identidad.usuarios.Usuario;

import java.time.LocalDateTime;
import java.util.Set;

public record UsuarioMeResponseDTO(
        Long id,
        String username,
        String fullName,
        String email,
        String bio,
        String profileImageUrl,
        Set<Rol> roles,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        boolean active
        ){
    public UsuarioMeResponseDTO(Usuario usuario) {
        this(usuario.getId(), usuario.getUsername(), usuario.getFullName(), usuario.getEmail(), usuario.getBio(), usuario.getProfileImageUrl(), usuario.getRoles(), usuario.getCreatedAt(), usuario.getUpdatedAt(), usuario.isActive());
    }
}
