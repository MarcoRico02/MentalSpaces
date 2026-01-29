package mx.sisati.sisatibackend.espacios.locations;

import mx.sisati.sisatibackend.espacios.locations.aplicacion.GestionarLocations;
import mx.sisati.sisatibackend.espacios.locations.dto.LocationCreateRequestDTO;
import mx.sisati.sisatibackend.espacios.locations.dto.LocationResponseDTO;
import mx.sisati.sisatibackend.seguridad.UsuarioDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/locations")
public class LocationController {

    private final GestionarLocations gestionarLocations;

    public LocationController(GestionarLocations gestionarLocations) {
        this.gestionarLocations = gestionarLocations;
    }

    @GetMapping
    public ResponseEntity<List<LocationResponseDTO>> findAll(
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {

        return ResponseEntity.ok(
                gestionarLocations.findByPropietario(usuarioDetails.getUsuario().getId())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<LocationResponseDTO> findById(
            @PathVariable Long id,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {

        return ResponseEntity.ok(
                gestionarLocations.findById(id, usuarioDetails.getUsuario().getId())
        );
    }

    @PostMapping
    public ResponseEntity<LocationResponseDTO> create(
            @RequestBody LocationCreateRequestDTO dto,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {

        return ResponseEntity.ok(
                gestionarLocations.create(dto, usuarioDetails.getUsuario().getId())
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<LocationResponseDTO> update(
            @PathVariable Long id,
            @RequestBody LocationCreateRequestDTO dto,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {

        return ResponseEntity.ok(
                gestionarLocations.update(id, dto, usuarioDetails.getUsuario().getId())
        );
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivate(
            @PathVariable Long id,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {

        gestionarLocations.desactivate(id, usuarioDetails.getUsuario().getId());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/activate")
    public ResponseEntity<Void> activate(
            @PathVariable Long id,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {

        gestionarLocations.activate(id, usuarioDetails.getUsuario().getId());
        return ResponseEntity.noContent().build();
    }
}
