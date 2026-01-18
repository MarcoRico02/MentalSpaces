package mx.sisati.sisatibackend.identidad.propietarios.dto;

import mx.sisati.sisatibackend.identidad.usuarios.dto.UsuarioRegisterDTO;

public record PropietarioRegisterRequestDTO(
        UsuarioRegisterDTO usuarioRegisterDTO
) {

}
