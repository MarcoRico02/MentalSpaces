package mx.sisati.sisatibackend.agenda.reserva;

import mx.sisati.sisatibackend.agenda.reserva.aplicacion.GestionarReservas;
import mx.sisati.sisatibackend.agenda.reserva.dto.ReservaCreateRequestDTO;
import mx.sisati.sisatibackend.agenda.reserva.dto.ReservaCreateResponseDTO;
import mx.sisati.sisatibackend.auth.UsuarioDetails;
import mx.sisati.sisatibackend.espacios.disponibilidad.dto.DisponibilidadCreateRequestDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reservas")
public class ReservaController {

    private final GestionarReservas gestionarReservas;

    public ReservaController(GestionarReservas gestionarReservas) {
        this.gestionarReservas = gestionarReservas;
    }

    @PostMapping
    public ResponseEntity<ReservaCreateResponseDTO> createDisponibilidades(
            @RequestBody ReservaCreateRequestDTO dtos,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {
        return ResponseEntity.ok(gestionarReservas.create(dtos, usuarioDetails.getUsuario().getId()));
    }

}
