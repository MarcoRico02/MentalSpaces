package mx.sisati.sisatibackend.espacios.cubiculo.dto;

import mx.sisati.sisatibackend.espacios.cubiculo.Cubiculo;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

public record CubiculoResponse(
        Long id,
        Long locationId,
        String nombre,
        String descripcion,
        BigDecimal precio,
        String imageUrl,
        List<CaracteristicaDTO> caracteristicas,
        boolean isActive
) {
    public static CubiculoResponse fromEntity(Cubiculo cubiculo) {
        return new CubiculoResponse(
                cubiculo.getId(),
                cubiculo.getLocation().getId(),
                cubiculo.getNombre(),
                cubiculo.getDescripcion(),
                cubiculo.getPrecio(),
                cubiculo.getImageUrl(),
                cubiculo.getCaracteristicas().stream()
                        .map(CaracteristicaDTO::new)
                        .collect(Collectors.toList()),
                cubiculo.isActive()
        );
    }
}
