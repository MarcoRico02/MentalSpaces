package mx.sisati.sisatibackend.identidad.propietarios.aplicacion;

import jakarta.transaction.Transactional;
import mx.sisati.sisatibackend.identidad.propietarios.Propietario;
import mx.sisati.sisatibackend.identidad.propietarios.PropietarioService;
import mx.sisati.sisatibackend.identidad.propietarios.dto.PropietarioRegisterRequestDTO;
import mx.sisati.sisatibackend.identidad.usuarios.Usuario;
import mx.sisati.sisatibackend.identidad.usuarios.UsuarioService;
import mx.sisati.sisatibackend.identidad.roles.Rol;
import mx.sisati.sisatibackend.identidad.roles.RolService;
import org.springframework.stereotype.Service;

@Service
public class RegistrarPropietario {

    private final UsuarioService usuarioService;
    private final PropietarioService propietarioService;
    private final RolService rolService;

    public RegistrarPropietario(UsuarioService usuarioService, PropietarioService propietarioService, RolService rolService) {
        this.usuarioService = usuarioService;
        this.propietarioService = propietarioService;
        this.rolService = rolService;
    }

    @Transactional
    public Propietario execute(PropietarioRegisterRequestDTO dto) {
        Usuario usuario = usuarioService.saveUser(dto.usuarioRegisterDTO());
        Rol rol = rolService.propietario();
        return propietarioService.saveOwner(usuario, rol);
    }
}
