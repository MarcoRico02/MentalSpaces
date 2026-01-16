package mx.sisati.sisatibackend.psicologos;

import mx.sisati.sisatibackend.psicologos.aplicacion.RegistrarPsicologo;
import mx.sisati.sisatibackend.psicologos.dto.PsicologoRegisterRequestDTO;
import mx.sisati.sisatibackend.psicologos.dto.PsicologoRegisterResponseDTO;
import mx.sisati.sisatibackend.seguridad.UsuarioDetails;
import mx.sisati.sisatibackend.usuarios.politicas.Usuario;
import mx.sisati.sisatibackend.usuarios.politicas.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/psicologos")
public class PsicologoController {

    private final PsicologoService psicologoService;
    private final RegistrarPsicologo registrarPsicologo;

    public PsicologoController(PsicologoService psicologoService, RegistrarPsicologo registrarPsicologo) {
        this.psicologoService = psicologoService;
        this.registrarPsicologo = registrarPsicologo;
    }

    @PostMapping()
    public ResponseEntity<PsicologoRegisterResponseDTO> savePsychologist(@RequestBody PsicologoRegisterRequestDTO psicologoRegisterRequestDTO){
        Psicologo psicologo = registrarPsicologo.execute(psicologoRegisterRequestDTO);
        PsicologoRegisterResponseDTO respuesta = new PsicologoRegisterResponseDTO(psicologo);
        return ResponseEntity.created(URI.create("/psicologos/" + respuesta.usuarioRegisterResponseDTO().id())).body(respuesta);
    }
}