package mx.sisati.sisatibackend.espacios.disponibilidad;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import mx.sisati.sisatibackend.espacios.cubiculo.Cubiculo;
import mx.sisati.sisatibackend.excepciones.DomainException;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalTime;

@Entity
@Table(name = "disponibilidades")
@Getter
@NoArgsConstructor
public class Disponibilidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cubiculo_id", nullable = false)
    private Cubiculo cubiculo;

    @Enumerated(EnumType.STRING)
    @Column(name = "dia_semana", nullable = false, length = 10)
    private DayOfWeek diaSemana;

    @Column(name = "hora_inicio", nullable = false)
    private LocalTime horaInicio;

    @Column(name = "hora_fin", nullable = false)
    private LocalTime horaFin;

    public Disponibilidad(
            Cubiculo cubiculo,
            DayOfWeek diaSemana,
            LocalTime horaInicio,
            LocalTime horaFin
    ) {
        validate(cubiculo, diaSemana, horaInicio, horaFin);
        this.cubiculo = cubiculo;
        this.diaSemana = diaSemana;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
    }


    public void update(DayOfWeek diaSemana, LocalTime horaInicio, LocalTime horaFin) {
        validateDiaSemana(diaSemana);
        validateHoras(horaInicio, horaFin);
        this.diaSemana = diaSemana;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
    }

    private void validate(
            Cubiculo cubiculo,
            DayOfWeek diaSemana,
            LocalTime horaInicio,
            LocalTime horaFin
    ) {
        validateCubiculo(cubiculo);
        validateDiaSemana(diaSemana);
        validateHoras(horaInicio, horaFin);
    }

    private void validateHoras(LocalTime horaInicio, LocalTime horaFin) {
        if (horaInicio == null || horaFin == null)
            throw new DomainException(this.getClass(), "Las horas son obligatorias");

        if (!horaFin.isAfter(horaInicio))
            throw new DomainException(this.getClass(), "La hora fin debe ser posterior a la hora inicio");

        Duration duracion = Duration.between(horaInicio, horaFin);

        if (duracion.toMinutes() < 60)
            throw new DomainException(this.getClass(), "La disponibilidad mínima es de una hora");
    }

    private void validateDiaSemana(DayOfWeek diaSemana) {
        if (diaSemana == null)
            throw new DomainException(this.getClass(), "El día de la semana es obligatorio");
    }

    private void validateCubiculo(Cubiculo cubiculo) {
        if (cubiculo == null)
            throw new DomainException(this.getClass(), "La disponibilidad debe pertenecer a un cubículo");
    }
}
