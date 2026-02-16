package mx.sisati.sisatibackend.configuracionSistema;

import mx.sisati.sisatibackend.auth.UsuarioDetails;
import mx.sisati.sisatibackend.configuracionSistema.dto.ConfigCreateRequestDTO;
import mx.sisati.sisatibackend.configuracionSistema.dto.ConfigCreateResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/configuracionSistema")
public class ConfiguracoinSistemaController {

    private final ConfiguracionSistemaService configuracionSistemaService;

    public ConfiguracoinSistemaController(ConfiguracionSistemaService configuracionSistemaService) {
        this.configuracionSistemaService = configuracionSistemaService;
    }

    @PostMapping
    public ResponseEntity<ConfigCreateResponseDTO> createConfig(
            @RequestBody ConfigCreateRequestDTO dto,
            @AuthenticationPrincipal UsuarioDetails usuarioDetails) {
        return ResponseEntity.ok(configuracionSistemaService.createConfig(dto));
    }
}
