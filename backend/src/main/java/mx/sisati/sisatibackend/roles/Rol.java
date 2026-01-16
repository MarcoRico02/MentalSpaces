package mx.sisati.sisatibackend.roles;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "roles")
public class Rol {

    @Id
    private Long id;

    @Column(unique = true, nullable = false)
    private String nombre;
}