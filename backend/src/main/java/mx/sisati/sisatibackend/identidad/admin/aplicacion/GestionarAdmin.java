package mx.sisati.sisatibackend.identidad.admin.aplicacion;

import jakarta.transaction.Transactional;
import mx.sisati.sisatibackend.identidad.admin.Admin;
import mx.sisati.sisatibackend.identidad.admin.AdminService;
import mx.sisati.sisatibackend.identidad.admin.dto.AdminRegisterRequestDTO;
import mx.sisati.sisatibackend.identidad.propietarios.Propietario;
import mx.sisati.sisatibackend.identidad.propietarios.PropietarioService;
import mx.sisati.sisatibackend.identidad.propietarios.dto.PropietarioRegisterRequestDTO;
import mx.sisati.sisatibackend.identidad.roles.Rol;
import mx.sisati.sisatibackend.identidad.roles.RolService;
import mx.sisati.sisatibackend.identidad.usuarios.Usuario;
import mx.sisati.sisatibackend.identidad.usuarios.UsuarioService;
import org.springframework.stereotype.Service;

@Service
public class GestionarAdmin {
    private final UsuarioService usuarioService;
    private final AdminService adminService;
    private final RolService rolService;

    public GestionarAdmin(UsuarioService usuarioService, AdminService adminService, RolService rolService) {
        this.usuarioService = usuarioService;
        this.adminService = adminService;
        this.rolService = rolService;
    }

    @Transactional
    public Admin bringAdminAcces(AdminRegisterRequestDTO dto) {
        Usuario usuario = usuarioService.findById(dto.id());
        Rol rol = rolService.admin();
        return adminService.bringAdminAcces(usuario, rol);
    }
}
