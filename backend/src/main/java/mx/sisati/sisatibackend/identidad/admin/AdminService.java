package mx.sisati.sisatibackend.identidad.admin;


import jakarta.transaction.Transactional;
import mx.sisati.sisatibackend.excepciones.ServiceException;
import mx.sisati.sisatibackend.identidad.roles.Rol;
import mx.sisati.sisatibackend.identidad.usuarios.Usuario;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final AdminRepository adminRepository;


    public AdminService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @Transactional
    public Admin bringAdminAcces(Usuario usuario, Rol rol){
        if (adminRepository.existsByUsuario(usuario)) {
            throw new ServiceException(this.getClass(), "USUARIO_YA_ASOCIADO_A_ADMINISTRADOR");
        }
        usuario.getRoles().add(rol);
        Admin admin = new Admin(usuario);

        adminRepository.save(admin);
        return admin;
    }
}
