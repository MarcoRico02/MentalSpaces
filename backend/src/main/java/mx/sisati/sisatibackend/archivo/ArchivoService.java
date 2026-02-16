package mx.sisati.sisatibackend.archivo;

import mx.sisati.sisatibackend.cloudflare.AlmacenamientoService;
import mx.sisati.sisatibackend.excepciones.ServiceException;
import mx.sisati.sisatibackend.identidad.usuarios.Usuario;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.UUID;

@Service
public class ArchivoService {

    private final ArchivoRepository archivoRepository;
    private final AlmacenamientoService almacenamientoService;

    public ArchivoService(ArchivoRepository archivoRepository, AlmacenamientoService almacenamientoService) {
        this.archivoRepository = archivoRepository;
        this.almacenamientoService = almacenamientoService;
    }

    @Transactional
    public Archivo subir(
            TipoEntidad tipoEntidad,
            Long entidadId,
            TipoArchivo tipoArchivo,
            String nombreOriginal,
            InputStream inputStream,
            long size,
            String contentType
    ) {

        String key = generarKey(tipoEntidad, entidadId, tipoArchivo, nombreOriginal);

        almacenamientoService.upload(key, inputStream, size, contentType);

        Archivo archivo = new Archivo(
                tipoEntidad,
                entidadId,
                tipoArchivo,
                nombreOriginal,
                key
        );

        return archivoRepository.save(archivo);
    }

    /**
     * Obtiene archivos asociados a una entidad.
     */
    @Transactional(readOnly = true)
    public List<Archivo> obtenerPorEntidad(TipoEntidad tipoEntidad, Long entidadId) {
        return archivoRepository.findByTipoEntidadAndEntidadReferenciada(tipoEntidad, entidadId);
    }

    /**
     * Elimina archivo (BD + Storage).
     */
    @Transactional
    public void eliminar(UUID archivoId) {

        Archivo archivo = archivoRepository.findById(archivoId)
                .orElseThrow(() -> new RuntimeException("Archivo no encontrado"));

        almacenamientoService.delete(archivo.getRutaArchivo());

        archivoRepository.delete(archivo);
    }

    /**
     * Genera una key ordenada y escalable.
     */
    private String generarKey(
            TipoEntidad tipoEntidad,
            Long entidadId,
            TipoArchivo tipoArchivo,
            String nombreOriginal
    ) {

        String extension = extraerExtension(nombreOriginal);
        String uuid = UUID.randomUUID().toString();

        return tipoEntidad.name().toLowerCase() + "/"
                + entidadId + "/"
                + tipoArchivo.name().toLowerCase() + "/"
                + uuid + extension;
    }

    private String extraerExtension(String nombre) {
        int index = nombre.lastIndexOf(".");
        return index == -1 ? "" : nombre.substring(index);
    }

    public UUID subirFotoPerfil(Usuario usuario, MultipartFile fotoDePerfil){
        try (InputStream is = fotoDePerfil.getInputStream()) {

            Archivo archivo = this.subir(
                    TipoEntidad.USUARIO,
                    usuario.getId(),
                    TipoArchivo.USUARIO_FOTO_PERFIL,
                    fotoDePerfil.getOriginalFilename(),
                    is,
                    fotoDePerfil.getSize(),
                    fotoDePerfil.getContentType()
            );

            return archivo.getId();

        } catch (IOException e) {
            throw new ServiceException(this.getClass(), "Error leyendo archivo subido");
        }
    }
}