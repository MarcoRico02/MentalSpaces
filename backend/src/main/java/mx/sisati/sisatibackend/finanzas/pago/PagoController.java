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
}