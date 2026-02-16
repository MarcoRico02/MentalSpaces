package mx.sisati.sisatibackend.reserva.dto;

import mx.sisati.sisatibackend.espacios.cubiculo.Cubiculo;
import mx.sisati.sisatibackend.espacios.cubiculo.dto.CubiculoResponse;
import mx.sisati.sisatibackend.finanzas.pago.Pago;
import mx.sisati.sisatibackend.finanzas.pago.dto.PagoResponse;
import mx.sisati.sisatibackend.reserva.EstadoReserva;
import mx.sisati.sisatibackend.reserva.Reserva;

import java.time.LocalDateTime;

public record ReservaCreateResponseDTO(
        ReservaDTO reservaDTO,
        CubiculoResponse cubiculoDTO,
        PagoResponse pagoDTO
) {
    public ReservaCreateResponseDTO(Reserva reserva, Cubiculo cubiculo, PagoResponse pago) {
        this(ReservaDTO.fromEntity(reserva), CubiculoResponse.fromEntity(cubiculo), pago);
    }
}
