package mx.sisati.sisatibackend.suscripcion;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import mx.sisati.sisatibackend.excepciones.DomainException;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "suscripcion")
public class Suscripcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    @Column(name = "cubiculos_activos_permitidos", nullable = false)
    private Integer cubiculosActivosPermitidos;

    @Column(name = "comision_porcentaje", nullable = false, precision = 5, scale = 2)
    private BigDecimal comisionPorcentaje;

    @Column
    private String descripcion;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public Suscripcion(String nombre, BigDecimal precio, Integer cubiculosActivosPermitidos,
                       BigDecimal comisionPorcentaje, String descripcion) {
        validate(nombre, precio, cubiculosActivosPermitidos, comisionPorcentaje);
        this.nombre = nombre;
        this.precio = precio;
        this.cubiculosActivosPermitidos = cubiculosActivosPermitidos;
        this.comisionPorcentaje = comisionPorcentaje;
        this.descripcion = descripcion;
    }

    // Validaciones
    private void validate(String nombre, BigDecimal precio, Integer cubiculosActivosPermitidos,
                          BigDecimal comisionPorcentaje) {
        if (nombre == null || nombre.isBlank()) {
            throw new DomainException(this.getClass(), "REQUIERE_NOMBRE");
        }
        if (precio == null) {
            throw new DomainException(this.getClass(), "REQUIERE_PRECIO");
        }
        if (precio.compareTo(BigDecimal.ZERO) < 0) {
            throw new DomainException(this.getClass(), "PRECIO_NO_PUEDE_SER_NEGATIVO");
        }
        if (cubiculosActivosPermitidos == null) {
            throw new DomainException(this.getClass(), "REQUIERE_CUBICULOS_ACTIVOS_PERMITIDOS");
        }
        if (cubiculosActivosPermitidos <= 0) {
            throw new DomainException(this.getClass(), "CUBICULOS_ACTIVOS_DEBE_SER_POSITIVO");
        }
        if (comisionPorcentaje == null) {
            throw new DomainException(this.getClass(), "REQUIERE_COMISION_PORCENTAJE");
        }
        if (comisionPorcentaje.compareTo(BigDecimal.ZERO) < 0) {
            throw new DomainException(this.getClass(), "COMISION_NO_PUEDE_SER_NEGATIVA");
        }
        if (comisionPorcentaje.compareTo(new BigDecimal("100")) > 0) {
            throw new DomainException(this.getClass(), "COMISION_NO_PUEDE_EXCEDER_100");
        }
    }

    // Métodos de actualización
    public void actualizar(String nombre, BigDecimal precio, Integer cubiculosActivosPermitidos,
                           BigDecimal comisionPorcentaje, String descripcion) {
        validate(nombre, precio, cubiculosActivosPermitidos, comisionPorcentaje);
        this.nombre = nombre;
        this.precio = precio;
        this.cubiculosActivosPermitidos = cubiculosActivosPermitidos;
        this.comisionPorcentaje = comisionPorcentaje;
        this.descripcion = descripcion;
    }

    // Métodos de utilidad
    public BigDecimal calcularComision(BigDecimal montoPago) {
        if (montoPago == null || montoPago.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        return montoPago.multiply(comisionPorcentaje).divide(new BigDecimal("100"), 2, java.math.RoundingMode.HALF_UP);
    }

    public boolean permiteMasCubiculos(int cubiculosActuales) {
        return cubiculosActuales < this.cubiculosActivosPermitidos;
    }

    public int cubiculosRestantes(int cubiculosActuales) {
        return Math.max(0, this.cubiculosActivosPermitidos - cubiculosActuales);
    }
}