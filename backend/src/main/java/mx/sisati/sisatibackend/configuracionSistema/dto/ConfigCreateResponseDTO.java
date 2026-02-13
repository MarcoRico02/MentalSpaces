package mx.sisati.sisatibackend.configuracionSistema.dto;

import mx.sisati.sisatibackend.configuracionSistema.ConfiguracionSistema;
import mx.sisati.sisatibackend.configuracionSistema.TipoUso;

public record ConfigCreateResponseDTO(
        Long id,
        String clave,
        Long valorMaximo,
        Long valorMinimo,
        TipoUso tipoUso,
        String descripcion
) {
    public ConfigCreateResponseDTO(ConfiguracionSistema configuracionSistema) {
        this(configuracionSistema.getId(), configuracionSistema.getClave(), configuracionSistema.getValorMaximo(), configuracionSistema.getValorMinimo(), configuracionSistema.getTipoUso(), configuracionSistema.getDescripcion());
    }
}
