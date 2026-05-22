package mx.sisati.sisatibackend.reserva;

import mx.sisati.sisatibackend.reserva.aplicacion.GestionarReservas;
import mx.sisati.sisatibackend.reserva.dto.ReservaCreateRequestDTO;
import mx.sisati.sisatibackend.reserva.dto.ReservaCreateResponseDTO;
import mx.sisati.sisatibackend.reserva.dto.ReservaFilterRequestDTO;
import mx.sisati.sisatibackend.auth.UsuarioDetails;
import mx.sisati.sisatibackend.reserva.dto.ReservaDTO;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

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

    @GetMapping
    public ResponseEntity<List<ReservaDTO>> getReservas(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin,
            @RequestParam(required = false) List<Long> cubiculoIds,
            @RequestParam(required = false) List<Long> locationIds,
            @RequestParam(required = false) List<Long> usuarioIds,
            @RequestParam(required = false) String filtroTemporal
    ) {
        ReservaFilterRequestDTO filtro = new ReservaFilterRequestDTO(
                fechaInicio, fechaFin, cubiculoIds, locationIds, usuarioIds, filtroTemporal
        );
        return ResponseEntity.ok(gestionarReservas.getReservas(filtro));
    }
}
