package mx.sisati.sisatibackend.espacios.disponibilidad.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import mx.sisati.sisatibackend.espacios.disponibilidad.Disponibilidad;

import java.time.DayOfWeek;
import java.time.LocalTime;

public record DisponibilidadResponseDTO(
        Long id,
        DayOfWeek diaSemana,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
        LocalTime horaInicio,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
        LocalTime horaFin
) {
    public DisponibilidadResponseDTO(Disponibilidad disponibilidad) {
        this(
                disponibilidad.getId(),
                disponibilidad.getDiaSemana(),
                disponibilidad.getHoraInicio(),
                disponibilidad.getHoraFin()
        );
    }
}