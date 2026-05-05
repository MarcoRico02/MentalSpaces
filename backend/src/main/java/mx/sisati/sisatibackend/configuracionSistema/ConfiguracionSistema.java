package mx.sisati.sisatibackend.configuracionSistema;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import mx.sisati.sisatibackend.excepciones.DomainException;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "configuracion_sistema")
public class ConfiguracionSistema {
    public static final int LONGITUD_MAXIMA_TEXTO = 100;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = LONGITUD_MAXIMA_TEXTO)
    private String clave;

    private Long valorMaximo;

    private Long valorMinimo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoUso tipoUso;

    @Column(length = LONGITUD_MAXIMA_TEXTO)
    private String descripcion;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public ConfiguracionSistema(String clave, Long valorMaximo, Long valorMinimo, TipoUso tipoUso, String descripcion) {
        validate(clave, valorMaximo, valorMinimo, tipoUso, descripcion);
        this.clave = clave;
        this.valorMaximo = valorMaximo;
        this.valorMinimo = valorMinimo;
        this.tipoUso = tipoUso;
        this.descripcion = descripcion;
    }

    private void validate(String clave, Long valorMaximo, Long valorMinimo, TipoUso tipoUso, String descripcion) {
        validateClave(clave);
        validateValores(valorMaximo, valorMinimo);
        validateTipoUso(tipoUso);
        validateDescripcion(descripcion);
    }

    private void validateDescripcion(String descripcion) {
        if (descripcion != null && descripcion.length() > LONGITUD_MAXIMA_TEXTO) {
            throw new DomainException(this.getClass(), "DESCRIPCION_DEMASIADO_LARGA");
        }
    }

    private void validateTipoUso(TipoUso tipoUso) {
        if (tipoUso == null) {
            throw new DomainException(this.getClass(), "TIPO_USO_REQUERIDO");
        }
    }

    private void validateValores(Long valorMaximo, Long valorMinimo) {
        if (valorMaximo == null && valorMinimo == null) {
            throw new DomainException(this.getClass(), "DEBE_TENER_AL_MENOS_UN_VALOR");
        }

        if (valorMaximo != null && valorMaximo < 0) {
            throw new DomainException(this.getClass(), "VALOR_MAXIMO_NO_PUEDE_SER_NEGATIVO");
        }

        if (valorMinimo != null && valorMinimo < 0) {
            throw new DomainException(this.getClass(), "VALOR_MINIMO_NO_PUEDE_SER_NEGATIVO");
        }

        if (valorMaximo != null && valorMinimo != null && valorMinimo > valorMaximo) {
            throw new DomainException(this.getClass(), "VALOR_MINIMO_MAYOR_QUE_MAXIMO");
        }
    }

    private void validateClave(String clave) {
        if (clave == null || clave.trim().isEmpty()) {
            throw new DomainException(this.getClass(), "CLAVE_REQUERIDA");
        }
        if (clave.length() > LONGITUD_MAXIMA_TEXTO) {
            throw new DomainException(this.getClass(), "CLAVE_DEMASIADO_LARGA");
        }
    }
}
