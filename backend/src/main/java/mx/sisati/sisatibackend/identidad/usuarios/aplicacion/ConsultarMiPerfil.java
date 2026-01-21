package mx.sisati.sisatibackend.identidad.usuarios.aplicacion;

import mx.sisati.sisatibackend.identidad.propietarios.Propietario;
import mx.sisati.sisatibackend.identidad.propietarios.PropietarioService;
import mx.sisati.sisatibackend.identidad.propietarios.dto.PropietarioInfoDTO;
import mx.sisati.sisatibackend.identidad.psicologos.Psicologo;
import mx.sisati.sisatibackend.identidad.psicologos.PsicologoService;
import mx.sisati.sisatibackend.identidad.psicologos.dto.PsicologoInfoDTO;
import mx.sisati.sisatibackend.identidad.usuarios.Usuario;
import mx.sisati.sisatibackend.identidad.usuarios.UsuarioService;
import mx.sisati.sisatibackend.identidad.usuarios.dto.UsuarioInfoDTO;
import mx.sisati.sisatibackend.identidad.usuarios.dto.UsuarioMeResponseDTO;
import org.springframework.stereotype.Service;

@Service
public class ConsultarMiPerfil {

    private final UsuarioService usuarioService;
    private final PsicologoService psicologoService;
    private final PropietarioService propietarioService;

    public ConsultarMiPerfil(UsuarioService usuarioService, PsicologoService psicologoService, PropietarioService propietarioService) {
        this.usuarioService = usuarioService;
        this.psicologoService = psicologoService;
        this.propietarioService = propietarioService;
    }

    public UsuarioMeResponseDTO execute(Usuario usuario){
        Long id = usuario.getId();

        PsicologoInfoDTO psicologoInfoDTO = psicologoService.getByUsuarioId(id).map(PsicologoInfoDTO::new)
                .orElse(null);
        PropietarioInfoDTO propietarioInfoDTO = propietarioService.getByUsuarioId(id).map(PropietarioInfoDTO::new)
                .orElse(null);

        UsuarioInfoDTO usuarioInfoDTO = new UsuarioInfoDTO(usuario);
        return new UsuarioMeResponseDTO(usuarioInfoDTO, psicologoInfoDTO, propietarioInfoDTO);
    }
}
