package mx.sisati.sisatibackend.identidad.usuarios;

import jakarta.transaction.Transactional;
import mx.sisati.sisatibackend.excepciones.ServiceException;
import mx.sisati.sisatibackend.identidad.usuarios.dto.UsuarioRegisterDTO;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Usuario saveUser(UsuarioRegisterDTO nuevoUsuario){
        if(usuarioRepository.existsByUsername(nuevoUsuario.username())) throw new ServiceException(this.getClass(), "Ya existe ese nombre de usuario");
        if(usuarioRepository.existsByEmail(nuevoUsuario.email())) throw new ServiceException(this.getClass(), "Ya existe un usuario con ese correo");
        Usuario usuario = new Usuario(nuevoUsuario.username(), passwordEncoder.encode(nuevoUsuario.password()), nuevoUsuario.fullName(), nuevoUsuario.email());
        usuarioRepository.save(usuario);
        return usuario;
    }

    @Transactional
    public Usuario findByUserName(String nombre){
        return usuarioRepository.findByUsername(nombre).orElseThrow(() -> new ServiceException(this.getClass(), "No se encontro el usuario"));
    }

    public Usuario findById(Long id){
        return usuarioRepository.findById(id).orElseThrow(() -> new ServiceException(this.getClass(), "No se encontro el usuario"));
    }

    public List<Usuario> listAll(){
        return usuarioRepository.findAll();
    }
}
