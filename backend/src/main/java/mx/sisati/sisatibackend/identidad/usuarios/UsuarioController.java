package mx.sisati.sisatibackend.identidad.usuarios;

import mx.sisati.sisatibackend.identidad.usuarios.aplicacion.ConsultarMiPerfil;
import mx.sisati.sisatibackend.seguridad.UsuarioDetails;
import mx.sisati.sisatibackend.identidad.usuarios.dto.UsuarioMeResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "http://127.0.0.1:5173")
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


    //ESTO TIENE UN SERIO PROBLEMA, DEBE DE PONER RETORNAR EL ROL JUNTO AL USUARIO EN UNA SOLA QUERY, POR QUE
    //SI NO SE LA PASA HACIENDO QUERYS PARA CONSEGUIR LOS ROLES DE UNO POR UNO
    @GetMapping("/all")
    public ResponseEntity<List<Usuario>> all(){
        return ResponseEntity.ok(usuarioService.listAll());
    }
}
