package mx.sisati.sisatibackend.identidad.psicologos;

import mx.sisati.sisatibackend.identidad.usuarios.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PsicologoRepository extends JpaRepository<Psicologo, Long> {
    boolean existsByUsuario(Usuario usuario);
}
