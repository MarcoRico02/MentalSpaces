package mx.sisati.sisatibackend.reserva.dto;

import mx.sisati.sisatibackend.finanzas.pago.EstadoPago;
import mx.sisati.sisatibackend.finanzas.pagoReserva.PagoReserva;
import mx.sisati.sisatibackend.reserva.EstadoReserva;
import mx.sisati.sisatibackend.reserva.Reserva;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ReservaDTO(
        Long id,
        Long cubiculoId,
        String cubiculoNombre,
        Long psicologoId,
        String psicologoNombreCompleto,
        LocalDateTime inicio,
        LocalDateTime fin,
        String notas,
        EstadoReserva estadoReserva,
        LocalDateTime createdAt,
        BigDecimal precio,
        boolean pagado
) {
    public static ReservaDTO fromEntity(Reserva reserva) {
        return fromEntity(reserva, null);
    }

    public static ReservaDTO fromEntity(Reserva reserva, PagoReserva pago) {
        BigDecimal precio = (pago != null) ? pago.getMonto() : BigDecimal.ZERO;
        boolean pagado = (pago != null) && pago.getEstado() == EstadoPago.PAGADO;
        return new ReservaDTO(
                reserva.getId(),
                reserva.getCubiculo().getId(),
                reserva.getCubiculo().getNombre(),
                reserva.getPsicologo().getId(),
                reserva.getPsicologo().getUsuario().getFullName(),
                reserva.getInicio(),
                reserva.getFin(),
                reserva.getNotas(),
                reserva.getEstadoReserva(),
                reserva.getCreatedAt(),
                precio,
                pagado
        );
    }
}
