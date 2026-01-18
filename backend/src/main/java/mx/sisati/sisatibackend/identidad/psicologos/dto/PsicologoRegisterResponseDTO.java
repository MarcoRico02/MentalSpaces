package mx.sisati.sisatibackend.identidad.psicologos.dto;

import mx.sisati.sisatibackend.identidad.psicologos.Psicologo;
import mx.sisati.sisatibackend.identidad.usuarios.dto.UsuarioRegisterResponseDTO;

public record PsicologoRegisterResponseDTO(
        UsuarioRegisterResponseDTO usuarioRegisterResponseDTO,
        String professionalType
) {
    public PsicologoRegisterResponseDTO(Psicologo psicologo) {
        this(new UsuarioRegisterResponseDTO(psicologo.getId(), psicologo.getUsuario().getUsername(), psicologo.getUsuario().getFullName(), psicologo.getUsuario().getEmail()), psicologo.getProfessionalType());
    }
}
