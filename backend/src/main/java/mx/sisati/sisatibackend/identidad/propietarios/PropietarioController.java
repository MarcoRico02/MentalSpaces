package mx.sisati.sisatibackend.identidad.propietarios;

import mx.sisati.sisatibackend.identidad.propietarios.aplicacion.RegistrarPropietario;
import mx.sisati.sisatibackend.identidad.propietarios.dto.PropietarioRegisterRequestDTO;
import mx.sisati.sisatibackend.identidad.propietarios.dto.PropietarioRegisterResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@RequestMapping("/propietarios")
public class PropietarioController {

    private final RegistrarPropietario registrarPropietario;

    public PropietarioController(RegistrarPropietario registrarPropietario) {
        this.registrarPropietario = registrarPropietario;
    }

    @PostMapping()
    public ResponseEntity<PropietarioRegisterResponseDTO> saveOwner(@RequestBody PropietarioRegisterRequestDTO propietarioRegisterRequestDTO){
        Propietario propietario = registrarPropietario.execute(propietarioRegisterRequestDTO);
        PropietarioRegisterResponseDTO respuesta = new PropietarioRegisterResponseDTO(propietario);
        return ResponseEntity.created(URI.create("/propietarios/" + respuesta.usuarioRegisterResponseDTO().id())).body(respuesta);
    }
}
