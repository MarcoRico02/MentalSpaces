package mx.sisati.sisatibackend.agenda.reserva.dto;

import java.time.LocalDateTime;

public record ReservaCreateRequestDTO(
        Long cubiculoId,
        LocalDateTime inicio,
        LocalDateTime fin,
        String notas
) {

}
