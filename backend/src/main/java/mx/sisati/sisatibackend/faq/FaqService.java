package mx.sisati.sisatibackend.faq;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mx.sisati.sisatibackend.faq.dto.CategoriaPreguntasDto;
import mx.sisati.sisatibackend.faq.dto.CategoriaFaqDto;
import mx.sisati.sisatibackend.faq.dto.PreguntaFaqDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
     * Obtiene todas las categorías con sus preguntas
     */
    public List<CategoriaPreguntasDto> obtenerTodas() {
        log.info("Obteniendo todas las categorías de FAQs con sus preguntas");

        List<CategoriaFaq> categorias = categoriaFaqRepository.findByActivaTrueOrderByOrden();

        return categorias.stream()
            .map(this::mapearCategoriaPreguntasDto)
            .collect(Collectors.toList());
    }

    /**
     * Obtiene preguntas de una categoría específica
     */
    public CategoriaPreguntasDto obtenerPorCategoria(String categoriaNombre) {
        log.info("Obteniendo preguntas para la categoría: {}", categoriaNombre);

        CategoriaFaq categoria = categoriaFaqRepository.findByNombre(categoriaNombre);

        if (categoria == null) {
            log.warn("Categoría no encontrada: {}", categoriaNombre);
            return null;
        }

        return mapearCategoriaPreguntasDto(categoria);
    }

    /**
     * Mapea una categoría a CategoriaPreguntasDto junto a sus preguntas
     */
    private CategoriaPreguntasDto mapearCategoriaPreguntasDto(CategoriaFaq categoria) {
        List<PreguntaFaq> preguntas = preguntaFaqRepository.findByCategoriaNombreAndActivaTrueOrderByOrden(categoria.getNombre());

        List<PreguntaFaqDto> preguntasDto = preguntas.stream()
            .map(this::mapearPreguntaFaqDto)
            .collect(Collectors.toList());

        return CategoriaPreguntasDto.builder()
            .categoria(mapearCategoriaFaqDto(categoria))
            .preguntas(preguntasDto)
            .build();
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
        return PreguntaFaqDto.builder()
            .id(pregunta.getId())
            .categoriaId(pregunta.getCategoria().getId())
            .pregunta(pregunta.getPregunta())
            .respuesta(pregunta.getRespuesta())
            .orden(pregunta.getOrden())
            .activa(pregunta.getActiva())
            .build();
    }
}

