package mx.sisati.sisatibackend.finanzas.pagoSuscripcion;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import mx.sisati.sisatibackend.excepciones.DomainException;
import mx.sisati.sisatibackend.finanzas.pago.Moneda;
import mx.sisati.sisatibackend.finanzas.pago.Pago;
import mx.sisati.sisatibackend.suscripcion.propietarioSuscripcion.PropietarioSuscripcion;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "pagos_suscripcion")
@PrimaryKeyJoinColumn(name = "pago_id")
public class PagoSuscripcion extends Pago {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "propietario_suscripcion_id", nullable = false)
    private PropietarioSuscripcion propietarioSuscripcion;

    public PagoSuscripcion(BigDecimal monto, Moneda moneda, String descripcion,
                           LocalDateTime fechaExpiracion,
                           PropietarioSuscripcion propietarioSuscripcion) {
        super(monto, moneda, descripcion, fechaExpiracion);
        validatePropietarioSuscripcion(propietarioSuscripcion);
        this.propietarioSuscripcion = propietarioSuscripcion;
    }

    private void validatePropietarioSuscripcion(PropietarioSuscripcion propietarioSuscripcion) {
        if (propietarioSuscripcion == null) {
            throw new DomainException(this.getClass(), "PROPIETARIO_SUSCRIPCION_REQUERIDA");
        }
    }
}