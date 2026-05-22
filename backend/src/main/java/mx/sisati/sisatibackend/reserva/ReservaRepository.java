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
    boolean existeSolapamiento(@Param("cubiculoId") Long cubiculoId,
                               @Param("inicioNueva") LocalDateTime inicioNueva,
                               @Param("finNueva") LocalDateTime finNueva);

    @Query("""
        SELECT r FROM Reserva r
        JOIN FETCH r.cubiculo
        JOIN FETCH r.psicologo p
        JOIN FETCH p.usuario
        WHERE (:fechaInicio IS NULL OR r.fin > :fechaInicio)
        AND (:fechaFin IS NULL OR r.inicio < :fechaFin)
        AND (:cubiculoIds IS NULL OR r.cubiculo.id IN :cubiculoIds)
        AND (:locationIds IS NULL OR r.cubiculo.location.id IN :locationIds)
        AND (:usuarioIds IS NULL OR p.usuario.id IN :usuarioIds)
        AND (:filtroTemporal IS NULL
             OR (:filtroTemporal = 'FUTURA' AND r.inicio > CURRENT_TIMESTAMP)
             OR (:filtroTemporal = 'PASADA' AND r.fin < CURRENT_TIMESTAMP)
             OR (:filtroTemporal = 'CANCELADA' AND r.estadoReserva = 'CANCELADA'))
        ORDER BY r.inicio ASC
    """)
    List<Reserva> buscarPorFiltros(@Param("fechaInicio") LocalDateTime fechaInicio,
                                   @Param("fechaFin") LocalDateTime fechaFin,
                                   @Param("cubiculoIds") List<Long> cubiculoIds,
                                   @Param("locationIds") List<Long> locationIds,
                                   @Param("usuarioIds") List<Long> usuarioIds,
                                   @Param("filtroTemporal") String filtroTemporal);
}
