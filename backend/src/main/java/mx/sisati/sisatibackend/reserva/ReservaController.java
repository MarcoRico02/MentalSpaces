package mx.sisati.sisatibackend.reserva;

import mx.sisati.sisatibackend.reserva.aplicacion.GestionarReservas;
import mx.sisati.sisatibackend.reserva.dto.ReservaCreateRequestDTO;
import mx.sisati.sisatibackend.reserva.dto.ReservaCreateResponseDTO;
import mx.sisati.sisatibackend.auth.UsuarioDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reservas")
public class ReservaController {

    private final GestionarReservas gestionarReservas;

    public ReservaController(GestionarReservas gestionarReservas) {
        this.gestionarReservas = gestionarReservas;
    }

    @PostMapping
    public ResponseEntity<ReservaCreateResponseDTO> createReserva(
            @RequestBody ReservaCreateRequestDTO dtos,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {
        return ResponseEntity.ok(gestionarReservas.create(dtos, usuarioDetails.getUsuario().getId()));
    }
}
