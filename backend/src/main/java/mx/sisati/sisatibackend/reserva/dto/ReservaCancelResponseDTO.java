package mx.sisati.sisatibackend.reserva.dto;

import mx.sisati.sisatibackend.finanzas.pago.dto.PagoResponse;
import mx.sisati.sisatibackend.reserva.EstadoReserva;

public record ReservaCancelResponseDTO(
        // TODO: Pudiste retornar directamente un ReservaDTO
        EstadoReserva estadoReserva,

        // TODO: PagoResponse esta bien, pero cuando lo usaste le mandaste un pago directamente xd
        PagoResponse pago,


        // TODO: Viene en pagoResponse

        String accionPago,


        // TODO: Bien innecesario

        String mensajePago
) {
}
