package mx.sisati.sisatibackend.reserva.dto;

import java.time.LocalDateTime;
import java.util.List;

public record ReservaCalendarioReadRequestDTO(
        LocalDateTime inicio,
        LocalDateTime fin,
        List<Long> cubiculoIds,
        List<Long> locationIds,
        List<Long> usuarioIds
) {}