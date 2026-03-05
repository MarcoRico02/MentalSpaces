package mx.sisati.sisatibackend.identidad.psicologos.aplicacion;

import jakarta.transaction.Transactional;
import mx.sisati.sisatibackend.identidad.psicologos.Psicologo;
import mx.sisati.sisatibackend.identidad.psicologos.PsicologoService;
import mx.sisati.sisatibackend.identidad.psicologos.dto.PsicologoRegisterRequestDTO;
import mx.sisati.sisatibackend.identidad.roles.Rol;
import mx.sisati.sisatibackend.identidad.roles.RolService;
import mx.sisati.sisatibackend.identidad.usuarios.Usuario;
import mx.sisati.sisatibackend.identidad.usuarios.UsuarioService;
import mx.sisati.sisatibackend.identidad.usuarios.aplicacion.GestionarUsuarios;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class RegistrarPsicologo {
    private final PsicologoService psicologoService;
    private final RolService rolService;
    private final GestionarUsuarios gestionarUsuarios;

    public RegistrarPsicologo(PsicologoService psicologoService, RolService rolService, GestionarUsuarios gestionarUsuarios) {
        this.psicologoService = psicologoService;
        this.rolService = rolService;
        this.gestionarUsuarios = gestionarUsuarios;
    }

    @Transactional
    public Psicologo execute(PsicologoRegisterRequestDTO dto, MultipartFile fotoDePerfil) {
        Usuario usuario = gestionarUsuarios.save(dto.usuarioRegisterDTO(), fotoDePerfil);
        Rol rol = rolService.psicologo();
        return psicologoService.savePsychologist(usuario, dto, rol);
    }
}
