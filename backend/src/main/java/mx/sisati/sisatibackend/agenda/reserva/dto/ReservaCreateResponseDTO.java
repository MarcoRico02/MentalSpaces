package mx.sisati.sisatibackend.agenda.reserva.dto;

import mx.sisati.sisatibackend.agenda.reserva.EstadoReserva;
import mx.sisati.sisatibackend.agenda.reserva.Reserva;

import java.time.LocalDateTime;

public record ReservaCreateResponseDTO(
        Long reservaId,
        Long cubiculoId,
        LocalDateTime inicio,
        LocalDateTime fin,
        EstadoReserva estadoReserva
) {
    public ReservaCreateResponseDTO(Reserva reserva, Long cubiculoId) {
        this(reserva.getId(), cubiculoId, reserva.getInicio(), reserva.getFin(), reserva.getEstadoReserva());
    }
}
