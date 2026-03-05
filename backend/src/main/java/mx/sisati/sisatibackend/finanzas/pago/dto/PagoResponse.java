package mx.sisati.sisatibackend.finanzas.pago.dto;

import mx.sisati.sisatibackend.finanzas.pago.EstadoPago;
import mx.sisati.sisatibackend.finanzas.pago.MetodoPago;
import mx.sisati.sisatibackend.finanzas.pago.Moneda;
import mx.sisati.sisatibackend.finanzas.pago.Pago;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record PagoResponse(
        UUID id,
        BigDecimal monto,
        Moneda moneda,
        EstadoPago estado,
        String estadoDescripcion,
        MetodoPago metodoPago,
        String metodoPagoDescripcion,
        String descripcion,
        Boolean requiereFactura,
        LocalDateTime fechaExpiracion,
        String stripePaymentIntentId,
        UUID registradoPorUsuarioId,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,

        // Campos calculados: transiciones posibles
        Boolean estaExpirado,
        Boolean puedeProcesarse,
        Boolean puedeConfirmarse,
        Boolean puedeExpirarse,
        Boolean puedeCancelar,
        Boolean puedeReembolsarse,
        Boolean puedeFallar
) {
    public static PagoResponse fromEntity(Pago pago, LocalDateTime now) {
        if (pago == null) return null;

        boolean procesable = pago.puedeProcesarse();
        boolean confirmable = pago.puedeConfirmarse();
        boolean expirable = pago.puedeExpirarse();
        boolean cancelable = pago.puedeCancelar();
        boolean reembolsable = pago.puedeReembolsarse();
        boolean fallable = pago.puedeFallar();
        boolean expirado = pago.estaExpirado(now);

        return new PagoResponse(
                pago.getId(),
                pago.getMonto(),
                pago.getMoneda(),
                pago.getEstado(),
                pago.getEstado().getDescripcion(),
                pago.getMetodoPago(),
                pago.getMetodoPago() != null ? pago.getMetodoPago().name() : null,
                pago.getDescripcion(),
                pago.isRequiereFactura(),
                pago.getFechaExpiracion(),
                pago.getStripePaymentIntentId(),
                pago.getRegistradoPorUsuarioId(),
                pago.getCreatedAt(),
                pago.getUpdatedAt(),
                expirado,
                procesable,
                confirmable,
                expirable,
                cancelable,
                reembolsable,
                fallable
        );
    }
}