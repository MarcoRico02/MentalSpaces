package mx.sisati.sisatibackend.finanzas.pago;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import mx.sisati.sisatibackend.excepciones.DomainException;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Locale;
import java.util.UUID;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "pagos")
@Inheritance(strategy = InheritanceType.JOINED)
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal monto;

    @Column(nullable = false, length = 3)
    @Enumerated(EnumType.STRING)
    private Moneda moneda;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private EstadoPago estado = EstadoPago.PENDIENTE;

    @Enumerated(EnumType.STRING)
    @Column(name = "metodo_pago")
    private MetodoPago metodoPago;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "requiere_factura", nullable = false)
    private boolean requiereFactura = false;

    @Column(name = "fecha_expiracion", nullable = false)
    private LocalDateTime fechaExpiracion;

    @Column(name = "stripe_payment_intent_id", unique = true)
    private String stripePaymentIntentId;

    @Column(name = "registrado_por_usuario_id")
    private UUID registradoPorUsuarioId;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public Pago(BigDecimal monto, Moneda moneda, String descripcion, LocalDateTime fechaExpiracion) {
        validate(monto, moneda, descripcion, fechaExpiracion);
        this.monto = monto;
        this.moneda = moneda;
        this.descripcion = descripcion;
        this.fechaExpiracion = fechaExpiracion;
    }

    private void validate(BigDecimal monto, Moneda moneda, String descripcion, LocalDateTime fechaExpiracion) {
        validateMonto(monto);
        validateDescripcion(descripcion);
        validateMoneda(moneda);
        validateFechaExpiracion(fechaExpiracion);
    }

    private void validateMonto(BigDecimal monto) {
        if (monto == null)
            throw new DomainException(this.getClass(), "MONTO_REQUERIDO");

        if (monto.compareTo(BigDecimal.ZERO) <= 0)
            throw new DomainException(this.getClass(), "MONTO_DEBE_SER_MAYOR_A_CERO");
    }


    private void validateDescripcion(String descripcion) {
        if (descripcion == null || descripcion.isBlank())
            throw new DomainException(this.getClass(), "DESCRIPCION_REQUERIDA");
    }

    private void validateMoneda(Moneda moneda) {
        if (moneda == null)
            throw new DomainException(this.getClass(), "MONEDA_REQUERIDA");
    }

    private void validateFechaExpiracion(LocalDateTime fechaExpiracion) {
        if (fechaExpiracion == null)
            throw new DomainException(this.getClass(), "FECHA_EXPIRACION_REQUERIDA");
    }

    public void marcarComoPagado(String stripePaymentIntentId) {
        if (!puedeConfirmarse()) {
            throw new DomainException(this.getClass(), "SOLO_PAGOS_PENDIENTES_O_PROCESANDO_PUEDEN_CONFIRMARSE");
        }
        if (stripePaymentIntentId == null || stripePaymentIntentId.isBlank()) {
            throw new DomainException(this.getClass(), "STRIPE_PAYMENT_INTENT_REQUERIDO");
        }
        this.estado = EstadoPago.PAGADO;
        this.stripePaymentIntentId = stripePaymentIntentId;
    }

    public void marcarComoExpirado() {
        if (!puedeExpirarse()) {
            throw new DomainException(this.getClass(), "SOLO_PAGOS_PENDIENTES_O_PROCESANDO_PUEDEN_EXPIRARSE");
        }
        this.estado = EstadoPago.EXPIRADO;
    }


    public void marcarComoProcesando() {
        if (!puedeProcesarse()) {
            throw new DomainException(this.getClass(), "SOLO_PAGOS_PENDIENTES_PUEDEN_PROCESARSE");
        }
        this.estado = EstadoPago.PROCESANDO;
    }

    public void cancelar() {
        if (!puedeCancelar()) {
            throw new DomainException(this.getClass(), "NO_SE_PUEDE_CANCELAR_PAGO_COMPLETADO_O_REEMBOLSADO");
        }
        if (estado == EstadoPago.CANCELADO) {
            throw new DomainException(this.getClass(), "PAGO_YA_CANCELADO");
        }
        this.estado = EstadoPago.CANCELADO;
    }

    public void marcarComoReembolsado() {
        if (!puedeReembolsarse()) {
            throw new DomainException(this.getClass(), "SOLO_PAGOS_PAGADOS_PUEDEN_REEMBOLSARSE");
        }
        this.estado = EstadoPago.REEMBOLSADO;
    }

    public void marcarComoFallido() {
        if (!puedeFallar()) {
            throw new DomainException(this.getClass(), "SOLO_PAGOS_PENDIENTES_O_PROCESANDO_PUEDEN_FALLAR");
        }
        this.estado = EstadoPago.FALLIDO;
    }

    public boolean puedeConfirmarse() {
        return estado == EstadoPago.PENDIENTE || estado == EstadoPago.PROCESANDO;
    }

    public boolean puedeExpirarse() {
        return estado == EstadoPago.PENDIENTE || estado == EstadoPago.PROCESANDO;
    }

    public boolean puedeProcesarse() {
        return estado == EstadoPago.PENDIENTE;
    }

    public boolean puedeCancelar() {
        return !(estado == EstadoPago.PAGADO || estado == EstadoPago.REEMBOLSADO);
    }

    public boolean puedeReembolsarse() {
        return estado == EstadoPago.PAGADO;
    }

    public boolean puedeFallar() {
        return estado == EstadoPago.PENDIENTE || estado == EstadoPago.PROCESANDO;
    }
    public boolean estaExpirado(LocalDateTime now) {
        if (fechaExpiracion == null) return false;
        return now.isAfter(fechaExpiracion);
    }
}