package mx.sisati.sisatibackend.finanzas.pago.dto;

import jakarta.validation.constraints.*;
import mx.sisati.sisatibackend.finanzas.pago.Moneda;

import java.math.BigDecimal;

public record CrearPagoRequest(
        @NotNull @DecimalMin("0.01") BigDecimal monto,
        Moneda moneda,
        @NotBlank @Size(max = 500) String descripcion,
        @Positive Integer minutosExpiracion
) {}