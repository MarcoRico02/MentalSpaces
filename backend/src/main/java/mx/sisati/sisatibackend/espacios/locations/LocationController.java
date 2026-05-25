package mx.sisati.sisatibackend.espacios.locations;

import mx.sisati.sisatibackend.espacios.locations.aplicacion.GestionarLocations;
import mx.sisati.sisatibackend.espacios.locations.dto.LocationCreateRequestDTO;
import mx.sisati.sisatibackend.espacios.locations.dto.LocationResponseDTO;
import mx.sisati.sisatibackend.auth.UsuarioDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/locations")
public class LocationController {

    private final GestionarLocations gestionarLocations;

    public LocationController(GestionarLocations gestionarLocations) {
        this.gestionarLocations = gestionarLocations;
    }

    @GetMapping
    public ResponseEntity<Page<LocationResponseDTO>> findAll(
            @AuthenticationPrincipal UsuarioDetails usuarioDetails,
            @PageableDefault(size = 10) Pageable pageable) {

        return ResponseEntity.ok(
                gestionarLocations.findByPropietario(usuarioDetails.getUsuario().getId(), pageable)
        );
    }

    @GetMapping("/active")
    public ResponseEntity<List<LocationResponseDTO>> findAllActive() {
        return ResponseEntity.ok(gestionarLocations.findAllActive());
    }

    @GetMapping("/with-active-cubiculos")
    public ResponseEntity<List<LocationResponseDTO>> findActiveWithActiveCubiculos() {
        return ResponseEntity.ok(gestionarLocations.findActiveWithActiveCubiculos());
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
