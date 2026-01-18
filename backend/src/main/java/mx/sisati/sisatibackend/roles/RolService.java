package mx.sisati.sisatibackend.roles;

import mx.sisati.sisatibackend.excepciones.ServiceException;
import org.springframework.stereotype.Service;

@Service
public class RolService {

    private final RolRepository rolRepository;

    public RolService(RolRepository rolRepository) {
        this.rolRepository = rolRepository;
    }

    private Rol getRequiredRol(RolNombre nombre) {
        return rolRepository.findByNombre(nombre)
                .orElseThrow(() -> new ServiceException(
                        this.getClass(),
                        "No existe el rol requerido en la base de datos: " + nombre
                ));
    }

    public Rol admin() {
        return getRequiredRol(RolNombre.ADMIN);
    }

    public Rol psicologo() {
        return getRequiredRol(RolNombre.PSICOLOGO);
    }

    public Rol propietario() {
        return getRequiredRol(RolNombre.PROPIETARIO);
    }

}
