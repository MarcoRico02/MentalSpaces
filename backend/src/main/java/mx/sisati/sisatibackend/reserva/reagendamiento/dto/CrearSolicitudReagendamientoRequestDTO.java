package mx.sisati.sisatibackend.reserva.reagendamiento.dto;

import java.time.LocalDateTime;

public record CrearSolicitudReagendamientoRequestDTO(
        Long idReserva,
        LocalDateTime inicio,
        LocalDateTime fin,
        String motivo
) {
}
