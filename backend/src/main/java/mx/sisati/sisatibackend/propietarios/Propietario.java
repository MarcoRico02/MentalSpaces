package mx.sisati.sisatibackend.propietarios;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import mx.sisati.sisatibackend.excepciones.DomainException;
import mx.sisati.sisatibackend.usuarios.politicas.Usuario;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "propietarios")
public class Propietario {

    @Id
    private Long id;

    @OneToOne
    @MapsId
    private Usuario usuario;
    private String nombreNegocio;

    public Propietario(Usuario usuario, String nombreNegocio) {
        validate(usuario, nombreNegocio);
        this.usuario = usuario;

        this.nombreNegocio = nombreNegocio;
    }

    private void validate(Usuario usuario, String nombreNegocio) {
        validateUsuario(usuario);
        validateNombreNegocio(nombreNegocio);
    }

    private void validateUsuario(Usuario usuario) {
        if (usuario == null) {
            throw new DomainException(this.getClass(), "El psicólogo debe estar asociado a un usuario");
        }
    }

    private void validateNombreNegocio(String nombreNegocio) {
        if (nombreNegocio == null || nombreNegocio.isBlank()) {
            throw new DomainException(this.getClass(), "El nombre del negocio debe llenarse");
        }
    }
}
