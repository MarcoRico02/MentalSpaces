package mx.sisati.sisatibackend.configuracionSistema.dto;

import mx.sisati.sisatibackend.configuracionSistema.TipoUso;

public record ConfigCreateRequestDTO(
        String clave,
        Long valorMaximo,
        Long valorMinimo,
        TipoUso tipoUso,
        String descripcion) {
}
