package mx.sisati.sisatibackend.faq.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para respuestas de Pregunta FAQ
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PreguntaFaqDto {
    private Long id;
    private Long categoriaId;
    private String pregunta;
    private String respuesta;
    private Integer orden;
    private Boolean activa;
}

