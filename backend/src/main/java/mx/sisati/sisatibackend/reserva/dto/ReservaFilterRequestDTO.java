package mx.sisati.sisatibackend.reserva.dto;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;

public record ReservaFilterRequestDTO(
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin,
        List<Long> cubiculoIds,
        List<Long> locationIds,
        List<Long> usuarioIds,
        String filtroTemporal
) {}