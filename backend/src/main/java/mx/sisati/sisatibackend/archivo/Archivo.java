package mx.sisati.sisatibackend.archivo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import mx.sisati.sisatibackend.excepciones.DomainException;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@NoArgsConstructor
@Table(
        name = "archivos",
        indexes = {
                @Index(name = "idx_archivo_referencia", columnList = "tipo_entidad, entidad_referenciada")
        }
)
public class Archivo {

    @Id
    @GeneratedValue
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_entidad", nullable = false, length = 50)
    private TipoEntidad tipoEntidad;

    @Column(name = "entidad_referenciada", nullable = false)
    private Long entidadReferenciada;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_archivo", nullable = false, length = 50)
    private TipoArchivo tipoArchivo;

    @Column(name = "nombre_original", nullable = false, length = 255)
    private String nombreOriginal;

    @Column(name = "ruta_archivo", nullable = false, length = 500)
    private String rutaArchivo;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(name = "checksum", length = 64)
    private String checksum;

    @Column(name = "orden_visual")
    private Integer ordenVisual;

    public Archivo(TipoEntidad tipoEntidad, Long entidadReferenciada, TipoArchivo tipoArchivo, String nombreOriginal, String rutaArchivo) {
        validate(tipoEntidad, entidadReferenciada, tipoArchivo, nombreOriginal, rutaArchivo);
        this.tipoEntidad = tipoEntidad;
        this.entidadReferenciada = entidadReferenciada;
        this.tipoArchivo = tipoArchivo;
        this.nombreOriginal = nombreOriginal;
        this.rutaArchivo = rutaArchivo;
    }

    private void validate(TipoEntidad tipoEntidad, Long entidadReferenciada, TipoArchivo tipoArchivo, String nombreOriginal, String rutaArchivo) {
        if (tipoEntidad == null) {
            throw new DomainException(this.getClass(), "TIPO_ENTIDAD_REQUERIDA");
        }
        if (entidadReferenciada == null) {
            throw new DomainException(this.getClass(), "REFERENCIA_REQUERIDA");
        }
        if (tipoArchivo == null) {
            throw new DomainException(this.getClass(), "TIPO_ARCHIVO_REQUERIDO");
        }
        if (nombreOriginal == null || nombreOriginal.isBlank()) {
            throw new DomainException(this.getClass(), "NOMBRE_ARCHIVO_REQUERIDO");
        }
        if (rutaArchivo == null || rutaArchivo.isBlank()) {
            throw new DomainException(this.getClass(), "RUTA_ARCHIVO_REQUERIDO");
        }
    }
}