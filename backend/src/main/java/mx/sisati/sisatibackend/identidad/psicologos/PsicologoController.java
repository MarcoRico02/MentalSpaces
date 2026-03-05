package mx.sisati.sisatibackend.identidad.psicologos;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.servlet.http.HttpServletRequest;
import mx.sisati.sisatibackend.identidad.psicologos.aplicacion.RegistrarPsicologo;
import mx.sisati.sisatibackend.identidad.psicologos.dto.PsicologoRegisterRequestDTO;
import mx.sisati.sisatibackend.identidad.psicologos.dto.PsicologoRegisterResponseDTO;
import mx.sisati.sisatibackend.identidad.usuarios.Usuario;
import mx.sisati.sisatibackend.identidad.usuarios.dto.UsuarioRegisterDTO;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;

@RestController
@RequestMapping("/psicologos")
public class PsicologoController {

    private final RegistrarPsicologo registrarPsicologo;

    public PsicologoController(RegistrarPsicologo registrarPsicologo) {
        this.registrarPsicologo = registrarPsicologo;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PsicologoRegisterResponseDTO> register(
            @RequestParam("username") String username,
            @RequestParam("fullName") String fullName,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("professionalType") String professionalType,
            @RequestParam(value = "fotoPerfil", required = false) MultipartFile fotoPerfil
    ) {
        PsicologoRegisterRequestDTO data = new PsicologoRegisterRequestDTO(UsuarioRegisterDTO.fromEntity(
                new Usuario(username,password,fullName,email))
                , professionalType);

        Psicologo psicologo = registrarPsicologo.execute(data, fotoPerfil);
        return ResponseEntity.ok(new PsicologoRegisterResponseDTO(psicologo));
    }
}