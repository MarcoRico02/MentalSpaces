package mx.sisati.sisatibackend.configuracionSistema;

import mx.sisati.sisatibackend.configuracionSistema.dto.ConfigCreateRequestDTO;
import mx.sisati.sisatibackend.configuracionSistema.dto.ConfigCreateResponseDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConfiguracionSistemaService {
    private final ConfiguracionSistemaRepository configuracionSistemaRepository;

    public ConfiguracionSistemaService(ConfiguracionSistemaRepository configuracionSistemaRepository) {
        this.configuracionSistemaRepository = configuracionSistemaRepository;
    }

    public List<ConfiguracionSistema> getConfiguracionPorTipo(TipoUso tipoUso){
        return configuracionSistemaRepository.findByTipoUso(tipoUso);
    }

    public ConfigCreateResponseDTO createConfig(ConfigCreateRequestDTO configCreateRequestDTO){
        ConfiguracionSistema configuracionSistema = new ConfiguracionSistema(configCreateRequestDTO.clave(), configCreateRequestDTO.valorMaximo(), configCreateRequestDTO.valorMinimo(), configCreateRequestDTO.tipoUso(), configCreateRequestDTO.descripcion());
        return new ConfigCreateResponseDTO(configuracionSistemaRepository.save(configuracionSistema));
    }
}
