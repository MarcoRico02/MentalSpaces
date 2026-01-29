package mx.sisati.sisatibackend.espacios.caracteristicas;

import mx.sisati.sisatibackend.espacios.cubiculo.dto.CubiculoResponse;
import mx.sisati.sisatibackend.seguridad.UsuarioDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/caracteristicas")
public class CaracteristicaController {

    private final CaracteristicaService caracteristicaService;

    public CaracteristicaController(CaracteristicaService caracteristicaService) {
        this.caracteristicaService = caracteristicaService;
    }

    @GetMapping
    public ResponseEntity<List<Caracteristica>> findAll() {
        return ResponseEntity.ok(caracteristicaService.findAll());
    }
}
