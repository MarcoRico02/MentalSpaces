package mx.sisati.sisatibackend.faq;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mx.sisati.sisatibackend.faq.dto.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Servicio para gestionar Preguntas Frecuentes (FAQs)
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class FaqService {

    private final CategoriaFaqRepository categoriaFaqRepository;
    private final PreguntaFaqRepository preguntaFaqRepository;

    /**
     * Normaliza una cadena removiendo acentos y espacios extra
     * Permite búsquedas sin importar acentos
     */
    private String normalizarParaBusqueda(String texto) {
        if (texto == null) return "";
        return Normalizer.normalize(texto, Normalizer.Form.NFD)
                .replaceAll("[\\p{InCombiningDiacriticalMarks}]", "")
                .toLowerCase()
                .trim();
    }

    /**
     * Obtiene todas las categorías con sus preguntas
     */
    public List<CategoriaPreguntasDto> obtenerTodas() {
        log.info("Obteniendo todas las categorías de FAQs con sus preguntas");

        try {
            List<CategoriaFaq> categorias = categoriaFaqRepository.findByActivaTrueOrderByOrden();
            log.debug("Encontradas {} categorías activas", categorias.size());

            if (categorias.isEmpty()) {
                log.warn("No hay categorías de FAQs activas");
                return new ArrayList<>();
            }

            List<CategoriaPreguntasDto> resultado = categorias.stream()
                    .map(this::mapearCategoriaPreguntasDto)
                    .collect(Collectors.toList());

            log.debug("Preparadas {} categorías con sus preguntas para retornar", resultado.size());
            return resultado;
        } catch (Exception e) {
            log.error("Error al obtener todas las categorías de FAQs", e);
            throw new RuntimeException("Error al obtener FAQs: " + e.getMessage(), e);
        }
    }

    /**
     * Obtiene preguntas de una categoría específica
     */
    public CategoriaPreguntasDto obtenerPorCategoria(String categoriaNombre) {
        log.info("Obteniendo preguntas para la categoría: {}", categoriaNombre);

        try {
            CategoriaFaq categoria = categoriaFaqRepository.findByNombre(categoriaNombre);

            if (categoria == null) {
                log.warn("Categoría no encontrada: {}", categoriaNombre);
                return null;
            }

            return mapearCategoriaPreguntasDto(categoria);
        } catch (Exception e) {
            log.error("Error al obtener preguntas de la categoría: {}", categoriaNombre, e);
            throw new RuntimeException("Error al obtener FAQs: " + e.getMessage(), e);
        }
    }

    /**
     * Busca preguntas por término de búsqueda sin importar acentos
     * Busca tanto en la pregunta como en la respuesta
     */
    public List<PreguntaFaqDto> buscarPreguntas(String query) {
        log.info("Buscando preguntas con query: {}", query);

        try {
            if (query == null || query.trim().isEmpty()) {
                log.debug("Query vacío, retornando lista vacía");
                return new ArrayList<>();
            }

            String queryNormalizado = normalizarParaBusqueda(query);
            log.debug("Query normalizado: {}", queryNormalizado);

            // Obtener todas las preguntas activas
            List<PreguntaFaq> todasLasPreguntas = preguntaFaqRepository.findByActivaTrueOrderByCategoria_OrdenAscOrdenAsc();

            // Filtrar por coincidencia sin acentos
            List<PreguntaFaqDto> resultados = todasLasPreguntas.stream()
                    .filter(pregunta -> {
                        String preguntaNormalizada = normalizarParaBusqueda(pregunta.getPregunta());
                        String respuestaNormalizada = normalizarParaBusqueda(pregunta.getRespuesta());
                        return preguntaNormalizada.contains(queryNormalizado) ||
                               respuestaNormalizada.contains(queryNormalizado);
                    })
                    .map(this::mapearPreguntaFaqDto)
                    .collect(Collectors.toList());

            log.debug("Se encontraron {} resultados para la búsqueda", resultados.size());
            return resultados;
        } catch (Exception e) {
            log.error("Error al buscar preguntas: {}", query, e);
            throw new RuntimeException("Error al buscar FAQs: " + e.getMessage(), e);
        }
    }

    // ============ CRUD ADMIN METHODS ============

    /**
     * Crea una nueva categoría de FAQ
     */
    @Transactional
    public CategoriaFaqDto crearCategoria(CreateUpdateCategoriaFaqDto dto) {
        log.info("Creando nueva categoría: {}", dto.getNombre());

        try {
            // Verificar que no existe una categoría con el mismo nombre
            CategoriaFaq existente = categoriaFaqRepository.findByNombre(dto.getNombre());
            if (existente != null) {
                throw new IllegalArgumentException("Ya existe una categoría con el nombre: " + dto.getNombre());
            }

            CategoriaFaq categoria = CategoriaFaq.builder()
                    .nombre(dto.getNombre())
                    .descripcion(dto.getDescripcion())
                    .icono(dto.getIcono())
                    .orden(dto.getOrden() != null ? dto.getOrden() : 0)
                    .activa(dto.getActiva() != null ? dto.getActiva() : true)
                    .build();

            categoriaFaqRepository.save(categoria);
            log.info("Categoría creada exitosamente con id: {}", categoria.getId());

            return mapearCategoriaFaqDto(categoria);
        } catch (Exception e) {
            log.error("Error al crear categoría", e);
            throw new RuntimeException("Error al crear categoría: " + e.getMessage(), e);
        }
    }

    /**
     * Actualiza una categoría de FAQ
     */
    @Transactional
    public CategoriaFaqDto actualizarCategoria(Long id, CreateUpdateCategoriaFaqDto dto) {
        log.info("Actualizando categoría con id: {}", id);

        try {
            CategoriaFaq categoria = categoriaFaqRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con id: " + id));

            // Verificar nombre único (si es diferente al actual)
            if (!categoria.getNombre().equals(dto.getNombre())) {
                CategoriaFaq existente = categoriaFaqRepository.findByNombre(dto.getNombre());
                if (existente != null) {
                    throw new IllegalArgumentException("Ya existe una categoría con el nombre: " + dto.getNombre());
                }
            }

            categoria.setNombre(dto.getNombre());
            categoria.setDescripcion(dto.getDescripcion());
            categoria.setIcono(dto.getIcono());
            categoria.setOrden(dto.getOrden() != null ? dto.getOrden() : categoria.getOrden());
            categoria.setActiva(dto.getActiva() != null ? dto.getActiva() : categoria.getActiva());

            categoriaFaqRepository.save(categoria);
            log.info("Categoría actualizada exitosamente");

            return mapearCategoriaFaqDto(categoria);
        } catch (Exception e) {
            log.error("Error al actualizar categoría con id: {}", id, e);
            throw new RuntimeException("Error al actualizar categoría: " + e.getMessage(), e);
        }
    }

    /**
     * Elimina una categoría de FAQ
     */
    @Transactional
    public void eliminarCategoria(Long id) {
        log.info("Eliminando categoría con id: {}", id);

        try {
            CategoriaFaq categoria = categoriaFaqRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con id: " + id));

            // Eliminar todas las preguntas asociadas
            List<PreguntaFaq> preguntas = preguntaFaqRepository.findByCategoriaId(id);
            preguntaFaqRepository.deleteAll(preguntas);

            // Eliminar categoría
            categoriaFaqRepository.delete(categoria);
            log.info("Categoría eliminada exitosamente");
        } catch (Exception e) {
            log.error("Error al eliminar categoría con id: {}", id, e);
            throw new RuntimeException("Error al eliminar categoría: " + e.getMessage(), e);
        }
    }

    /**
     * Crea una nueva pregunta de FAQ
     */
    @Transactional
    public PreguntaFaqDto crearPregunta(CreateUpdatePreguntaFaqDto dto) {
        log.info("Creando nueva pregunta para categoría id: {}", dto.getCategoriaId());

        try {
            CategoriaFaq categoria = categoriaFaqRepository.findById(dto.getCategoriaId())
                    .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con id: " + dto.getCategoriaId()));

            PreguntaFaq pregunta = PreguntaFaq.builder()
                    .categoria(categoria)
                    .pregunta(dto.getPregunta())
                    .respuesta(dto.getRespuesta())
                    .orden(dto.getOrden() != null ? dto.getOrden() : 0)
                    .activa(dto.getActiva() != null ? dto.getActiva() : true)
                    .build();

            preguntaFaqRepository.save(pregunta);
            log.info("Pregunta creada exitosamente con id: {}", pregunta.getId());

            return mapearPreguntaFaqDto(pregunta);
        } catch (Exception e) {
            log.error("Error al crear pregunta", e);
            throw new RuntimeException("Error al crear pregunta: " + e.getMessage(), e);
        }
    }

    /**
     * Actualiza una pregunta de FAQ
     */
    @Transactional
    public PreguntaFaqDto actualizarPregunta(Long id, CreateUpdatePreguntaFaqDto dto) {
        log.info("Actualizando pregunta con id: {}", id);

        try {
            PreguntaFaq pregunta = preguntaFaqRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Pregunta no encontrada con id: " + id));

            // Si cambió la categoría, validar que exista
            if (!pregunta.getCategoria().getId().equals(dto.getCategoriaId())) {
                CategoriaFaq nuevaCategoria = categoriaFaqRepository.findById(dto.getCategoriaId())
                        .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con id: " + dto.getCategoriaId()));
                pregunta.setCategoria(nuevaCategoria);
            }

            pregunta.setPregunta(dto.getPregunta());
            pregunta.setRespuesta(dto.getRespuesta());
            pregunta.setOrden(dto.getOrden() != null ? dto.getOrden() : pregunta.getOrden());
            pregunta.setActiva(dto.getActiva() != null ? dto.getActiva() : pregunta.getActiva());

            preguntaFaqRepository.save(pregunta);
            log.info("Pregunta actualizada exitosamente");

            return mapearPreguntaFaqDto(pregunta);
        } catch (Exception e) {
            log.error("Error al actualizar pregunta con id: {}", id, e);
            throw new RuntimeException("Error al actualizar pregunta: " + e.getMessage(), e);
        }
    }

    /**
     * Elimina una pregunta de FAQ
     */
    @Transactional
    public void eliminarPregunta(Long id) {
        log.info("Eliminando pregunta con id: {}", id);

        try {
            PreguntaFaq pregunta = preguntaFaqRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Pregunta no encontrada con id: " + id));

            preguntaFaqRepository.delete(pregunta);
            log.info("Pregunta eliminada exitosamente");
        } catch (Exception e) {
            log.error("Error al eliminar pregunta con id: {}", id, e);
            throw new RuntimeException("Error al eliminar pregunta: " + e.getMessage(), e);
        }
    }

    /**
     * Mapea una categoría a CategoriaPreguntasDto junto a sus preguntas
     */
    private CategoriaPreguntasDto mapearCategoriaPreguntasDto(CategoriaFaq categoria) {
        try {
            log.debug("Mapeando categoría: {}", categoria.getNombre());


            // Query preguntas by categoria_id instead of nombre to avoid query issues
            List<PreguntaFaq> preguntas = preguntaFaqRepository.findByCategoriaNombreAndActivaTrueOrderByOrden(categoria.getNombre());

            log.debug("Se encontraron {} preguntas para la categoría: {}", preguntas.size(), categoria.getNombre());

            List<PreguntaFaqDto> preguntasDto = preguntas.stream()
                    .map(this::mapearPreguntaFaqDto)
                    .collect(Collectors.toList());

            CategoriaPreguntasDto resultado = CategoriaPreguntasDto.builder()
                    .categoria(mapearCategoriaFaqDto(categoria))
                    .preguntas(preguntasDto)
                    .build();

            log.debug("Mapeo completado para la categoría: {}", categoria.getNombre());
            return resultado;
        } catch (Exception e) {
            log.error("Error mapeando categoría: {}", categoria.getNombre(), e);
            throw new RuntimeException("Error al mapear categoría: " + e.getMessage(), e);
        }
    }

    /**
     * Mapea una CategoriaFaq a CategoriaFaqDto
     */
    private CategoriaFaqDto mapearCategoriaFaqDto(CategoriaFaq categoria) {
        return CategoriaFaqDto.builder()
                .id(categoria.getId())
                .nombre(categoria.getNombre())
                .descripcion(categoria.getDescripcion())
                .orden(categoria.getOrden())
                .activa(categoria.getActiva())
                .icono(categoria.getIcono())
                .build();
    }

    /**
     * Mapea una PreguntaFaq a PreguntaFaqDto
     */
    private PreguntaFaqDto mapearPreguntaFaqDto(PreguntaFaq pregunta) {
        try {
            return PreguntaFaqDto.builder()
                    .id(pregunta.getId())
                    .categoriaId(pregunta.getCategoria().getId())
                    .pregunta(pregunta.getPregunta())
                    .respuesta(pregunta.getRespuesta())
                    .orden(pregunta.getOrden())
                    .activa(pregunta.getActiva())
                    .build();
        } catch (Exception e) {
            log.error("Error mapeando pregunta con id: {}", pregunta.getId(), e);
            throw new RuntimeException("Error al mapear pregunta: " + e.getMessage(), e);
        }
    }
}

