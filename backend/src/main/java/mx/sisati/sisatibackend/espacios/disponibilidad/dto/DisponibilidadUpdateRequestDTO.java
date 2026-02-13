package mx.sisati.sisatibackend.espacios.disponibilidad.dto;


import java.time.DayOfWeek;
import java.time.LocalTime;

public record DisponibilidadUpdateRequestDTO(
        DayOfWeek diaSemana,
        LocalTime horaInicio,
        LocalTime horaFin
) {}