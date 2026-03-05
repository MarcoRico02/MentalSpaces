package mx.sisati.sisatibackend.suscripcion.dto;

import mx.sisati.sisatibackend.suscripcion.Suscripcion;

import java.math.BigDecimal;

public record SuscripcionDTO(
    Long id,
    String nombre,
    BigDecimal precio,
    Integer cubiculosActivosPermitidos,
    BigDecimal comisionPorcentaje,
    String descripcion
) {
    public static SuscripcionDTO fromEntity(Suscripcion suscripcion) {
        return new SuscripcionDTO(
            suscripcion.getId(),
            suscripcion.getNombre(),
            suscripcion.getPrecio(),
            suscripcion.getCubiculosActivosPermitidos(),
            suscripcion.getComisionPorcentaje(),
            suscripcion.getDescripcion()
        );
    }
}
