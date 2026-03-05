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

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PropietarioRegisterResponseDTO> saveOwner(
            @RequestParam("username") String username,
            @RequestParam("fullName") String fullName,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam(value = "fotoPerfil", required = false) MultipartFile fotoPerfil
    ){
        Propietario propietario = registrarPropietario.execute(new PropietarioRegisterRequestDTO(new UsuarioRegisterDTO(username, password, fullName, email)), fotoPerfil);
        PropietarioRegisterResponseDTO respuesta = new PropietarioRegisterResponseDTO(propietario);
        return ResponseEntity.created(URI.create("/propietarios/" + respuesta.usuarioRegisterResponseDTO().id())).body(respuesta);
    }
}
