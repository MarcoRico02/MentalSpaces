package mx.sisati.sisatibackend.identidad.usuarios.aplicacion;

import mx.sisati.sisatibackend.archivo.ArchivoService;
import mx.sisati.sisatibackend.identidad.propietarios.PropietarioService;
import mx.sisati.sisatibackend.identidad.propietarios.dto.PropietarioInfoDTO;
import mx.sisati.sisatibackend.identidad.psicologos.PsicologoService;
import mx.sisati.sisatibackend.identidad.psicologos.dto.PsicologoInfoDTO;
import mx.sisati.sisatibackend.identidad.usuarios.Usuario;
import mx.sisati.sisatibackend.identidad.usuarios.UsuarioService;
import mx.sisati.sisatibackend.identidad.usuarios.dto.UsuarioInfoDTO;
import mx.sisati.sisatibackend.identidad.usuarios.dto.UsuarioMeResponseDTO;
import mx.sisati.sisatibackend.identidad.usuarios.dto.UsuarioRegisterDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
public class GestionarUsuarios {

    private final UsuarioService usuarioService;
    private final PsicologoService psicologoService;
    private final PropietarioService propietarioService;
    private final ArchivoService archivoService;
    public GestionarUsuarios(UsuarioService usuarioService, PsicologoService psicologoService, PropietarioService propietarioService, ArchivoService archivoService) {
        this.usuarioService = usuarioService;
        this.psicologoService = psicologoService;
        this.propietarioService = propietarioService;
        this.archivoService = archivoService;
    }

    public UsuarioMeResponseDTO execute(Usuario usuario){
        Long id = usuario.getId();

        PsicologoInfoDTO psicologoInfoDTO = psicologoService.getByUsuarioId(id).map(PsicologoInfoDTO::new)
                .orElse(null);
        PropietarioInfoDTO propietarioInfoDTO = propietarioService.getByUsuarioId(id).map(PropietarioInfoDTO::new)
                .orElse(null);

        UsuarioInfoDTO usuarioInfoDTO = new UsuarioInfoDTO(usuario);
        return new UsuarioMeResponseDTO(usuarioInfoDTO, psicologoInfoDTO, propietarioInfoDTO);
    }

    @Transactional
    public Usuario save(UsuarioRegisterDTO nuevoUsuario, MultipartFile fotoDePerfil){
        Usuario usuario = usuarioService.saveUser(nuevoUsuario);
        UUID archivoId = archivoService.subirFotoPerfil(usuario, fotoDePerfil);
        usuarioService.asignarFotoPerfil(usuario.getId(),archivoId);
        return usuario;
    }
}
