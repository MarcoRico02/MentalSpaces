package mx.sisati.sisatibackend.espacios.caracteristicas;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "caracteristicas")
public class Caracteristica {
    @Id
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(unique = true, nullable = false)
    private CaracteristicaNombre nombre;
}
