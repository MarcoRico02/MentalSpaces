package mx.sisati.sisatibackend.espacios.disponibilidad.dto;

import mx.sisati.sisatibackend.espacios.disponibilidad.Disponibilidad;

import java.time.DayOfWeek;
import java.time.LocalTime;

public record DisponibilidadResponseDTO(
        Long id,
        DayOfWeek diaSemana,
        LocalTime horaInicio,
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