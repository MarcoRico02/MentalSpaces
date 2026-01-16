package mx.sisati.sisatibackend.auth;

import mx.sisati.sisatibackend.seguridad.JwtService;
import mx.sisati.sisatibackend.seguridad.UsuarioDetails;
import mx.sisati.sisatibackend.usuarios.politicas.dto.UsuarioLoginDTO;
import mx.sisati.sisatibackend.usuarios.politicas.dto.UsuarioLoginResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(AuthenticationManager authenticationManager, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/logout")
    public ResponseEntity<Object> logout(@RequestBody boolean bool){
        return ResponseEntity.ok().build();
    }
    @PostMapping("/login")
    public ResponseEntity<UsuarioLoginResponseDTO> login(@RequestBody UsuarioLoginDTO login){
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        login.username(),
                        login.password()
                )
        );

        UsuarioDetails usuarioDetails = (UsuarioDetails) authentication.getPrincipal();

        String token = jwtService.generateToken(usuarioDetails);

        return ResponseEntity.ok(new UsuarioLoginResponseDTO(token));
    }
}
