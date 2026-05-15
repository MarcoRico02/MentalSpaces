package mx.sisati.sisatibackend.reserva.reagendamiento;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import mx.sisati.sisatibackend.excepciones.DomainException;
import mx.sisati.sisatibackend.reserva.Reserva;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "solicitudes_reagendamiento")
public class SolicitudReagendamiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reserva_id", nullable = false)
    private Reserva reserva;

    @Column(nullable = false)
    private LocalDateTime inicio;

    @Column(nullable = false)
    private LocalDateTime fin;

    @Column(nullable = false)
    private String motivo;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_solicitud", nullable = false)
    private EstadoSolicitudReagendamiento estadoSolicitud = EstadoSolicitudReagendamiento.PENDIENTE;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(name = "motivo_rechazo")
    private String motivoRechazo;

    private static final int MOTIVO_MAX_LENGTH = 500;

    public SolicitudReagendamiento(Reserva reserva, LocalDateTime inicio, LocalDateTime fin, String motivo) {
        validate(reserva, inicio, fin, motivo);
        this.reserva = reserva;
        this.inicio = inicio;
        this.fin = fin;
        this.motivo = motivo;
    }

    private void validate(Reserva reserva, LocalDateTime inicio, LocalDateTime fin, String motivo) {
        validateReserva(reserva);
        validateHoras(inicio, fin);
        validateMotivo(motivo);
    }

    private void validateReserva(Reserva reserva) {
        if (reserva == null) {
            throw new DomainException(this.getClass(), "RESERVA_REQUERIDA");
        }
    }

    private void validateHoras(LocalDateTime inicio, LocalDateTime fin) {
        if (inicio == null || fin == null)
            throw new DomainException(this.getClass(), "HORAS_REQUERIDAS");

        if (inicio.getMinute() != 0 || inicio.getSecond() != 0 || inicio.getNano() != 0 ||
                fin.getMinute() != 0 || fin.getSecond() != 0 || fin.getNano() != 0)
            throw new DomainException(this.getClass(), "HORARIO_DEBEN_SER_EN_BLOQUES_DE_UNA_HORA");

        if (!fin.isAfter(inicio))
            throw new DomainException(this.getClass(), "HORA_FIN_DEBE_SER_POSTERIOR_A_HORA_INICIO");

        if (!inicio.toLocalDate().equals(fin.toLocalDate()))
            throw new DomainException(this.getClass(), "RESERVAR_EN_DIFERENTES_DIAS_NO_ESTA_PERMITIDO");
    }

    private void validateMotivo(String motivo) {
        if (motivo == null || motivo.isBlank())
            throw new DomainException(this.getClass(), "MOTIVO_REQUERIDO");

        if (motivo.length() > MOTIVO_MAX_LENGTH)
            throw new DomainException(this.getClass(), "MOTIVO_TAMAÑO_SUPERADO");
    }
}
