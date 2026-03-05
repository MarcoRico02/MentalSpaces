package mx.sisati.sisatibackend.identidad.usuarios;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import mx.sisati.sisatibackend.excepciones.DomainException;
import mx.sisati.sisatibackend.identidad.roles.Rol;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Pattern;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "usuarios")
public class Usuario{

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$"); //No lo se hacer a mano, pero hey, aqui esta;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "usuarios_roles",
            joinColumns = @JoinColumn(name = "usuario_id"),
            inverseJoinColumns = @JoinColumn(name = "rol_id")
    )
    private Set<Rol> roles = new HashSet<>();

    @Column(nullable = false, unique = true)
    private String email;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "foto_perfil_archivo_id")
    private UUID fotoPerfil;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public Usuario(String username, String password, String fullName, String email) {
        validate(username, password, fullName, email);
        this.username = username;
        this.password = password;
        this.fullName = fullName;
        this.email = email;
    }

    public void changeUsername(String newUsername){
        validateUsername(newUsername);
        this.username = newUsername;
    }

    public void activateUser(){
        if(this.isActive()){
            throw new DomainException(this.getClass(), "El usuario ya esta activo");
        }
        this.isActive = true;
    }

    public void desactivateUser(){
        if(!this.isActive()){
            throw new DomainException(this.getClass(), "El usuario ya esta inactivo");
        }
        this.isActive = false;
    }
    private void validate(String username, String password, String fullName, String email){
        validateUsername(username);
        validatePassword(password);
        validateFullName(fullName);
        validateEmail(email);
    }

    private void validateEmail(String email) {
        if (email.isBlank()) throw new DomainException(this.getClass(), "El correo debe llenarse");
        if (!EMAIL_PATTERN.matcher(email).matches()) throw new DomainException(this.getClass(), "El formato del correo electrónico no es válido");
    }

    private void validateFullName(String fullName) {
        if (fullName.isBlank()) throw new DomainException(this.getClass(), "El nombre completo del usuario debe llenarse");
    }

    private void validatePassword(String password) {
        if (password.isBlank()) throw new DomainException(this.getClass(), "La contraseña debe llenarse");
        if (password.length() < 8) throw new DomainException(this.getClass(), "La contraseña debe tener al menos 8 caracteres");
    }

    private void validateProfessionalType(String professionalType) {
        if (professionalType.isBlank()) throw new DomainException(this.getClass(), "La profesión debe de llenarse");
    }

    private void validateUsername(String username) {
        if (username.isBlank()) throw new DomainException(this.getClass(), "El nombre de usuario debe llenarse");
        if (username.length() < 3) throw new DomainException(this.getClass(), "El nombre de usuario debe contener almenos 3 letras");
    }
}
