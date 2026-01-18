package mx.sisati.sisatibackend.identidad.psicologos.dto;

import mx.sisati.sisatibackend.identidad.usuarios.dto.UsuarioRegisterDTO;

public record PsicologoRegisterRequestDTO(
        UsuarioRegisterDTO usuarioRegisterDTO,
        String professionalType
) {

}
