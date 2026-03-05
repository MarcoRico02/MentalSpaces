package mx.sisati.sisatibackend.suscripcion.dto;

import java.math.BigDecimal;

public record CrearSuscripcionRequest(
    String nombre,
    BigDecimal precio,
    Integer cubiculosActivosPermitidos,
    BigDecimal comisionPorcentaje,
    String descripcion
) {
}
