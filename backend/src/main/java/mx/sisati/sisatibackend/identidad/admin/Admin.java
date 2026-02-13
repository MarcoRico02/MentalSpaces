package mx.sisati.sisatibackend.identidad.admin;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import mx.sisati.sisatibackend.excepciones.DomainException;
import mx.sisati.sisatibackend.identidad.usuarios.Usuario;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "admins")
public class Admin {
    @Id
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    public Admin(Usuario usuario) {
        validate(usuario);
        this.usuario = usuario;
    }

    private void validate(Usuario usuario) {
        if(usuario == null){
            throw new DomainException(this.getClass(), "USUARIO_REQUERIDO");
        }
    }
}
