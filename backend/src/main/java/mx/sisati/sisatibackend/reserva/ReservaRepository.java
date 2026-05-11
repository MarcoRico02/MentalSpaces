package mx.sisati.sisatibackend.reserva;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    @Query("""
SELECT COUNT(r) > 0
FROM Reserva r
WHERE r.cubiculo.id = :cubiculoId
AND r.inicio < :finNueva
AND r.fin > :inicioNueva
""")
    boolean existeSolapamiento(Long cubiculoId,
                               LocalDateTime inicioNueva,
                               LocalDateTime finNueva);

    List<Reserva> findByPsicologoId(Long psicologoId);

    @Query("SELECT r FROM Reserva r WHERE r.cubiculo.location.propietario.id = :propietarioId")
    List<Reserva> findByPropietarioId(@Param("propietarioId") Long propietarioId);

    List<Reserva> findByPsicologoIdAndInicioAfter(Long psicologoId, LocalDateTime now);

    List<Reserva> findByPsicologoIdAndInicioBefore(Long psicologoId, LocalDateTime now);

    List<Reserva> findByPsicologoIdAndEstadoReserva(Long psicologoId, EstadoReserva estado);

    @Query("SELECT r FROM Reserva r WHERE r.cubiculo.location.propietario.id = :pid AND r.inicio > :now")
    List<Reserva> findReservasFuturasByPropietarioId(@Param("pid") Long propietarioId, @Param("now") LocalDateTime now);

    @Query("SELECT r FROM Reserva r WHERE r.cubiculo.location.propietario.id = :pid AND r.inicio < :now")
    List<Reserva> findReservasPasadasByPropietarioId(@Param("pid") Long propietarioId, @Param("now") LocalDateTime now);

    @Query("SELECT r FROM Reserva r WHERE r.cubiculo.location.propietario.id = :pid AND r.estadoReserva = :estado")
    List<Reserva> findReservasByPropietarioIdAndEstado(@Param("pid") Long propietarioId, @Param("estado") EstadoReserva estado);
}
