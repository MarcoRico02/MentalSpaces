package mx.sisati.sisatibackend.faq.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para crear/actualizar una categoría de FAQ
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateUpdateCategoriaFaqDto {
    private String nombre;
    private String descripcion;
    private String icono;
    private Integer orden;
    private Boolean activa = true;
}

