package mx.sisati.sisatibackend.identidad.propietarios;

import mx.sisati.sisatibackend.identidad.propietarios.aplicacion.RegistrarPropietario;
import mx.sisati.sisatibackend.identidad.propietarios.dto.PropietarioRegisterRequestDTO;
import mx.sisati.sisatibackend.identidad.propietarios.dto.PropietarioRegisterResponseDTO;
import mx.sisati.sisatibackend.identidad.usuarios.dto.UsuarioRegisterDTO;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;

@RestController
@RequestMapping("/propietarios")
public class PropietarioController {

    private final RegistrarPropietario registrarPropietario;

    public PropietarioController(RegistrarPropietario registrarPropietario) {
        this.registrarPropietario = registrarPropietario;
    }

    @PostMapping
    public ResponseEntity<PropietarioRegisterResponseDTO> saveOwner(
            @RequestBody PropietarioRegisterRequestDTO dto
    ){
        Propietario propietario = registrarPropietario.execute(dto);
        PropietarioRegisterResponseDTO respuesta = new PropietarioRegisterResponseDTO(propietario);
        return ResponseEntity.created(URI.create("/propietarios/" + respuesta.usuarioRegisterResponseDTO().id())).body(respuesta);
    }
}
