package mx.sisati.sisatibackend.psicologos;

import mx.sisati.sisatibackend.usuarios.politicas.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PsicologoRepository extends JpaRepository<Psicologo, Long> {
    boolean existsByUsuario(Usuario usuario);
}
