package mx.sisati.sisatibackend.psicologos.dto;

import mx.sisati.sisatibackend.psicologos.Psicologo;
import mx.sisati.sisatibackend.psicologos.PsicologoService;
import mx.sisati.sisatibackend.usuarios.politicas.dto.UsuarioRegisterResponseDTO;

public record PsicologoRegisterResponseDTO(
        UsuarioRegisterResponseDTO usuarioRegisterResponseDTO,
        String professionalType
) {
    public PsicologoRegisterResponseDTO(Psicologo psicologo) {
        this(new UsuarioRegisterResponseDTO(psicologo.getId(), psicologo.getUsuario().getUsername(), psicologo.getUsuario().getFullName(), psicologo.getUsuario().getEmail()), psicologo.getProfessionalType());
    }
}
