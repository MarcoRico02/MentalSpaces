package mx.sisati.sisatibackend.espacios.cubiculo.dto;

import mx.sisati.sisatibackend.espacios.caracteristicas.Caracteristica;
import mx.sisati.sisatibackend.espacios.caracteristicas.CaracteristicaNombre;

public record CaracteristicaDTO(
        Long id,
        CaracteristicaNombre nombre
) {
    public CaracteristicaDTO(Caracteristica caracteristica) {
        this(caracteristica.getId(), caracteristica.getNombre());
    }
}