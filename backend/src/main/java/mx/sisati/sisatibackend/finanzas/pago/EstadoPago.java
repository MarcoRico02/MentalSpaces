package mx.sisati.sisatibackend.finanzas.pago;

import lombok.Getter;

@Getter
public enum EstadoPago {
    PENDIENTE("Pendiente de pago"),
    PROCESANDO("En proceso de validación"),
    PAGADO("Pagado exitosamente"),
    EXPIRADO("Tiempo de pago expirado"),
    CANCELADO("Cancelado manualmente"),
    REEMBOLSADO("Reembolsado al cliente"),
    FALLIDO("Intento de pago fallido");

    private final String descripcion;

    EstadoPago(String descripcion) {
        this.descripcion = descripcion;
    }
}