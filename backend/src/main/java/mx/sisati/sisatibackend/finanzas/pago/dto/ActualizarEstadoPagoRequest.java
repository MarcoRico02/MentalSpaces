package mx.sisati.sisatibackend.finanzas.pago.dto;

import jakarta.validation.constraints.NotNull;
import mx.sisati.sisatibackend.finanzas.pago.EstadoPago;

public record ActualizarEstadoPagoRequest(
        @NotNull(message = "El nuevo estado es obligatorio")
        EstadoPago nuevoEstado,
        String stripePaymentIntentId,
        String motivo
) {}