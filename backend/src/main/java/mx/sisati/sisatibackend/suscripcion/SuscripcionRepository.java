package mx.sisati.sisatibackend.suscripcion;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SuscripcionRepository extends JpaRepository<Suscripcion, Long> {

    // Buscar por nombre
    List<Suscripcion> findByNombreContainingIgnoreCase(String nombre);

    // Verificar si existe una suscripción con ese nombre
    boolean existsByNombreIgnoreCase(String nombre);

    // Obtener todas ordenadas por precio
    List<Suscripcion> findAllByOrderByPrecioAsc();
}
