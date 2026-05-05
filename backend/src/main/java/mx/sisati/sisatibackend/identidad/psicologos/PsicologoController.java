package mx.sisati.sisatibackend.identidad.psicologos;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.servlet.http.HttpServletRequest;
import mx.sisati.sisatibackend.archivo.ArchivoService;
import mx.sisati.sisatibackend.auth.UsuarioDetails;
import mx.sisati.sisatibackend.identidad.psicologos.aplicacion.RegistrarPsicologo;
import mx.sisati.sisatibackend.identidad.psicologos.dto.PsicologoRegisterRequestDTO;
import mx.sisati.sisatibackend.identidad.psicologos.dto.PsicologoRegisterResponseDTO;
import mx.sisati.sisatibackend.identidad.usuarios.Usuario;
import mx.sisati.sisatibackend.identidad.usuarios.dto.UsuarioRegisterDTO;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;

@RestController
@RequestMapping("/psicologos")
public class PsicologoController {

    private final RegistrarPsicologo registrarPsicologo;
    private final  PsicologoService psicologoService;
    private final ArchivoService archivoService;

    public PsicologoController(RegistrarPsicologo registrarPsicologo, PsicologoService psicologoService, ArchivoService archivoService) {
        this.registrarPsicologo = registrarPsicologo;
        this.psicologoService = psicologoService;
        this.archivoService = archivoService;
    }
    @PostMapping
    public ResponseEntity<PsicologoRegisterResponseDTO> register(
            @RequestBody PsicologoRegisterRequestDTO dtp
    ) {
        Psicologo psicologo = registrarPsicologo.execute(dtp);
        return ResponseEntity.ok(new PsicologoRegisterResponseDTO(psicologo));
    }

    @PostMapping(path = "/cedula-profesional", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> cambiarCedulaProfesional(
            @RequestParam(value = "cedula-profesional") MultipartFile cedulaProfesional,
            @AuthenticationPrincipal UsuarioDetails usuario
    ){
        Psicologo psicologo = psicologoService.getByUsuarioIdOrThrow(usuario.getUsuario().getId());
        archivoService.subirCedulaProfesional(psicologo, cedulaProfesional);
        return ResponseEntity.ok().build();
    }

    @PostMapping(path = "/identificacion", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> cambiarIdentificacion(
            @RequestParam(value = "identificacion") MultipartFile identificacion,
            @AuthenticationPrincipal UsuarioDetails usuario
    ){
        Psicologo psicologo = psicologoService.getByUsuarioIdOrThrow(usuario.getUsuario().getId());
        archivoService.subirIdentificacion(psicologo, identificacion);
        return ResponseEntity.ok().build();
    }
}