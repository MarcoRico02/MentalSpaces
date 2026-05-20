package mx.sisati.sisatibackend.faq.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para crear/actualizar una pregunta de FAQ
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateUpdatePreguntaFaqDto {
    private Long categoriaId;
    private String pregunta;
    private String respuesta;
    private Integer orden;
    private Boolean activa = true;
}

