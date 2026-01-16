package mx.sisati.sisatibackend.psicologos;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import mx.sisati.sisatibackend.excepciones.DomainException;
import mx.sisati.sisatibackend.usuarios.politicas.Usuario;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "psicologos")
public class Psicologo {
    @Id
    @Column(unique = true, nullable = false)
    private Long id;

    @OneToOne(optional = false)
    @MapsId
    @JoinColumn(name = "usuario_id", unique = true, nullable = false)
    private Usuario usuario;

    @Column(name = "professional_type", nullable = false)
    private String professionalType;

    @Column(name = "identification_url")
    private String identificationUrl;

    @Column(name = "diploma_url")
    private String diplomaUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "documentation_status", nullable = false)
    private DocumentationStatus documentationStatus = DocumentationStatus.NONE;

    public Psicologo(Usuario usuario, String professionalType) {
        validate(usuario, professionalType);
        this.usuario = usuario;
        this.professionalType = professionalType;
    }

    private void validate(Usuario usuario, String professionalType) {
        validateUsuario(usuario);
        validateProfessionalType(professionalType);
    }

    private void validateProfessionalType(String professionalType) {
        if (professionalType == null || professionalType.isBlank()) {
            throw new DomainException(this.getClass(), "La profesión debe llenarse");
        }
    }

    private void validateUsuario(Usuario usuario) {
        if (usuario == null) {
            throw new DomainException(this.getClass(), "El psicólogo debe estar asociado a un usuario");
        }
    }
}
