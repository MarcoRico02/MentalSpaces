package mx.sisati.sisatibackend.finanzas.pago;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import mx.sisati.sisatibackend.finanzas.pago.dto.ActualizarEstadoPagoRequest;
import mx.sisati.sisatibackend.finanzas.pago.dto.CrearPagoRequest;
import mx.sisati.sisatibackend.finanzas.pago.dto.PagoResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/pagos")
@Tag(name = "Pagos", description = "API para gestión de pagos")
public class PagoController {

    private final PagoService pagoService;

    public PagoController(PagoService pagoService) {
        this.pagoService = pagoService;
    }

    @PostMapping
    @Operation(summary = "Crear un nuevo pago")
    public ResponseEntity<PagoResponse> crearPago(
            @Valid @RequestBody CrearPagoRequest request
    ) {
        PagoResponse pago = pagoService.crearPago(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(pago);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un pago por ID")

    public ResponseEntity<PagoResponse> obtenerPago(
            @Parameter(description = "ID del pago") @PathVariable UUID id
    ) {
        PagoResponse pago = pagoService.obtenerPorId(id);
        return ResponseEntity.ok(pago);
    }

    @GetMapping
    @Operation(summary = "Listar todos los pagos")
    public ResponseEntity<List<PagoResponse>> listarPagos(
            @Parameter(description = "Filtrar por estado del pago")
            @RequestParam(required = false) EstadoPago estado
    ) {
        List<PagoResponse> pagos = estado != null
                ? pagoService.listarPorEstado(estado)
                : pagoService.listarTodos();
        return ResponseEntity.ok(pagos);
    }

    @PatchMapping("/{id}/estado")
    @Operation(summary = "Actualizar el estado de un pago")
    public ResponseEntity<PagoResponse> actualizarEstado(
            @Parameter(description = "ID del pago") @PathVariable UUID id,
            @Valid @RequestBody ActualizarEstadoPagoRequest request
    ) {
        PagoResponse pago = pagoService.actualizarEstado(id, request);
        return ResponseEntity.ok(pago);
    }

    @PostMapping("/{id}/confirmar")
    @Operation(summary = "Confirmar un pago como pagado")
    public ResponseEntity<Void> confirmarPago(
            @Parameter(description = "ID del pago") @PathVariable UUID id,
            @Parameter(description = "ID del PaymentIntent de Stripe")
            @RequestParam String stripePaymentIntentId
    ) {
        pagoService.confirmarPago(id, stripePaymentIntentId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/cancelar")
    @Operation(summary = "Cancelar un pago")
    public ResponseEntity<Void> cancelarPago(
            @Parameter(description = "ID del pago") @PathVariable UUID id,
            @Parameter(description = "Motivo de la cancelación")
            @RequestParam(required = false) String motivo
    ) {
        pagoService.cancelarPago(id, motivo);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/expirar-pendientes")
    @Operation(summary = "Expirar pagos pendientes que han pasado su fecha de expiración")
    public ResponseEntity<Map<String, Object>> expirarPagosPendientes() {
        int cantidad = pagoService.expirarPagosPendientes();
        return ResponseEntity.ok(Map.of(
                "mensaje", "Pagos expirados exitosamente",
                "cantidadExpirada", cantidad
        ));
    }
}