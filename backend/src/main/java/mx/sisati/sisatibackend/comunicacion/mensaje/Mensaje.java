package mx.sisati.sisatibackend.comunicacion.mensaje;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import mx.sisati.sisatibackend.comunicacion.conversacion.Conversacion;
import mx.sisati.sisatibackend.identidad.usuarios.Usuario;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "mensajes")
public class Mensaje {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "conversacion_id", nullable = false)
    private Conversacion conversacion;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "remitente_id", nullable = false)
    private Usuario usuario;

    @Column(length = 200)
    private String contenido;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;
}
