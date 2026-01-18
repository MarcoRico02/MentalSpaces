package mx.sisati.sisatibackend.identidad.propietarios;

import mx.sisati.sisatibackend.identidad.usuarios.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public interface PropietarioRepository extends JpaRepository<Propietario, Long> {
    boolean existsByUsuario(Usuario usuario);
}
