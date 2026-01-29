package mx.sisati.sisatibackend.espacios.cubiculo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import mx.sisati.sisatibackend.excepciones.DomainException;
import mx.sisati.sisatibackend.espacios.locations.Location;
import mx.sisati.sisatibackend.espacios.caracteristicas.Caracteristica;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "cubiculos")
public class Cubiculo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(length = 500)
    private String descripcion;

    @Column(nullable = false)
    private Double precio;

    @Column(length = 500)
    private String imageUrl;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "cubiculo_caracteristicas",
        joinColumns = @JoinColumn(name = "cubiculo_id"),
        inverseJoinColumns = @JoinColumn(name = "caracteristica_id")
    )
    private Set<Caracteristica> caracteristicas = new HashSet<>();

    @Column(nullable = false)
    private boolean active = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public Cubiculo(Location location, String nombre, String descripcion, Double precio, String imageUrl, Set<Caracteristica> caracteristicas) {
        validate(location, nombre, descripcion, precio);
        this.location = location;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.imageUrl = imageUrl;
        this.caracteristicas = caracteristicas;
    }

    public void update(String nombre, String descripcion, Double precio, String imageUrl, Set<Caracteristica> caracteristicas) {
        validateNombre(nombre);
        validateDescripcion(descripcion);
        validatePrecio(precio);
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.imageUrl = imageUrl;
        this.caracteristicas = caracteristicas != null ? caracteristicas : this.caracteristicas;
    }

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    private void validate(Location location, String nombre, String descripcion, Double precio) {
        validateLocation(location);
        validateNombre(nombre);
        validateDescripcion(descripcion);
        validatePrecio(precio);
    }

    private void validateLocation(Location location) {
        if (location == null) {
            throw new DomainException(this.getClass(), "El cubículo debe estar asociado a una location");
        }
    }

    private void validateNombre(String nombre) {
        if (nombre == null || nombre.isBlank()) {
            throw new DomainException(this.getClass(), "El nombre del cubículo es obligatorio");
        }
        if (nombre.length() > 100) {
            throw new DomainException(this.getClass(), "El nombre del cubículo no puede exceder 100 caracteres");
        }
    }

    private void validateDescripcion(String descripcion) {
        if (descripcion != null && descripcion.length() > 500) {
            throw new DomainException(this.getClass(), "La descripción no puede exceder 500 caracteres");
        }
    }

    private void validatePrecio(Double precio) {
        if (precio == null) {
            throw new DomainException(this.getClass(), "El precio es obligatorio");
        }
        if (precio < 0) {
            throw new DomainException(this.getClass(), "El precio no puede ser negativo");
        }
    }

    public void activate() {
        if (this.active) {
            throw new DomainException(this.getClass(), "El cubículo ya está activo");
        }
        this.active = true;
    }

    public void deactivate() {
        if (!this.active) {
            throw new DomainException(this.getClass(), "El cubículo ya está inactivo");
        }
        this.active = false;
    }
}