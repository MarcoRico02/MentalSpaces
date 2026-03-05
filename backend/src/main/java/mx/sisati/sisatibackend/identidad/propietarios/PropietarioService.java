package mx.sisati.sisatibackend.identidad.propietarios;

import jakarta.transaction.Transactional;
import mx.sisati.sisatibackend.excepciones.ServiceException;
import mx.sisati.sisatibackend.identidad.usuarios.Usuario;
import mx.sisati.sisatibackend.identidad.roles.Rol;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PropietarioService {

    private final PropietarioRepository propietarioRepository;

    public PropietarioService(PropietarioRepository propietarioRepository) {
        this.propietarioRepository = propietarioRepository;
    }

    @Transactional
    public Propietario saveOwner(Usuario usuario, Rol rol){
        if (propietarioRepository.existsByUsuario(usuario)) {
            throw new ServiceException(this.getClass(), "El usuario ya tiene un propietario asociado");
        }
        usuario.getRoles().add(rol);
        Propietario propietario = new Propietario(usuario);

        propietarioRepository.save(propietario);
        return propietario;
    }

    public Propietario getByUsuarioIdOrThrow(Long id) {
        return propietarioRepository.findById(id).orElseThrow(() -> new ServiceException(this.getClass(), "No se encontro el psicologo"));
    }

    public Optional<Propietario> getByUsuarioId(Long id) {
        return propietarioRepository.findById(id);
    }
}
