package mx.sisati.sisatibackend.auth;

import mx.sisati.sisatibackend.seguridad.CustomUserDetailsService;
import mx.sisati.sisatibackend.seguridad.JwtService;
import mx.sisati.sisatibackend.seguridad.UsuarioDetails;
import mx.sisati.sisatibackend.usuarios.politicas.Usuario;
import mx.sisati.sisatibackend.usuarios.politicas.dto.UsuarioLoginDTO;
import mx.sisati.sisatibackend.usuarios.politicas.dto.UsuarioLoginResponseDTO;
import mx.sisati.sisatibackend.usuarios.politicas.dto.UsuarioRegisterDTO;
import mx.sisati.sisatibackend.usuarios.politicas.dto.UsuarioRegisterResponseDTO;
import mx.sisati.sisatibackend.usuarios.politicas.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final UsuarioService usuarioService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(UsuarioService usuarioService, AuthenticationManager authenticationManager, JwtService jwtService) {
        this.usuarioService = usuarioService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<UsuarioRegisterResponseDTO> saveUser(@RequestBody UsuarioRegisterDTO usuarioRegisterDTO){
        Usuario usuario = usuarioService.saveUser(usuarioRegisterDTO);
        UsuarioRegisterResponseDTO respuesta = new UsuarioRegisterResponseDTO(usuario);
        return ResponseEntity.created(URI.create("/usuarios/" + respuesta.id())).body(respuesta);
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
