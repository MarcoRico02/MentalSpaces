package mx.sisati.sisatibackend.reserva.dto;

import mx.sisati.sisatibackend.reserva.Reserva;

import java.util.List;

public record ReservaConsultaResponseDTO(
        List<ReservaDTO> reservasPropias,
        List<ReservaDTO> reservasEnMisCubiculos
) {
    public static ReservaConsultaResponseDTO fromEntity(List<Reserva> reservasPropias, List<Reserva> reservasEnMisCubiculos){
        return new ReservaConsultaResponseDTO(
                reservasPropias.stream()
                        .map(ReservaDTO::fromEntity)
                        .toList(),

                reservasEnMisCubiculos.stream()
                        .map(ReservaDTO::fromEntity)
                        .toList());
    }
}