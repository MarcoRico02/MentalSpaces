package mx.sisati.sisatibackend.faq.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para respuestas de Categoría FAQ
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CategoriaFaqDto {
    private Long id;
    private String nombre;
    private String descripcion;
    private Integer orden;
    private Boolean activa;
    private String icono;
}

