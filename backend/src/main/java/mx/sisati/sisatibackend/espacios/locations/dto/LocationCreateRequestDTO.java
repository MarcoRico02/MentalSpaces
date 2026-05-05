package mx.sisati.sisatibackend.espacios.locations.dto;

public record LocationCreateRequestDTO(
    String name,
    String description,
    String address,
    Double latitude,
    Double longitude,
    String imageUrl
) {}