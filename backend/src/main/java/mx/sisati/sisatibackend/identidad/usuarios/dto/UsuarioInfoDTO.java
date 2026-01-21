package mx.sisati.sisatibackend.identidad.usuarios.dto;

import mx.sisati.sisatibackend.identidad.usuarios.Usuario;
import mx.sisati.sisatibackend.roles.Rol;
import mx.sisati.sisatibackend.roles.RolNombre;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

public record UsuarioInfoDTO(
        Long id,
        String username,
        String fullName,
        String email,
        String bio,
        String profileImageUrl,
        Set<RolNombre> roles,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        boolean active
) {
    public UsuarioInfoDTO(Usuario usuario) {
        this(
                usuario.getId(),
                usuario.getUsername(),
                usuario.getFullName(),
                usuario.getEmail(),
                usuario.getBio(),
                usuario.getProfileImageUrl(),
                usuario.getRoles()
                        .stream()
                        .map(Rol::getNombre)
                        .collect(Collectors.toSet()),
                usuario.getCreatedAt(),
                usuario.getUpdatedAt(),
                usuario.isActive());
    }
}
