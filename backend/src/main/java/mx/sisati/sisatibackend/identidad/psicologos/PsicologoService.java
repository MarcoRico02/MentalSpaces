package mx.sisati.sisatibackend.identidad.psicologos;

import jakarta.transaction.Transactional;
import mx.sisati.sisatibackend.excepciones.ServiceException;
import mx.sisati.sisatibackend.identidad.psicologos.dto.PsicologoRegisterRequestDTO;
import mx.sisati.sisatibackend.roles.Rol;
import mx.sisati.sisatibackend.roles.RolService;
import mx.sisati.sisatibackend.identidad.usuarios.Usuario;
import org.springframework.stereotype.Service;

@Service
public class PsicologoService {

    private final PsicologoRepository psicologoRepository;
    private final RolService rolService;

    public PsicologoService(PsicologoRepository psicologoRepository, RolService rolService) {
        this.psicologoRepository = psicologoRepository;
        this.rolService = rolService;
    }

    @Transactional
    public Psicologo savePsychologist(Usuario usuario, PsicologoRegisterRequestDTO nuevoPsicologo, Rol rol){
        if (psicologoRepository.existsByUsuario(usuario)) {
            throw new ServiceException(this.getClass(), "El usuario ya tiene un psicólogo asociado");
        }
        usuario.getRoles().add(rol);
        Psicologo psicologo = new Psicologo(usuario, nuevoPsicologo.professionalType());

        psicologoRepository.save(psicologo);
        return psicologo;
    }
}
