package mx.sisati.sisatibackend.reserva.reagendamiento;

import mx.sisati.sisatibackend.auth.UsuarioDetails;
import mx.sisati.sisatibackend.reserva.reagendamiento.application.GestionarSolicitudReagendamiento;
import mx.sisati.sisatibackend.reserva.reagendamiento.dto.CrearSolicitudReagendamientoRequestDTO;
import mx.sisati.sisatibackend.reserva.reagendamiento.dto.SolicitudReagendamientoResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/solicitudes-reagendamiento")
public class SolicitudReagendamientoController {

    private final GestionarSolicitudReagendamiento gestionarSolicitudReagendamiento;

    public SolicitudReagendamientoController(GestionarSolicitudReagendamiento gestionarSolicitudReagendamiento) {
        this.gestionarSolicitudReagendamiento = gestionarSolicitudReagendamiento;
    }

    @PostMapping
    public ResponseEntity<SolicitudReagendamientoResponseDTO> crearSolicitudReagendamiento(
            @RequestBody CrearSolicitudReagendamientoRequestDTO request,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {
        return ResponseEntity.ok(gestionarSolicitudReagendamiento.crear(request, usuarioDetails.getUsuario().getId()));
    }
}
