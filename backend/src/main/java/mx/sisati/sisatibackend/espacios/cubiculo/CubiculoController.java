package mx.sisati.sisatibackend.espacios.cubiculo;

import mx.sisati.sisatibackend.espacios.cubiculo.aplicacion.GestionarCubiculos;
import mx.sisati.sisatibackend.espacios.cubiculo.dto.*;
import mx.sisati.sisatibackend.seguridad.UsuarioDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cubiculos")
public class CubiculoController {

    private final GestionarCubiculos gestionarCubiculo;

    public CubiculoController(GestionarCubiculos gestionarCubiculo) {
        this.gestionarCubiculo = gestionarCubiculo;
    }


    @PostMapping
    public ResponseEntity<CubiculoCreateResponseDTO> create(
            @RequestBody CubiculoCreateRequestDTO dto,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {

        return ResponseEntity.ok(gestionarCubiculo.create(dto, usuarioDetails.getUsuario().getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CubiculoUpdateResponseDTO> update(
            @PathVariable Long id,
            @RequestBody CubiculoUpdateRequestDTO dto,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {

        return ResponseEntity.ok(gestionarCubiculo.update(id, dto, usuarioDetails.getUsuario().getId()));
    }

    @GetMapping("/location/{locationId}")
    public ResponseEntity<List<CubiculoResponse>> findByLocation(
            @PathVariable Long locationId,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {

        List<CubiculoResponse> cubiculos = gestionarCubiculo.findCubiculosByLocation(locationId, usuarioDetails.getUsuario().getId());
        return ResponseEntity.ok(cubiculos);
    }

    @GetMapping("/location/{locationId}/active")
    public ResponseEntity<List<CubiculoResponse>> findActiveByLocation(
            @PathVariable Long locationId,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {

        List<CubiculoResponse> cubiculos = gestionarCubiculo.findActivedCubiculosByLocation(locationId, usuarioDetails.getUsuario().getId());
        return ResponseEntity.ok(cubiculos);
    }

    @PatchMapping("/{id}/activate")
    public ResponseEntity<Void> activate(
            @PathVariable Long id,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {

        gestionarCubiculo.activateCubiculo(id, usuarioDetails.getUsuario().getId());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivate(
            @PathVariable Long id,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {

        gestionarCubiculo.desactivateCubiculo(id, usuarioDetails.getUsuario().getId());
        return ResponseEntity.noContent().build();
    }
}