package mx.sisati.sisatibackend.espacios.disponibilidad.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.DayOfWeek;
import java.time.LocalTime;

public record DisponibilidadCreateRequestDTO(
        DayOfWeek diaSemana,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
        LocalTime horaInicio,

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
        LocalTime horaFin
) {
}
