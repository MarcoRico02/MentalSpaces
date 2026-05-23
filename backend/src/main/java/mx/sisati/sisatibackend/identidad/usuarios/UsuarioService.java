package mx.sisati.sisatibackend.identidad.usuarios;

import jakarta.transaction.Transactional;
import mx.sisati.sisatibackend.excepciones.ServiceException;
import mx.sisati.sisatibackend.identidad.usuarios.dto.UsuarioInfoDTO;
import mx.sisati.sisatibackend.identidad.usuarios.dto.UsuarioRegisterDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

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

    public Page<Usuario> listAll(int page, int size){
        size = Math.max(5, Math.min(20, size));
        Pageable pageable = PageRequest.of(page, size);
        return usuarioRepository.findAllWithRoles(pageable);
    }

    @Transactional
    public void asignarFotoPerfil(Long usuarioId, UUID archivoId){
        usuarioRepository.updateFotoPerfil(usuarioId, archivoId);
    }

    public List<UsuarioInfoDTO> listPsicologos() {
        return usuarioRepository.findPsicologos().stream()
                .map(UsuarioInfoDTO::new)
                .toList();
    }
}
