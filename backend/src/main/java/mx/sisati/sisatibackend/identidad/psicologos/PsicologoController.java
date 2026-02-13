package mx.sisati.sisatibackend.identidad.psicologos;

import mx.sisati.sisatibackend.identidad.psicologos.aplicacion.RegistrarPsicologo;
import mx.sisati.sisatibackend.identidad.psicologos.dto.PsicologoRegisterRequestDTO;
import mx.sisati.sisatibackend.identidad.psicologos.dto.PsicologoRegisterResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/psicologos")
public class PsicologoController {

    private final RegistrarPsicologo registrarPsicologo;

    public PsicologoController(RegistrarPsicologo registrarPsicologo) {
        this.registrarPsicologo = registrarPsicologo;
    }

    @PostMapping()
    public ResponseEntity<PsicologoRegisterResponseDTO> savePsychologist(@RequestBody PsicologoRegisterRequestDTO psicologoRegisterRequestDTO){
        Psicologo psicologo = registrarPsicologo.execute(psicologoRegisterRequestDTO);
        PsicologoRegisterResponseDTO respuesta = new PsicologoRegisterResponseDTO(psicologo);
        return ResponseEntity.created(URI.create("/psicologos/" + respuesta.usuarioRegisterResponseDTO().id())).body(respuesta);
    }
}