package mx.sisati.sisatibackend.identidad.usuarios;

import mx.sisati.sisatibackend.identidad.usuarios.aplicacion.ConsultarMiPerfil;
import mx.sisati.sisatibackend.auth.UsuarioDetails;
import mx.sisati.sisatibackend.identidad.usuarios.dto.UsuarioMeResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final ConsultarMiPerfil consultarMiPerfil;

    public UsuarioController(UsuarioService usuarioService, ConsultarMiPerfil consultarMiPerfil) {
        this.usuarioService = usuarioService;
        this.consultarMiPerfil = consultarMiPerfil;
    }


    @GetMapping("/me")
    public ResponseEntity<UsuarioMeResponseDTO> me(@AuthenticationPrincipal UsuarioDetails usuario){
        UsuarioMeResponseDTO usuarioMeResponseDTO = consultarMiPerfil.execute(usuario.getUsuario());
        return ResponseEntity.ok(usuarioMeResponseDTO);
    }



    @GetMapping
    public ResponseEntity<Page<Usuario>> all(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ){
        return ResponseEntity.ok(usuarioService.listAll(page, size));
    }
}
