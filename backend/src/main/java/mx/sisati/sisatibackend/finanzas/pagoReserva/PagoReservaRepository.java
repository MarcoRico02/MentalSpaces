package mx.sisati.sisatibackend.finanzas.pagoReserva;

import mx.sisati.sisatibackend.finanzas.pago.EstadoPago;
import mx.sisati.sisatibackend.identidad.psicologos.Psicologo;
import mx.sisati.sisatibackend.reserva.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PagoReservaRepository extends JpaRepository<PagoReserva, UUID> {

    Optional<PagoReserva> findByReserva(Reserva reserva);

    List<PagoReserva> findAllByDeudor(Psicologo psicologo);

    @Query("""
        SELECT pr FROM PagoReserva pr
        WHERE pr.deudor = :psicologo
        AND pr.estado = :estado
        ORDER BY pr.fechaExpiracion ASC
    """)
    List<PagoReserva> findByDeudorAndEstado(
            @Param("psicologo") Psicologo psicologo,
            @Param("estado") EstadoPago estado
    );
    boolean existsByReserva(Reserva reserva);

    @Query("""
        SELECT CASE WHEN COUNT(pr) > 0 THEN true ELSE false END
        FROM PagoReserva pr
        WHERE pr.deudor = :psicologo
        AND pr.estado IN ('PENDIENTE', 'PROCESANDO')
    """)
    boolean existsPagosPendientesByDeudor(@Param("psicologo") Psicologo psicologo);
}