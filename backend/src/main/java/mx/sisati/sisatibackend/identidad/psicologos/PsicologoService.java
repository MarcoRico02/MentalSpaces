package mx.sisati.sisatibackend.identidad.psicologos;

import jakarta.transaction.Transactional;
import mx.sisati.sisatibackend.excepciones.ServiceException;
import mx.sisati.sisatibackend.identidad.psicologos.dto.PsicologoRegisterRequestDTO;
import mx.sisati.sisatibackend.identidad.roles.Rol;
import mx.sisati.sisatibackend.identidad.usuarios.Usuario;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PsicologoService {

    private final PsicologoRepository psicologoRepository;

    public PsicologoService(PsicologoRepository psicologoRepository) {
        this.psicologoRepository = psicologoRepository;
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

    public Psicologo getByUsuarioIdOrThrow(Long id){
        return psicologoRepository.findById(id).orElseThrow(() -> new ServiceException(this.getClass(), "No se encontro el psicologo"));
    }

    public Optional<Psicologo> getByUsuarioId(Long id) {
        return psicologoRepository.findById(id);
    }
}
