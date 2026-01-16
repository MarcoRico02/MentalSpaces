package mx.sisati.sisatibackend.roles;

import jakarta.transaction.Transactional;
import mx.sisati.sisatibackend.excepciones.ServiceException;
import mx.sisati.sisatibackend.psicologos.Psicologo;
import mx.sisati.sisatibackend.psicologos.dto.PsicologoRegisterRequestDTO;
import mx.sisati.sisatibackend.usuarios.politicas.Usuario;
import org.springframework.stereotype.Service;

@Service
public class RolService {

    private final RolRepository rolRepository;

    public RolService(RolRepository rolRepository) {
        this.rolRepository = rolRepository;
    }

    @Transactional
    public Rol getRol(Long id){
        return rolRepository.getReferenceById(id);
    }

    @Transactional
    public Rol getByNombre(String nombre){
        return rolRepository.findByNombre(nombre).orElseThrow(() -> new ServiceException(this.getClass(), "No Existe el Rol que se quiete buscar"));
    }
}
