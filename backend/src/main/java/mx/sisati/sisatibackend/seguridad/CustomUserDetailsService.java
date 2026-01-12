package mx.sisati.sisatibackend.seguridad;

import mx.sisati.sisatibackend.usuarios.politicas.Usuario;
import mx.sisati.sisatibackend.usuarios.politicas.UsuarioRepository;
import mx.sisati.sisatibackend.usuarios.politicas.UsuarioService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public CustomUserDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException{
            return usuarioRepository.findByUsername(username)
                    .orElseThrow(() ->
                            new UsernameNotFoundException("Usuario no encontrado: " + username)
                    );
    }
}
