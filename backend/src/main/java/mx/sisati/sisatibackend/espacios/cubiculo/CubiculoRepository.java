package mx.sisati.sisatibackend.espacios.cubiculo;

import mx.sisati.sisatibackend.espacios.locations.Location;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CubiculoRepository extends JpaRepository<Cubiculo, Long> {

    Page<Cubiculo> findByLocationId(Long locationId, Pageable pageable);

    Page<Cubiculo> findByLocationIdAndActive(Long locationId, boolean active, Pageable pageable);

    Optional<Cubiculo> findByIdAndLocationId(Long id, Long locationId);

    List<Cubiculo> findByLocation(Location location);

    List<Cubiculo> findByActiveTrue();
    
    /**
     * Busca un cubículo por ID con sus características cargadas mediante JOIN FETCH.
     * Esto optimiza el performance evitando el problema N+1 al obtener características.
     */
    @Query("SELECT c FROM Cubiculo c LEFT JOIN FETCH c.caracteristicas WHERE c.id = :id")
    Optional<Cubiculo> findByIdWithCaracteristicas(@Param("id") Long id);
}