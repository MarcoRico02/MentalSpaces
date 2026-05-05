package mx.sisati.sisatibackend.suscripcion.propietarioSuscripcion.dto;



import mx.sisati.sisatibackend.suscripcion.propietarioSuscripcion.PropietarioSuscripcion;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

public record PropietarioSuscripcionDTO(
        Long id,
        Long propietarioId,
        String nombrePropietario,
        Long suscripcionId,
        String nombrePlan,
        BigDecimal precio,
        Integer cubiculosPermitidos,
        BigDecimal comisionPorcentaje,
        LocalDateTime fechaInicio,
        LocalDateTime fechaFin,
        Boolean autoRenovacion,
        Boolean estaActiva,
        Boolean estaExpirada,
        Long diasRestantes
) {
    public static PropietarioSuscripcionDTO fromEntity(PropietarioSuscripcion ps, Clock clock) {
        Long diasRestantes = null;
        if (ps.estaActiva(LocalDateTime.now(clock))) {
            diasRestantes = ChronoUnit.DAYS.between(LocalDateTime.now(clock), ps.getFechaFin());
        }

        return new PropietarioSuscripcionDTO(
                ps.getId(),
                ps.getPropietario().getId(),
                ps.getPropietario().getUsuario().getUsername(),
                ps.getSuscripcion().getId(),
                ps.getSuscripcion().getNombre(),
                ps.getSuscripcion().getPrecio(),
                ps.getSuscripcion().getCubiculosActivosPermitidos(),
                ps.getSuscripcion().getComisionPorcentaje(),
                ps.getFechaInicio(),
                ps.getFechaFin(),
                ps.getAutoRenovacion(),
                ps.estaActiva(LocalDateTime.now(clock)),
                ps.estaExpirada(LocalDateTime.now(clock)),
                diasRestantes
        );
    }
}
