package mx.sisati.sisatibackend.espacios.cubiculo.dto;

import java.util.Set;

public record CubiculoCreateRequestDTO(
        Long locationId,
        String nombre,
        String descripcion,
        Double precio,
        String imageUrl,
        Set<Long> caracteristicasIds
) {}