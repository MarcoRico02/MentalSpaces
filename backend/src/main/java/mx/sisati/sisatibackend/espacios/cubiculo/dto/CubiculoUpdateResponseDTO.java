package mx.sisati.sisatibackend.espacios.cubiculo.dto;

import mx.sisati.sisatibackend.espacios.cubiculo.Cubiculo;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public record CubiculoUpdateResponseDTO(
        Long id,
        String nombre,
        String descripcion,
        BigDecimal precio,
        String imageUrl,
        List<CaracteristicaDTO> caracteristicas,
        boolean active
) {
    public CubiculoUpdateResponseDTO(Cubiculo cubiculo) {
        this(
                cubiculo.getId(),
                cubiculo.getNombre(),
                cubiculo.getDescripcion(),
                cubiculo.getPrecio(),
                cubiculo.getImageUrl(),
                cubiculo.getCaracteristicas().stream()
                        .map(caracteristica -> new CaracteristicaDTO(caracteristica.getId(), caracteristica.getNombre()))
                        .collect(Collectors.toList()),
                cubiculo.isActive()
        );
    }
}