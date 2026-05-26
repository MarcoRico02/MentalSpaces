package mx.sisati.sisatibackend.reserva.dto;

import mx.sisati.sisatibackend.finanzas.pagoReserva.PagoReserva;
import mx.sisati.sisatibackend.reserva.Reserva;

import java.util.List;
import java.util.Map;

public record ReservaConsultaResponseDTO(
        List<ReservaDTO> reservasPropias,
        List<ReservaDTO> reservasEnMisCubiculos
) {
    public static ReservaConsultaResponseDTO fromEntity(List<Reserva> reservasPropias, List<Reserva> reservasEnMisCubiculos) {
        return fromEntity(reservasPropias, reservasEnMisCubiculos, Map.of());
    }

    public static ReservaConsultaResponseDTO fromEntity(List<Reserva> reservasPropias, List<Reserva> reservasEnMisCubiculos, Map<Long, PagoReserva> pagoMap) {
        return new ReservaConsultaResponseDTO(
                reservasPropias.stream()
                        .map(r -> ReservaDTO.fromEntity(r, pagoMap.get(r.getId())))
                        .toList(),
                reservasEnMisCubiculos.stream()
                        .map(r -> ReservaDTO.fromEntity(r, pagoMap.get(r.getId())))
                        .toList());
    }
}
