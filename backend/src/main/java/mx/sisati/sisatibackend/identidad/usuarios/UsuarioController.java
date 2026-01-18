package mx.sisati.sisatibackend.identidad.usuarios;

import mx.sisati.sisatibackend.seguridad.UsuarioDetails;
import mx.sisati.sisatibackend.identidad.usuarios.dto.UsuarioMeResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }


    @GetMapping("/me")
    public ResponseEntity<UsuarioMeResponseDTO> me(@AuthenticationPrincipal UsuarioDetails usuario){
        return ResponseEntity.ok(new UsuarioMeResponseDTO(usuario.getUsuario()));
    }
}
