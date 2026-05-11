package mx.sisati.sisatibackend.faq.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO que combina una Categoría con sus Preguntas asociadas
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CategoriaPreguntasDto {
    private CategoriaFaqDto categoria;
    private List<PreguntaFaqDto> preguntas;
}

