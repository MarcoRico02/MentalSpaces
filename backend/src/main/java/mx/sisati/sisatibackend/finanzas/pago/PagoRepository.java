package mx.sisati.sisatibackend.finanzas.pago;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PagoRepository extends JpaRepository<Pago, UUID> {
    List<Pago> findByEstado(EstadoPago estado);
    List<Pago> findByMetodoPago(MetodoPago metodoPago);
    Optional<Pago> findByStripePaymentIntentId(String stripePaymentIntentId);
    List<Pago> findByCreatedAtBetween(LocalDateTime inicio, LocalDateTime fin);

    @Query("""
        SELECT p FROM Pago p
        WHERE p.estado IN :estados
        AND p.createdAt BETWEEN :inicio AND :fin
        ORDER BY p.createdAt DESC
    """)
    List<Pago> findByEstadosYRangoFecha(
            @Param("estados") List<EstadoPago> estados,
            @Param("inicio") LocalDateTime inicio,
            @Param("fin") LocalDateTime fin
    );

    // ==================== Pagos por expirar ====================

    @Query("""
        SELECT p FROM Pago p
        WHERE p.estado IN ('PENDIENTE', 'PROCESANDO')
        AND p.fechaExpiracion < :fecha
    """)
    List<Pago> findPagosPorExpirar(@Param("fecha") LocalDateTime fecha);

    default List<Pago> findPagosExpirados() {
        return findPagosPorExpirar(LocalDateTime.now());
    }


    @Query("""
        SELECT COUNT(p) FROM Pago p
        WHERE p.estado = :estado
    """)
    Long countByEstado(@Param("estado") EstadoPago estado);

    @Query("""
        SELECT COALESCE(SUM(p.monto), 0) FROM Pago p
        WHERE p.estado = 'PAGADO'
        AND p.createdAt BETWEEN :inicio AND :fin
    """)
    BigDecimal sumMontosPagadosEnRango(
            @Param("inicio") LocalDateTime inicio,
            @Param("fin") LocalDateTime fin
    );


    boolean existsByStripePaymentIntentId(String stripePaymentIntentId);
}