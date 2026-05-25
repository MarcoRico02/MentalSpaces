package mx.sisati.sisatibackend.reserva;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long>, JpaSpecificationExecutor<Reserva> {
    @Query("""
SELECT COUNT(r) > 0
FROM Reserva r
WHERE r.cubiculo.id = :cubiculoId
AND r.inicio < :finNueva
AND r.fin > :inicioNueva
AND r.estadoReserva <> mx.sisati.sisatibackend.reserva.EstadoReserva.CANCELADA
""")
    boolean existeSolapamiento(@Param("cubiculoId") Long cubiculoId,
                                @Param("inicioNueva") LocalDateTime inicioNueva,
                                @Param("finNueva") LocalDateTime finNueva);

    @Query("SELECT r FROM Reserva r JOIN FETCH r.cubiculo JOIN FETCH r.psicologo WHERE r.psicologo.id = :pid")
    List<Reserva> findByPsicologoId(@Param("pid") Long psicologoId);

    @Query("SELECT r FROM Reserva r JOIN FETCH r.cubiculo JOIN FETCH r.psicologo WHERE r.cubiculo.location.propietario.id = :pid")
    List<Reserva> findByPropietarioId(@Param("pid") Long propietarioId);

    @Query("SELECT r FROM Reserva r JOIN FETCH r.cubiculo JOIN FETCH r.psicologo WHERE r.psicologo.id = :pid AND r.inicio > :now AND r.estadoReserva <> mx.sisati.sisatibackend.reserva.EstadoReserva.CANCELADA")
    List<Reserva> findFuturasByPsicologoId(@Param("pid") Long psicologoId, @Param("now") LocalDateTime now);

    @Query("SELECT r FROM Reserva r JOIN FETCH r.cubiculo JOIN FETCH r.psicologo WHERE r.cubiculo.location.propietario.id = :pid AND r.inicio > :now AND r.estadoReserva <> mx.sisati.sisatibackend.reserva.EstadoReserva.CANCELADA")
    List<Reserva> findFuturasByPropietarioId(@Param("pid") Long propietarioId, @Param("now") LocalDateTime now);

    @Query("SELECT r FROM Reserva r JOIN FETCH r.cubiculo JOIN FETCH r.psicologo WHERE r.psicologo.id = :pid AND r.fin < :now")
    List<Reserva> findPasadasByPsicologoId(@Param("pid") Long psicologoId, @Param("now") LocalDateTime now);

    @Query("SELECT r FROM Reserva r JOIN FETCH r.cubiculo JOIN FETCH r.psicologo WHERE r.cubiculo.location.propietario.id = :pid AND r.fin < :now")
    List<Reserva> findPasadasByPropietarioId(@Param("pid") Long propietarioId, @Param("now") LocalDateTime now);

    @Query("SELECT r FROM Reserva r JOIN FETCH r.cubiculo JOIN FETCH r.psicologo WHERE r.psicologo.id = :pid AND r.estadoReserva = :estado")
    List<Reserva> findByPsicologoIdAndEstadoReserva(@Param("pid") Long psicologoId, @Param("estado") EstadoReserva estado);

    @Query("SELECT r FROM Reserva r JOIN FETCH r.cubiculo JOIN FETCH r.psicologo WHERE r.cubiculo.location.propietario.id = :pid AND r.estadoReserva = :estado")
    List<Reserva> findReservasByPropietarioIdAndEstado(@Param("pid") Long propietarioId, @Param("estado") EstadoReserva estado);
}
