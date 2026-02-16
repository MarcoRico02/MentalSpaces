package mx.sisati.sisatibackend.suscripcion;

import lombok.RequiredArgsConstructor;
import mx.sisati.sisatibackend.suscripcion.dto.CrearSuscripcionRequest;
import mx.sisati.sisatibackend.suscripcion.dto.SuscripcionDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/suscripciones")
public class SuscripcionController {

    private final SuscripcionService suscripcionService;

    public SuscripcionController(SuscripcionService suscripcionService) {
        this.suscripcionService = suscripcionService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuscripcionDTO> crearPlan(@RequestBody CrearSuscripcionRequest request) {
        return ResponseEntity.ok(suscripcionService.crearPlan(request));
    }

    @GetMapping
    public ResponseEntity<List<SuscripcionDTO>> obtenerTodosLosPlanes() {
        return ResponseEntity.ok(suscripcionService.obtenerTodosLosPlanes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPlanPorId(@PathVariable Long id) {
        return ResponseEntity.ok(suscripcionService.obtenerPlanPorId(id));
    }

    @GetMapping("/ordenados-por-precio")
    public ResponseEntity<List<SuscripcionDTO>> obtenerPlanesOrdenadosPorPrecio() {
        return ResponseEntity.ok(suscripcionService.obtenerPlanesOrdenadosPorPrecio());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> actualizarPlan(
            @PathVariable Long id,
            @RequestBody CrearSuscripcionRequest request) {
        return ResponseEntity.ok(suscripcionService.actualizarPlan(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminarPlan(@PathVariable Long id) {
        suscripcionService.eliminarPlan(id);
        return ResponseEntity.ok().build();
    }
}