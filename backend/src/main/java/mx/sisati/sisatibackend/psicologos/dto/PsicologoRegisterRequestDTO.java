package mx.sisati.sisatibackend.psicologos.dto;

import mx.sisati.sisatibackend.usuarios.politicas.dto.UsuarioRegisterDTO;

public record PsicologoRegisterRequestDTO(
        UsuarioRegisterDTO usuarioRegisterDTO,
        String professionalType
) {

}
