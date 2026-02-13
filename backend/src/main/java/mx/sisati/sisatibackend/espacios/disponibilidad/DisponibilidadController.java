package mx.sisati.sisatibackend.espacios.disponibilidad;

import mx.sisati.sisatibackend.auth.UsuarioDetails;
import mx.sisati.sisatibackend.espacios.disponibilidad.aplicacion.GestionarDisponibilidades;
import mx.sisati.sisatibackend.espacios.disponibilidad.dto.DisponibilidadCreateRequestDTO;
import mx.sisati.sisatibackend.espacios.disponibilidad.dto.DisponibilidadResponseDTO;
import mx.sisati.sisatibackend.espacios.disponibilidad.dto.DisponibilidadUpdateRequestDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.util.List;

@RestController
@RequestMapping("/cubiculos/{cubiculoId}/disponibilidades")
public class DisponibilidadController {

    private final GestionarDisponibilidades gestionarDisponibilidades;

    public DisponibilidadController(GestionarDisponibilidades gestionarDisponibilidades) {
        this.gestionarDisponibilidades = gestionarDisponibilidades;
    }

    // GET /cubiculos/{cubiculoId}/disponibilidades
    @GetMapping
    public ResponseEntity<List<DisponibilidadResponseDTO>> getDisponibilidades(
            @PathVariable Long cubiculoId,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {

        List<Disponibilidad> disponibilidades = gestionarDisponibilidades
                .getDisponibilidadesByCubiculo(cubiculoId, usuarioDetails.getUsuario().getId());

        return ResponseEntity.ok(disponibilidades.stream()
                .map(DisponibilidadResponseDTO::new)
                .toList());
    }

    // GET /cubiculos/{cubiculoId}/disponibilidades?dia=MONDAY
    @GetMapping(params = "dia")
    public ResponseEntity<List<DisponibilidadResponseDTO>> getDisponibilidadesByDia(
            @PathVariable Long cubiculoId,
            @RequestParam DayOfWeek dia,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {

        List<Disponibilidad> disponibilidades = gestionarDisponibilidades
                .getDisponibilidadesByCubiculoAndDia(cubiculoId, usuarioDetails.getUsuario().getId(), dia);

        return ResponseEntity.ok(disponibilidades.stream()
                .map(DisponibilidadResponseDTO::new)
                .toList());
    }

    // POST /cubiculos/{cubiculoId}/disponibilidades
    @PostMapping
    public ResponseEntity<Void> createDisponibilidades(
            @PathVariable Long cubiculoId,
            @RequestBody List<DisponibilidadCreateRequestDTO> dtos,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {

        gestionarDisponibilidades.createDisponibilidades(
                cubiculoId,
                dtos,
                usuarioDetails.getUsuario().getId()
        );

        return ResponseEntity.status(201).build();
    }

    // PUT /cubiculos/{cubiculoId}/disponibilidades/{disponibilidadId}
    @PutMapping("/{disponibilidadId}")
    public ResponseEntity<Void> updateDisponibilidad(
            @PathVariable Long cubiculoId,
            @PathVariable Long disponibilidadId,
            @RequestBody DisponibilidadUpdateRequestDTO dto,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {

        gestionarDisponibilidades.updateDisponibilidad(
                disponibilidadId,
                usuarioDetails.getUsuario().getId(),
                dto.diaSemana(),
                dto.horaInicio(),
                dto.horaFin()
        );

        return ResponseEntity.noContent().build();
    }

    // DELETE /cubiculos/{cubiculoId}/disponibilidades/{disponibilidadId}
    @DeleteMapping("/{disponibilidadId}")
    public ResponseEntity<Void> deleteDisponibilidad(
            @PathVariable Long cubiculoId,
            @PathVariable Long disponibilidadId,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {

        gestionarDisponibilidades.deleteDisponibilidad(
                disponibilidadId,
                usuarioDetails.getUsuario().getId()
        );

        return ResponseEntity.noContent().build();
    }

    // DELETE /cubiculos/{cubiculoId}/disponibilidades
    @DeleteMapping
    public ResponseEntity<Void> deleteAllDisponibilidades(
            @PathVariable Long cubiculoId,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {

        gestionarDisponibilidades.deleteAllDisponibilidadesByCubiculo(
                cubiculoId,
                usuarioDetails.getUsuario().getId()
        );

        return ResponseEntity.noContent().build();
    }

    // GET /cubiculos/{cubiculoId}/disponibilidades/exists
    @GetMapping("/exists")
    public ResponseEntity<Boolean> tieneDisponibilidades(
            @PathVariable Long cubiculoId,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {

        boolean tiene = gestionarDisponibilidades.tieneDisponibilidades(
                cubiculoId,
                usuarioDetails.getUsuario().getId()
        );

        return ResponseEntity.ok(tiene);
    }
}
