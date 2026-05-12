package mx.sisati.sisatibackend.faq;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mx.sisati.sisatibackend.faq.dto.CategoriaPreguntasDto;
import mx.sisati.sisatibackend.faq.dto.CategoriaFaqDto;
import mx.sisati.sisatibackend.faq.dto.PreguntaFaqDto;
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

    /**
     * Mapea una categoría a CategoriaPreguntasDto junto a sus preguntas
     */
    private CategoriaPreguntasDto mapearCategoriaPreguntasDto(CategoriaFaq categoria) {
        try {
            log.debug("Mapeando categoría: {}", categoria.getNombre());

            // Get the category ID for query
            Long categoriaId = categoria.getId();

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

