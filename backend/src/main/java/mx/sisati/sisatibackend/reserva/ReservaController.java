package mx.sisati.sisatibackend.reserva;

import mx.sisati.sisatibackend.auth.UsuarioDetails;
import mx.sisati.sisatibackend.identidad.usuarios.Usuario;
import mx.sisati.sisatibackend.reserva.aplicacion.GestionarReservas;
import mx.sisati.sisatibackend.reserva.dto.FiltroTemporal;
import mx.sisati.sisatibackend.reserva.dto.ReservaCreateRequestDTO;
import mx.sisati.sisatibackend.reserva.dto.ReservaCreateResponseDTO;
import mx.sisati.sisatibackend.reserva.dto.ReservaConsultaResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reservas")
public class ReservaController {

    private final GestionarReservas gestionarReservas;
    private final ReservaService reservaService;

    public ReservaController(GestionarReservas gestionarReservas, ReservaService reservaService) {
        this.gestionarReservas = gestionarReservas;
        this.reservaService = reservaService;
    }

    @GetMapping
    public ResponseEntity<ReservaConsultaResponseDTO> getReservas(
            @AuthenticationPrincipal UsuarioDetails usuarioDetails,
            @RequestParam(required = false) FiltroTemporal filtro) {
        Usuario usuario = usuarioDetails.getUsuario();
        if (filtro == null)
            return ResponseEntity.ok(reservaService.getReservas(usuario));
        return ResponseEntity.ok(reservaService.getReservas(usuario, filtro));
    }

    @PostMapping
    public ResponseEntity<ReservaCreateResponseDTO> createReserva(
            @RequestBody ReservaCreateRequestDTO dtos,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {
        return ResponseEntity.ok(gestionarReservas.create(dtos, usuarioDetails.getUsuario().getId()));
    }
}
