package mx.sisati.sisatibackend.identidad.propietarios.dto;

import mx.sisati.sisatibackend.identidad.propietarios.Propietario;
import mx.sisati.sisatibackend.identidad.psicologos.Psicologo;
import mx.sisati.sisatibackend.identidad.usuarios.Usuario;
import mx.sisati.sisatibackend.identidad.usuarios.dto.UsuarioRegisterResponseDTO;

public record PropietarioRegisterResponseDTO(
        UsuarioRegisterResponseDTO usuarioRegisterResponseDTO
) {
    public PropietarioRegisterResponseDTO(Propietario propietario) {
        this(new UsuarioRegisterResponseDTO(propietario.getUsuario().getId(), propietario.getUsuario().getUsername(), propietario.getUsuario().getFullName(), propietario.getUsuario().getEmail()));
    }
}
