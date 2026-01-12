package mx.sisati.sisatibackend.usuarios.politicas;

import mx.sisati.sisatibackend.seguridad.UsuarioDetails;
import mx.sisati.sisatibackend.usuarios.politicas.dto.UsuarioLoginResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }


    @GetMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Usuario> listarUsuarios(@AuthenticationPrincipal UsuarioDetails usuario){
        System.out.println("Roles en SecurityContext: " + usuario.getAuthorities());
        return ResponseEntity.ok(usuarioService.findByUserName(usuario.getUsername()));
    }
}
