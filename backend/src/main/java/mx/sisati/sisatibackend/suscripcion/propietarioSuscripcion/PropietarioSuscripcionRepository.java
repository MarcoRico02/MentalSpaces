package mx.sisati.sisatibackend.suscripcion.propietarioSuscripcion;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PropietarioSuscripcionRepository extends JpaRepository<PropietarioSuscripcion, Long> {

    // Buscar suscripción activa de un propietario
    @Query("SELECT ps FROM PropietarioSuscripcion ps WHERE ps.propietario.id = :propietarioId " +
            "AND ps.fechaFin > :ahora " +
            "ORDER BY ps.fechaFin DESC")
    Optional<PropietarioSuscripcion> findActivaByPropietarioId(
            @Param("propietarioId") Long propietarioId,
            @Param("ahora") LocalDateTime ahora
    );

    // Verificar si un propietario tiene suscripción activa
    @Query("SELECT CASE WHEN COUNT(ps) > 0 THEN true ELSE false END " +
            "FROM PropietarioSuscripcion ps WHERE ps.propietario.id = :propietarioId " +
            "AND ps.fechaFin > :ahora")
    boolean tieneSuscripcionActiva(
            @Param("propietarioId") Long propietarioId,
            @Param("ahora") LocalDateTime ahora
    );

    // Obtener historial completo de suscripciones de un propietario
    List<PropietarioSuscripcion> findByPropietarioIdOrderByFechaInicioDesc(Long propietarioId);

    // Buscar suscripciones que expiran pronto (para renovación automática)
    @Query("SELECT ps FROM PropietarioSuscripcion ps WHERE ps.autoRenovacion = true " +
            "AND ps.fechaFin BETWEEN :inicio AND :fin")
    List<PropietarioSuscripcion> findSuscripcionesParaRenovar(
            @Param("inicio") LocalDateTime inicio,
            @Param("fin") LocalDateTime fin
    );

    // Buscar suscripciones que ya expiraron
    @Query("SELECT ps FROM PropietarioSuscripcion ps WHERE ps.fechaFin < :ahora")
    List<PropietarioSuscripcion> findSuscripcionesExpiradas(@Param("ahora") LocalDateTime ahora);

    // Contar suscripciones activas por plan
    @Query("SELECT ps.suscripcion.nombre, COUNT(ps) FROM PropietarioSuscripcion ps " +
            "WHERE ps.fechaFin > :ahora " +
            "GROUP BY ps.suscripcion.nombre")
    List<Object[]> contarSuscripcionesActivasPorPlan(@Param("ahora") LocalDateTime ahora);

    // Buscar última suscripción de un propietario (activa o no)
    Optional<PropietarioSuscripcion> findFirstByPropietarioIdOrderByFechaInicioDesc(Long propietarioId);
}