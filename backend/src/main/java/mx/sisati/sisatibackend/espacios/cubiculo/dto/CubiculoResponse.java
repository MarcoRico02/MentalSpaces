package mx.sisati.sisatibackend.espacios.cubiculo.dto;

import java.util.List;

public record CubiculoResponse(
        Long id,
        Long locationId,
        String nombre,
        String descripcion,
        Double precio,
        String imagenUrl,
        List<CaracteristicaDTO> caracteristicas,
        boolean isActive
) {}
