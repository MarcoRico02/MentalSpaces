package mx.sisati.sisatibackend.espacios.locations;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LocationRepository extends JpaRepository<Location, Long> {

    List<Location> findByPropietarioIdAndActiveTrue(Long propietarioId);

    Optional<Location> findByIdAndPropietarioId(Long id, Long propietarioId);

    Page<Location> findByPropietarioId(Long propietarioId, Pageable pageable);

    List<Location> findByActiveTrue();
}