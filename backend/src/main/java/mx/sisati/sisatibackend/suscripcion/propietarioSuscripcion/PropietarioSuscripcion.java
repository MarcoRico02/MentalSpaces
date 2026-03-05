package mx.sisati.sisatibackend.suscripcion.propietarioSuscripcion;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import mx.sisati.sisatibackend.excepciones.DomainException;
import mx.sisati.sisatibackend.identidad.propietarios.Propietario;
import mx.sisati.sisatibackend.suscripcion.Suscripcion;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "propietario_suscripcion")
public class PropietarioSuscripcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "propietario_id", nullable = false)
    private Propietario propietario;

    @ManyToOne(optional = false)
    @JoinColumn(name = "suscripcion_id", nullable = false)
    private Suscripcion suscripcion;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDateTime fechaInicio;

    @Column(name = "fecha_fin", nullable = false)
    private LocalDateTime fechaFin;

    @Column(name = "auto_renovacion", nullable = false)
    private Boolean autoRenovacion = false;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(name = "cancelada_en")
    private LocalDateTime canceladaEn;

    // Constructor para nueva suscripción
    public PropietarioSuscripcion(Propietario propietario, Suscripcion suscripcion,
                                  Boolean autoRenovacion, LocalDateTime now) {
        validate(propietario, suscripcion);
        this.propietario = propietario;
        this.suscripcion = suscripcion;
        this.fechaInicio = now;
        this.fechaFin = this.fechaInicio.plusMonths(1);
        this.autoRenovacion = autoRenovacion != null ? autoRenovacion : false;
    }


    // Métodos de negocio
    public boolean estaActiva(LocalDateTime now) {
        return now.isBefore(this.fechaFin);
    }

    public boolean estaExpirada(LocalDateTime now) {
        return now.isAfter(this.fechaFin);
    }

    public void activarAutoRenovacion(LocalDateTime now) {
        if (estaExpirada(now)) {
            throw new DomainException(this.getClass(), "SUSCRIPCION_EXPIRADA");
        }
        this.autoRenovacion = true;
    }

    public void desactivarAutoRenovacion() {
        this.autoRenovacion = false;
    }

    // Métodos de utilidad para cubículos
    public boolean puedeTenerMasCubiculos(int cubiculosActuales, LocalDateTime now) {
        return estaActiva(now) && suscripcion.permiteMasCubiculos(cubiculosActuales);
    }

    public int cubiculosRestantes(int cubiculosActuales, LocalDateTime now) {
        if (!estaActiva(now)) {
            return 0;
        }
        return suscripcion.cubiculosRestantes(cubiculosActuales);
    }

    public Integer getCubiculosPermitidos() {
        return suscripcion.getCubiculosActivosPermitidos();
    }

    // Validaciones
    private void validate(Propietario propietario, Suscripcion suscripcion) {
        if (propietario == null) {
            throw new DomainException(this.getClass(), "PROPIETARIO_REQUERIDO");
        }
        if (suscripcion == null) {
            throw new DomainException(this.getClass(), "SUSCRIPCION_REQUERIDA");
        }
    }

    public void cancelar(LocalDateTime now) {
        if (this.canceladaEn != null) {
            throw new DomainException(this.getClass(), "YA_CANCELADA");
        }
        this.autoRenovacion = false; // ya no renovará
        this.canceladaEn = now;      // registra intención
    }
}