package mx.sisati.sisatibackend.finanzas.pagoReserva;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import mx.sisati.sisatibackend.excepciones.DomainException;
import mx.sisati.sisatibackend.finanzas.pago.Moneda;
import mx.sisati.sisatibackend.finanzas.pago.Pago;
import mx.sisati.sisatibackend.identidad.psicologos.Psicologo;
import mx.sisati.sisatibackend.reserva.Reserva;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "pagos_reserva")
@PrimaryKeyJoinColumn(name = "pago_id")
public class PagoReserva extends Pago {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reserva_id", nullable = false, unique = true)
    private Reserva reserva;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "deudor_id", nullable = false)
    private Psicologo deudor;

    public PagoReserva(BigDecimal monto, Moneda moneda, String descripcion,
                       LocalDateTime fechaExpiracion, Reserva reserva) {
        super(monto, moneda, descripcion, fechaExpiracion);
        validateReserva(reserva);
        this.reserva = reserva;
        this.deudor = reserva.getPsicologo();
    }

    private void validateReserva(Reserva reserva) {
        if (reserva == null) {
            throw new DomainException(this.getClass(), "RESERVA_REQUERIDA");
        }
    }
}