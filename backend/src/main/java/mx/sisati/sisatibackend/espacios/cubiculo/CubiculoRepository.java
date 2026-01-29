package mx.sisati.sisatibackend.espacios.cubiculo;

import mx.sisati.sisatibackend.espacios.locations.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CubiculoRepository extends JpaRepository<Cubiculo, Long> {

    List<Cubiculo> findByLocationId(Long locationId);

    List<Cubiculo> findByLocationIdAndActive(Long locationId, boolean active);

    Optional<Cubiculo> findByIdAndLocationId(Long id, Long locationId);

    List<Cubiculo> findByLocation(Location location);
}