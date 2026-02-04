package mx.sisati.sisatibackend.espacios.caracteristicas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CaracteristicaRepository extends JpaRepository<Caracteristica, Long> {
    Optional<Caracteristica> findByNombre(CaracteristicaNombre nombre);
    
    /**
     * Busca características por sus IDs para optimizar performance y evitar N+1 queries.
     * Retorna solo las características que existen en la base de datos.
     */
    List<Caracteristica> findByIdIn(List<Long> ids);
}
