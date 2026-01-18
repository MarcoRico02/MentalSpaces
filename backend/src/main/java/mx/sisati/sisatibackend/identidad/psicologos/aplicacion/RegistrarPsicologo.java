package mx.sisati.sisatibackend.identidad.psicologos.aplicacion;

import jakarta.transaction.Transactional;
import mx.sisati.sisatibackend.identidad.psicologos.Psicologo;
import mx.sisati.sisatibackend.identidad.psicologos.PsicologoService;
import mx.sisati.sisatibackend.identidad.psicologos.dto.PsicologoRegisterRequestDTO;
import mx.sisati.sisatibackend.roles.Rol;
import mx.sisati.sisatibackend.roles.RolService;
import mx.sisati.sisatibackend.identidad.usuarios.Usuario;
import mx.sisati.sisatibackend.identidad.usuarios.UsuarioService;
import org.springframework.stereotype.Service;

@Service
public class RegistrarPsicologo {
    private final UsuarioService usuarioService;
    private final PsicologoService psicologoService;
    private final RolService rolService;

    public RegistrarPsicologo(UsuarioService usuarioService, PsicologoService psicologoService, RolService rolService) {
        this.usuarioService = usuarioService;
        this.psicologoService = psicologoService;
        this.rolService = rolService;
    }

    @Transactional
    public Psicologo execute(PsicologoRegisterRequestDTO dto) {
        Usuario usuario = usuarioService.saveUser(dto.usuarioRegisterDTO());
        Rol rol = rolService.psicologo();
        return psicologoService.savePsychologist(usuario, dto, rol);
    }
}
