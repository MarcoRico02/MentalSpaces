package mx.sisati.sisatibackend.reserva.reagendamiento.dto;

import mx.sisati.sisatibackend.reserva.reagendamiento.EstadoSolicitudReagendamiento;
import mx.sisati.sisatibackend.reserva.reagendamiento.SolicitudReagendamiento;

import java.time.LocalDateTime;

public record SolicitudReagendamientoResponseDTO(
        Long id,
        Long idReserva,
        LocalDateTime inicio,
        LocalDateTime fin,
        String motivo,
        EstadoSolicitudReagendamiento estadoSolicitud,
        LocalDateTime fechaSolicitud
) {
    public static SolicitudReagendamientoResponseDTO fromEntity(SolicitudReagendamiento solicitud) {
        return new SolicitudReagendamientoResponseDTO(
                solicitud.getId(),
                solicitud.getReserva().getId(),
                solicitud.getInicio(),
                solicitud.getFin(),
                solicitud.getMotivo(),
                solicitud.getEstadoSolicitud(),
                solicitud.getCreatedAt()
        );
    }
}
