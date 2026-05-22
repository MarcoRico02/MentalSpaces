package mx.sisati.sisatibackend.reserva.dto;

import mx.sisati.sisatibackend.reserva.EstadoReserva;
import mx.sisati.sisatibackend.reserva.Reserva;

import java.time.LocalDateTime;

public record ReservaDTO(
        Long id,
        Long cubiculoId,
        String cubiculoNombre,
        Long psicologoId,
        String psicologoNombreCompleto,
        LocalDateTime inicio,
        LocalDateTime fin,
        String notas,
        EstadoReserva estadoReserva,
        LocalDateTime createdAt
) {
    public static ReservaDTO fromEntity(Reserva reserva) {
        return new ReservaDTO(
                reserva.getId(),
                reserva.getCubiculo().getId(),
                reserva.getCubiculo().getNombre(),
                reserva.getPsicologo().getId(),
                reserva.getPsicologo().getUsuario().getFullName(),
                reserva.getInicio(),
                reserva.getFin(),
                reserva.getNotas(),
                reserva.getEstadoReserva(),
                reserva.getCreatedAt()
        );
    }
}