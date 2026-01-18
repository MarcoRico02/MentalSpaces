package mx.sisati.sisatibackend.identidad.propietarios;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import mx.sisati.sisatibackend.excepciones.DomainException;
import mx.sisati.sisatibackend.identidad.usuarios.Usuario;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "propietarios")
public class Propietario {

    @Id
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    @Column(unique = true, nullable = true)
    private String rfc;

    @Column(nullable = false)
    private boolean facturacionHabilitada = false;

    public Propietario(Usuario usuario) {
        validate(usuario);
        this.usuario = usuario;

    }

    private void validate(Usuario usuario) {
        validateUsuario(usuario);
        validateFacturacion();
    }

    private void validateUsuario(Usuario usuario) {
        if (usuario == null) {
            throw new DomainException(this.getClass(), "El propietario debe estar asociado a un usuario");
        }
    }

    private void validateFacturacion() {
        if (facturacionHabilitada && (rfc == null || rfc.isBlank())) {
            throw new DomainException(this.getClass(),
                    "El RFC es obligatorio cuando la facturación está habilitada");
        }
    }

}
