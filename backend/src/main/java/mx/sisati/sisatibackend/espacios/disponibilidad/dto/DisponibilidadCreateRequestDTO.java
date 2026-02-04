package mx.sisati.sisatibackend.espacios.disponibilidad.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import mx.sisati.sisatibackend.espacios.disponibilidad.DiaSemana;

import java.time.LocalTime;

public record DisponibilidadCreateRequestDTO(
        DiaSemana diaSemana,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
        LocalTime horaInicio,

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
        LocalTime horaFin
) {
}
