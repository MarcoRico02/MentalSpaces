package mx.sisati.sisatibackend.identidad.propietarios.aplicacion;

import jakarta.transaction.Transactional;
import mx.sisati.sisatibackend.identidad.propietarios.Propietario;
import mx.sisati.sisatibackend.identidad.propietarios.PropietarioService;
import mx.sisati.sisatibackend.identidad.propietarios.dto.PropietarioRegisterRequestDTO;
import mx.sisati.sisatibackend.identidad.usuarios.Usuario;
import mx.sisati.sisatibackend.identidad.usuarios.UsuarioService;
import mx.sisati.sisatibackend.identidad.roles.Rol;
import mx.sisati.sisatibackend.identidad.roles.RolService;
import mx.sisati.sisatibackend.identidad.usuarios.aplicacion.GestionarUsuarios;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class RegistrarPropietario {

    private final GestionarUsuarios gestionarUsuarios;
    private final PropietarioService propietarioService;
    private final RolService rolService;

    public RegistrarPropietario(GestionarUsuarios gestionarUsuarios, PropietarioService propietarioService, RolService rolService) {
        this.gestionarUsuarios = gestionarUsuarios;
        this.propietarioService = propietarioService;
        this.rolService = rolService;
    }

    @Transactional
    public Propietario execute(PropietarioRegisterRequestDTO dto) {
        Usuario usuario = gestionarUsuarios.save(dto.usuarioRegisterDTO());
        Rol rol = rolService.propietario();
        return propietarioService.saveOwner(usuario, rol);
    }
}
