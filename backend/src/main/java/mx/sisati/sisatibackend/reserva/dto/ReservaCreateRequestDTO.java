package mx.sisati.sisatibackend.reserva.dto;

import java.time.LocalDateTime;

public record ReservaCreateRequestDTO(
        Long cubiculoId,
        LocalDateTime inicio,
        LocalDateTime fin,
        String notas,
        Long usuarioId
) {

}
