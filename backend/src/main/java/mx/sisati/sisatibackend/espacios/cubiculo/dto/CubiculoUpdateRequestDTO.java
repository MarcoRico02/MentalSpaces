package mx.sisati.sisatibackend.espacios.cubiculo.dto;

import java.math.BigDecimal;
import java.util.Set;

public record CubiculoUpdateRequestDTO(
        String nombre,
        String descripcion,
        BigDecimal precio,
        String imageUrl,
        Set<Long> caracteristicasIds
) {}