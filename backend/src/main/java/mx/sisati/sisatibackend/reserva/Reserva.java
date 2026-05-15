package mx.sisati.sisatibackend.reserva;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import mx.sisati.sisatibackend.espacios.cubiculo.Cubiculo;
import mx.sisati.sisatibackend.excepciones.DomainException;
import mx.sisati.sisatibackend.identidad.psicologos.Psicologo;
import mx.sisati.sisatibackend.reserva.reagendamiento.SolicitudReagendamiento;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "reservas")
public class Reserva {
    private static final int NOTAS_MAX_LENGTH = 300;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cubiculo_id", nullable = false)
    private Cubiculo cubiculo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "psicologo_id", nullable = false)
    private Psicologo psicologo;

    @Column(name = "inicio", nullable = false)
    private LocalDateTime inicio;


    @Column(name = "fin", nullable = false)
    private LocalDateTime fin;

    @Column(length = NOTAS_MAX_LENGTH)
    private String notas;


    @Enumerated(EnumType.STRING)
    @Column(name = "estado_reserva", nullable = false)
    private EstadoReserva estadoReserva = EstadoReserva.PENDIENTE;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "reserva", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SolicitudReagendamiento> solicitudesReagendamiento = new ArrayList<>();

    public Reserva(Cubiculo cubiculo, Psicologo psicologo, LocalDateTime inicio, LocalDateTime fin, String notas) {
        validate(cubiculo, psicologo, inicio, fin, notas);
        this.cubiculo = cubiculo;
        this.psicologo = psicologo;
        this.inicio = inicio;
        this.fin = fin;
        this.notas = notas;
    }

    private void validate(Cubiculo cubiculo, Psicologo psicologo, LocalDateTime inicio, LocalDateTime fin, String notas){
        validateCubiculo(cubiculo);
        validatePsicologo(psicologo);
        validateHoras(inicio, fin);
        validateNotas(notas);
    }

    private void validateCubiculo(Cubiculo cubiculo) {
        if(cubiculo == null){
            throw new DomainException(this.getClass(), "CUBICULO_REQUERIDO");
        }
    }

    private void validateNotas(String notas) {
        if (notas != null && notas.length() > NOTAS_MAX_LENGTH)
            throw new DomainException(this.getClass(), "RESERVA_TAMAÑO_NOTAS_SUPERADO");
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

    private void validatePsicologo(Psicologo psicologo) {
        if(psicologo == null){
            throw new DomainException(this.getClass(), "PSICOLOGO_REQUERIDO");
        }
    }
}