package mx.sisati.sisatibackend.espacios.cubiculo;

import mx.sisati.sisatibackend.espacios.cubiculo.aplicacion.GestionarCubiculos;
import mx.sisati.sisatibackend.espacios.cubiculo.dto.*;
import mx.sisati.sisatibackend.auth.UsuarioDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<Page<CubiculoResponse>> findByLocation(
            @PathVariable Long locationId,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails,
            @PageableDefault(size = 10) Pageable pageable) {

        Page<CubiculoResponse> cubiculos = gestionarCubiculo.findCubiculosByLocation(locationId, usuarioDetails.getUsuario().getId(), pageable);
        return ResponseEntity.ok(cubiculos);
    }

    @GetMapping("/location/{locationId}/active")
    public ResponseEntity<Page<CubiculoResponse>> findActiveByLocation(
            @PathVariable Long locationId,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails,
            @PageableDefault(size = 10) Pageable pageable) {

        Page<CubiculoResponse> cubiculos = gestionarCubiculo.findActivedCubiculosByLocation(locationId, usuarioDetails.getUsuario().getId(), pageable);
        return ResponseEntity.ok(cubiculos);
    }

    @GetMapping("/location/{locationId}/active-public")
    public ResponseEntity<List<CubiculoResponse>> findActiveByLocationPublic(
            @PathVariable Long locationId) {

        return ResponseEntity.ok(gestionarCubiculo.findActiveByLocationPublic(locationId));
    }

    @GetMapping("/active-public")
    public ResponseEntity<List<CubiculoResponse>> findAllActivePublic() {
        return ResponseEntity.ok(gestionarCubiculo.findAllActivePublic());
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

    @GetMapping("/{id}")
    public ResponseEntity<CubiculoResponse> findById(
            @PathVariable Long id,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {

        CubiculoResponse cubiculo = gestionarCubiculo.findById(id, usuarioDetails.getUsuario().getId());
        return ResponseEntity.ok(cubiculo);
    }
}