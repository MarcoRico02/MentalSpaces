package mx.sisati.sisatibackend.reserva.dto;

import mx.sisati.sisatibackend.finanzas.pago.dto.PagoResponse;
import mx.sisati.sisatibackend.reserva.EstadoReserva;

public record ReservaCancelResponseDTO(
        EstadoReserva estadoReserva,
        PagoResponse pago,
        String accionPago,
        String mensajePago
) {
}
