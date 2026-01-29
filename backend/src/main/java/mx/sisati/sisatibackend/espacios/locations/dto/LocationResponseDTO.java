package mx.sisati.sisatibackend.espacios.locations.dto;

public record LocationResponseDTO(
    Long id,
    String name,
    String description,
    String address,
    Double latitude,
    Double longitude,
    boolean active
) {}