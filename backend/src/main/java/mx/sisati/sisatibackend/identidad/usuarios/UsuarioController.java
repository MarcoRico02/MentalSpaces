package mx.sisati.sisatibackend.identidad.usuarios;

import lombok.extern.slf4j.Slf4j;
import mx.sisati.sisatibackend.archivo.ArchivoService;
import mx.sisati.sisatibackend.identidad.usuarios.aplicacion.GestionarUsuarios;
import mx.sisati.sisatibackend.auth.UsuarioDetails;
import mx.sisati.sisatibackend.identidad.usuarios.dto.UsuarioMeResponseDTO;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/usuarios")
@Slf4j
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final GestionarUsuarios gestionarUsuarios;
    private final ArchivoService archivoService;

    public UsuarioController(UsuarioService usuarioService, GestionarUsuarios gestionarUsuarios, ArchivoService archivoService) {
        this.usuarioService = usuarioService;
        this.gestionarUsuarios = gestionarUsuarios;
        this.archivoService = archivoService;
    }


    @GetMapping("/me")
    public ResponseEntity<UsuarioMeResponseDTO> me(@AuthenticationPrincipal UsuarioDetails usuario){
        UsuarioMeResponseDTO usuarioMeResponseDTO = gestionarUsuarios.execute(usuario.getUsuario());
        return ResponseEntity.ok(usuarioMeResponseDTO);
    }

    @PostMapping(path = "/foto-perfil", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> cambiarFotoPerfil(
            @RequestParam(value = "fotoPerfil") MultipartFile fotoPerfil,
            @AuthenticationPrincipal UsuarioDetails usuario
    ){
        archivoService.subirFotoPerfil(usuario.getUsuario(), fotoPerfil);
        return ResponseEntity.ok().build();
    }
}
