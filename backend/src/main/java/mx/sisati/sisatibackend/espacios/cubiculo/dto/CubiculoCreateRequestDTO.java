package mx.sisati.sisatibackend.espacios.cubiculo.dto;

import mx.sisati.sisatibackend.espacios.disponibilidad.dto.DisponibilidadCreateRequestDTO;

import java.util.List;
import java.util.Set;

public record CubiculoCreateRequestDTO(
        Long locationId,
        String nombre,
        String descripcion,
        Double precio,
        String imageUrl,
        Set<Long> caracteristicasIds,
        List<DisponibilidadCreateRequestDTO> disponibilidadCreateRequestDTO
) {}