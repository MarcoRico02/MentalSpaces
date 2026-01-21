package mx.sisati.sisatibackend.identidad.usuarios.dto;

import mx.sisati.sisatibackend.identidad.propietarios.dto.PropietarioInfoDTO;
import mx.sisati.sisatibackend.identidad.psicologos.dto.PsicologoInfoDTO;

public record UsuarioMeResponseDTO(
        UsuarioInfoDTO usuarioInfoDTO,
        PsicologoInfoDTO psicologoInfoDTO,
        PropietarioInfoDTO propietarioInfoDTO
        ){

}
