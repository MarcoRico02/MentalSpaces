package mx.sisati.sisatibackend.reserva.dto;

import mx.sisati.sisatibackend.reserva.EstadoReserva;
import mx.sisati.sisatibackend.reserva.Reserva;

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
