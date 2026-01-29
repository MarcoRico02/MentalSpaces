package mx.sisati.sisatibackend.espacios.locations;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import mx.sisati.sisatibackend.excepciones.DomainException;
import mx.sisati.sisatibackend.identidad.propietarios.Propietario;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "locations")
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false)
    private boolean active = true;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "propietario_id", nullable = false)
    private Propietario propietario;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public Location(String name, String description, String address, Double latitude, Double longitude, Propietario propietario) {
        validate(name, description, address, latitude, longitude, propietario);
        this.name = name;
        this.description = description;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.propietario = propietario;
    }

    public void update(
            String name,
            String description,
            String address,
            Double latitude,
            Double longitude
    ) {
        validate(name, description, address, latitude, longitude, this.propietario);
        this.name = name;
        this.description = description;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
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

    private void validate(String name, String description, String address, Double latitude, Double longitude, Propietario propietario) {
        validateName(name);
        validateDescription(description);
        validateAddress(address);
        validateLatitude(latitude);
        validateLongitude(longitude);
        validatePropietario(propietario);
    }

    private void validateName(String name) {
        if (name == null || name.isBlank()) {
            throw new DomainException(this.getClass(), "El nombre de la locación es obligatorio");
        }
        if (name.length() > 100) {
            throw new DomainException(this.getClass(), "El nombre de la locación no puede exceder 100 caracteres");
        }
    }

    private void validateDescription(String description) {
        if (description != null && description.length() > 500) {
            throw new DomainException(this.getClass(), "La descripción no puede exceder 500 caracteres");
        }
    }

    private void validateAddress(String address) {
        if (address == null || address.isBlank()) {
            throw new DomainException(this.getClass(), "La dirección es obligatoria");
        }
    }

    private void validateLatitude(Double latitude) {
        if (latitude == null) {
            throw new DomainException(this.getClass(), "La latitud es obligatoria");
        }
        if (latitude < -90 || latitude > 90) {
            throw new DomainException(this.getClass(), "La latitud debe estar entre -90 y 90 grados");
        }
    }

    private void validateLongitude(Double longitude) {
        if (longitude == null) {
            throw new DomainException(this.getClass(), "La longitud es obligatoria");
        }
        if (longitude < -180 || longitude > 180) {
            throw new DomainException(this.getClass(), "La longitud debe estar entre -180 y 180 grados");
        }
    }

    public void validatePropietario(Propietario propietario) {
        if (propietario == null) {
            throw new DomainException(this.getClass(), "La locación debe estar asociada a un propietario");
        }
    }

    public void activateLocation(){
        if(this.isActive()){
            throw new DomainException(this.getClass(), "La locacion ya esta activa");
        }
        this.active = true;
    }

    public void desactivateLocation(){
        if(!this.isActive()){
            throw new DomainException(this.getClass(), "La locacion ya esta inactiva");
        }
        this.active = false;
    }

}